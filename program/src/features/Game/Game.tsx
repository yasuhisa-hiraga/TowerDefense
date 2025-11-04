import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import TowerList from './TowerList'
import TowerDetail from './TowerDetail'
import StatusMessagePanel from './StatusMessagePanel'
import NextWaveMessage from './NextWaveMessage'
import FieldCanvas from './FieldCanvas'
import UnitCanvas from './UnitCanvas'
import { Enemy } from './models/Enemy';
// import { Tower } from './models/Tower';
import { Bfs } from './models/Bfs'
import {MAP_DATA, TOWER_DATA_LIST, ENEMY_DATA_LIST, WAVE_DATA_LIST} from '@/data/gameData'
import iconCoin from '@/assets/img/icon_coin_tower.png'
import iconLife from '@/assets/img/icon_fav_full.png'
import type { TowerData, MapIndex } from '@/types/game'
import type { UnitCanvasRefHandle } from '@/features/Game/UnitCanvas';

// interface TowerData {
// 	type: string;
// 	cost: number;
// 	speed: number;
// 	power: number;
// 	range: number;
// 	delay: number;
// 	lv: number;
// }

// /**
//  * MAP_DATAの配列参照用
//  */
// interface MapIndex{
// 	x: number;
// 	y: number;
// }

function Game(){

	console.log('Game が再レンダリングされました');

	// unitCanvasに受け渡す専用のref
	// const unitRef = useRef( null );
	const unitRef = useRef<UnitCanvasRefHandle | null>(null);

	// const [isVisibleStartBtn , setVisibleStartBtn] = useState( true );
	// const [isVisiblePlayStopBtn , setVisiblePlayStopBtn] = useState( false );

	// 再レンダリング不要な変数
	const enemyCountRef = useRef(0);//出撃エネミー数のカウントアップ//減少しない
	const towerCountRef = useRef(0);//配置してるタワーのカウントアップ//減少しない
	const waveIndex = useRef(0);
	const enemyIndex = useRef(0);//wave毎のエネミーのindex

	// 再レンダリングが必要な変数
	const [coin, setCoin] = useState( 100 );
	const [life, setLife] = useState( 100 );
	const [message, setMessage] = useState( '' );
	const [currentSelectTower, setCurrentSelectTower] = useState<TowerData|null>(null);
	const [towerDataList, setTowerData ] = useState<TowerData[]>(TOWER_DATA_LIST);
	const [mapData, setMapData] = useState(MAP_DATA);
	const [destroyCountInWave, setDestroyCount] = useState(0);
	const [statusMessage, setStatusMessage] = useState('');
	const [nextWaveStatus, setNextWaveStatus] = useState('');

	// エネミーのゴールまでの経路探索
	const enemyPath = useMemo(()=>{
		const bfs = new Bfs( MAP_DATA );
		const enemyPath = bfs.getRootPath();
		// console.log( enemyPath )
		return enemyPath;
	},[MAP_DATA]);//MAP_DATAが更新されない限りは再実行しない

	
	// console.log('towerDataList:',towerDataList)

	/**
	 * マップのクリックしたところにタワーを配置する
	 */
	function addTower( type:string , mapIndex:MapIndex ){
		// setCoin( coin+10 )//test

		const t = getTower( type )[0];
		console.log('t:',t)

		const cost = t.cost * t.lv;

		if( coin < cost ){
			console.log('コインが不足しています');
			showStatusMessage('コインが不足しています');
			return;
		}
		else{
			setCoin( coin-cost);
		}

		const towerId = 'tower_' + type + '_' + t.lv + '_' + towerCountRef.current;
		const params = {
			id : towerId,
			lv : t.lv,
			type :t.type,
			cost :t.cost,
			speed:t.speed,
		    power:t.power,
		    range:t.range,
		    delay:t.delay,
		}
		towerCountRef.current++;
		unitRef.current?.addTower( params, mapIndex );

		// mapデータも更新
		setMapData( prev =>{
			// copy
			const newMapData:any[][] = prev.map(row => [...row]);
			// 書き換え
			newMapData[mapIndex.y][mapIndex.x] = towerId;
			return newMapData;
		});
	}

	// enemy追加
	function addEnemy( type:string, delay:number ){

		const e = getEnemy( type )[0];
		const params = {
			id : enemyCountRef.current.toString(),
			type: e.type,
			life: e.life,
			speed: e.speed,
			reward: e.reward,
		}
		enemyCountRef.current++;

		// 新しいエネミーをqueueに追加
		unitRef.current?.addEnemyQueue( params, enemyPath, delay);
	}

	// 常に最新のtowerDataListを参照する
	const getTower = useCallback((type:string) => {
	    return towerDataList.filter((e) => {
	        return e.type == type;
	    });
	}, [towerDataList]);

	const getMapData = useCallback(( x:number,y:number ) => {
	    return mapData[y][x];
	}, [mapData]);

	function getEnemy( type:string ) {
		return ENEMY_DATA_LIST.filter((e)=>{
			return e.type == type;
		});
	}

	
	//================================================
	//
	// handle
	//
	//================================================

	/**
	 * タワーが選択された
	 */
	const handleTowerSelect = ( towerData:TowerData )=>{
		setCurrentSelectTower( towerData );
		setMessage(`設置場所をクリックしてください`);
	}

	/**
	 * タワーのアップグレード
	 */
	const handleUpgrade = ( towerInstance:TowerData )=>{
		// console.log( 'coin:', coin)
		// console.log( 'towerInstance:', towerInstance)

		const upgradeCost = towerInstance.cost * towerInstance.lv;

		if( coin < upgradeCost ){
			showStatusMessage('コインが不足しています')
		}
		else{
			// LvUp
			setTowerData( prev =>{
				let updatedTower: TowerData | null = null;
				let list = [];
				for(let i=0;i<prev.length;i++){
					const tower = {...prev[i]};//コピー
					if( tower.type == towerInstance.type ){
						tower.lv += 1;
						list.push( tower );
						updatedTower = tower;
					}
					else{
						list.push( tower );
					}
				}

				// 現在のタワーデータも更新
				if( updatedTower )setCurrentSelectTower( updatedTower );

				return list;
			});

			// コイン減らす
			setCoin( prev =>{
				return prev-upgradeCost;			
			});
		}
	};

	/**
	 * canvasをクリックしたところの mapDataIndex xyを返す
	 * useCallbackによって、指定の変数(あるいは関数)が更新された時だけ、
	 * このcanvasTapを再生成するようにしている
	 * 
	 * @param {x:number,y:number} - mapIndex
	 */
	const canvasTap = ( mapIndex:MapIndex )=>{
		// クリックしたとこのマップ情報
		const mapDataInfo:any = getMapData( mapIndex.x, mapIndex.y );
		console.log('mapDataInfo:',mapDataInfo)
		if( currentSelectTower && mapDataInfo == 0 ){
			// 設置
			addTower( currentSelectTower.type , mapIndex );
		}

		// タワーの場合は除去してコインに戻す
		else if( typeof mapDataInfo == 'string'){
			// 削除
			unitRef.current?.removeTower( {id:mapDataInfo} );

			// キャンバス更新
			unitRef.current?.refreshCanvasManually();

			// コインを増加
			setCoin( prev =>{
				const type = mapDataInfo.split('_')[1];
				const lv  = Number( mapDataInfo.split('_')[2] );
				let coin = 0;
				switch( type ){
					case 'arrow':
						coin = 50 * lv;
						break;
					case 'canon':
						coin = 100 * lv;
						break;
					case 'wizard':
						coin = 150 * lv;
						break;
				}
				prev += coin;

				return prev;
			});

			// map変更
			setMapData( prev =>{
				// copy
				const newMapData = prev.map(row => [...row]);
				// 書き換え
				newMapData[mapIndex.y][mapIndex.x] = 0;
				return newMapData;
			});
		}
	}

	/**
	 * 敵を撃破
	 */
	const handleDestroy = ( enemy:Enemy ) =>{
		setCoin( prev => {
	        // 更新後の値を返す
	        return prev + enemy.reward;
	    });

		// 撃破数増加
	    setDestroyCount( pref =>{
	    	return pref +1;
	    });
	};

	/**
	 * 敵にゴールされた
	 */
	const handleGoal = ( enemy:Enemy ) =>{
		setLife( prevLife => {
	        return prevLife - enemy.life;
	    });

		// 撃破数増加
	    // setDestroyCount( pref =>{
	    // 	return pref +1;
	    // });
	};

	/**
	 * タワー配置のキャンセル
	 */
	const handleTowerCancel =  useCallback(() =>{
		//選択解除
		setCurrentSelectTower( null );
		setMessage(``);
	},[]);

	/**
	 * ゲーム開始
	 */
	// const handleGameStart = ()=>{
	// 	unitRef.current.play();
	// 	setVisibleStartBtn(false);
	// 	setVisiblePlayStopBtn(true);
	// 	goNextWave();
	// };

	/**
	 * 次のwave一時停止
	 */
	const handleStopWave = ()=>{
		setNextWaveStatus('');
		//todo

		// 一旦停止
		// unitRef.current.stop();
		// setBtnLabel('PLAY');
	}

	/**
	 * すぐに次のwaveへ
	 */
	const handleStartWave = ()=>{
		// 開始
		unitRef.current?.play();
		setBtnLabel('STOP');

		setNextWaveStatus('');
	}

	/**
	 * リトライ
	 */
	const handleRetry = ()=>{
		window.location.reload();
	}


	

	// ライフの変動によるゲームオーバー判定
	useEffect(()=>{

		// ゲームオーバー判定
        if( life <= 0 ){
        	setNextWaveStatus('gameover');
            // showStatusMessage('ゲームオーバー');
            // ゲーム停止してリトライ表示
            unitRef.current?.stop();
			setBtnLabel('RETRY');

			return;
        }

        // 次のwave判定
        const wave = WAVE_DATA_LIST[waveIndex.current];
		if( destroyCountInWave >= wave.enemylist.length ){
			// showStatusMessage('wave クリア')
			setCoin( coin + wave.reward );
			waveIndex.current++;

			if( waveIndex.current >= WAVE_DATA_LIST.length ){
				// showStatusMessage('ゲームクリア!');

				setNextWaveStatus('clear');

				// ゲーム停止してリトライ表示
	            unitRef.current?.stop();
				setBtnLabel('RETRY');
			}
			else{

				// 次のwave
				setNextWaveStatus('next');
				goNextWave();

				// 一旦停止
				unitRef.current?.stop();
				setBtnLabel('PLAY');

			}
		}


	},[life,destroyCountInWave]);

	// 撃破したら次のWAVE
	// useEffect(()=>{
	// 	const wave = WAVE_DATA_LIST[waveIndex.current];

	// 	if( destroyCountInWave >= wave.enemylist.length ){
	// 		// showStatusMessage('wave クリア')
	// 		setCoin( coin + wave.reward );
	// 		waveIndex.current++;

	// 		if( waveIndex.current >= WAVE_DATA_LIST.length ){
	// 			// showStatusMessage('ゲームクリア!');

	// 			setNextWaveStatus('clear');

	// 			// ゲーム停止してリトライ表示
	//             unitRef.current.stop();
	// 			setBtnLabel('RETRY');
	// 		}
	// 		else{

	// 			// 次のwave
	// 			setNextWaveStatus('next');
	// 			goNextWave();

	// 			// 一旦停止
	// 			unitRef.current.stop();
	// 			setBtnLabel('PLAY');

	// 		}
			
	// 	}
	// },[destroyCountInWave]);

	/**
	 * 次のエネミー
	 */
	const goNextWave = ()=>{
		console.log('つぎのwaveへ')

		// エネミーの出現も戻す
		enemyIndex.current = 0;

		// 破壊した数をリセット
		setDestroyCount( _prev =>{
			return 0;
		})

		// エネミー配置
		addNextEnemy();
	};

	const addNextEnemy = ()=>{
		const wave = WAVE_DATA_LIST[waveIndex.current];
		if( enemyIndex.current < wave.enemylist.length ){
			const waveEnemy = wave.enemylist[enemyIndex.current];
			console.log('waveEnemy:',waveEnemy);
			addEnemy( waveEnemy.type, waveEnemy.delay );
			enemyIndex.current++;
			addNextEnemy();
		}else{
			console.log('このwave全員でた');
		}
	}

	// 現状メッセージ
	const statusMessageTimerRef = useRef<number | null>(null);
	function showStatusMessage( message:string ){
		if( statusMessageTimerRef.current  ){
			clearTimeout( statusMessageTimerRef.current );
		}
		setStatusMessage( message );
		statusMessageTimerRef.current = setTimeout(()=>{
			setStatusMessage('');
		},2000);
	}


	// 停止と再開
	const [btnLabel,setBtnLabel] = useState('GAME START');
	const playStop = () =>{
		switch( btnLabel ){
			case 'GAME START':
				unitRef.current?.play();
				goNextWave();
				setBtnLabel('STOP');
				break;

			case 'STOP':
				unitRef.current?.stop();
				setBtnLabel('PLAY');
				break;

			case 'PLAY':
				unitRef.current?.play();
				setBtnLabel('STOP');
				break;

			case 'RETRY':
				// リロード
				window.location.reload();
				break;
		}
	}

	return (
		<>
		<div className="flex flex-row p-10 bg-black text-white relative">

			<div className="flex flex-col p-4 w-80 gap-1">
				<div>WAVE {Math.min(waveIndex.current+1,WAVE_DATA_LIST.length)}/{WAVE_DATA_LIST.length} </div>
				<button className="bg-orange-400 text-white p-4 shadow-md rounded-md hover:bg-gray-400" onClick={ playStop } >{btnLabel}</button>
				<ul className="flex flex-row gap-1 p-4">
					<li className="flex flex-row gap-1 w-1/2"><img src={iconLife} className="w-6 object-contain"/>:{life}</li>
					<li className="flex flex-row gap-1 w-1/2"><img src={iconCoin} className="w-6 object-contain"/>:{coin}</li>
				</ul>

				<h1>設置したいタワーを選んでください</h1>

				<TowerList towerDataList={towerDataList} onTowerSelect={handleTowerSelect}/>
				{currentSelectTower && 
					<TowerDetail towerData={currentSelectTower} 
			  			onCancel={handleTowerCancel}
			  			onUpgrade={handleUpgrade}
			  		>{message}</TowerDetail>
		  		}

			</div>


			<div>
		  		<div className="h-16">
					<StatusMessagePanel>{statusMessage}</StatusMessagePanel>
				</div>

			  	<div className="game-canvas-container">
					<FieldCanvas mapData={mapData}></FieldCanvas>
					<UnitCanvas 
						ref={unitRef} 
						onTap={canvasTap} onDestroy={handleDestroy} onGoal={handleGoal}
					></UnitCanvas>
				</div>
			</div>

			<NextWaveMessage onStart={handleStartWave} onStop={handleStopWave} onRetry={handleRetry} status={nextWaveStatus} />
		</div>
		</>

	)
}

export default Game;