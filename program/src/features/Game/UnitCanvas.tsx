import React, { useRef, forwardRef, useImperativeHandle, useEffect, useState, memo } from 'react';
import '@/App.css'
import { Bfs } from './models/Bfs';
import { Enemy } from './models/Enemy';
import { Tower } from './models/Tower';
import { Bullet } from './models/Bullet';
import { GRID_SIZE } from '@/data/gameData';

/**
 * enemyやtowerの描画を管理
 * 親からの命令を受け付けるようにする
 */
const UnitCanvas = forwardRef(({mapData,onTap,onDestroy,onGoal},ref) =>{

	console.log('UnitCanvas が再レンダリングされました');

	// ゲームにつかうパラメータ
	let enemyListRef    = useRef<Enemy[]>([]);
	let towerListRef    = useRef<Tower[]>([]);
	let bulletListRef   = useRef<Bullet[]>([]);
	let hitCanonListRef = useRef<any[]>([]);//大砲に当たった相手の記録
	let standbyEnemyRef = useRef(null);
	// enemy配置queue
	let enemyQueueRef = useRef([]);
	const enqueueEnemy = ( queue ) => {
		console.log('queue:',queue)
	  enemyQueueRef.current.push(queue);
	};
	const dequeueEnemy = () => {
	    if (enemyQueueRef.current.length > 0) {
	      const enemy = enemyQueueRef.current.shift(); 
	      return enemy;
	    }
	    return null;
	};

	// ゲームハンドラー
	let isMounted = useRef(false);
	let isPlayRef = useRef(false);

	// キャンバス
	const canvasRef = useRef();

	// 親(ref)に対して公開するロジックを定義
	useImperativeHandle(ref,()=>({
		// addEnemy:addEnemy,
		addEnemyQueue:addEnemyQueue,
		addTower:addTower,
		removeTower:removeTower,
		refreshCanvasManually:refreshCanvasManually,
		stop: stop,
		play: play,
	}))


	//================================================
	// マウントされたことを記録
	//================================================
	useEffect(() => {
	    isMounted.current = true;
	}, []);


	// canvas
	const size  = GRID_SIZE;
	const sizeW = size*15;
	const sizeH = size*15;
	return (
	    <canvas width={sizeW} height={sizeH} ref={canvasRef} onClick={handleClick} className="game-canvas-anime"/>
	);

	//================================================
	// 
	// public 関数
	//
	//================================================

	/**
	 * エネミー追加
	 * @param {object} - params
	 * @param {x:number,y:number} - path mapData Index 
	 */
	function addEnemy( params:object, path:string[] ){
		const enemy = new Enemy( params, path );
		enemyListRef.current.push( enemy );
	}

	function addEnemyQueue( params:object, path:string[], delay:number ) {
		enqueueEnemy({params:params,path:path,delay:delay});
	}

	/**
	 * タワー配置
	 * 
	 * @param {object} - params
	 * @param {x:number,y:number} - position mapData Index 
	 */
	function addTower( params:object, position:{x:number,y:number} ) {
		const tower = new Tower( params, position );
		towerListRef.current.push( tower );
		console.log('towerListRef.current:',towerListRef.current)

		// 置いた瞬間の描画(anime停止してても可能)
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		drawTowerList( ctx , 0);
	}

	/**
	 * 一時停止
	 */
	function stop() {
		isPlayRef.current = false;
	}

	/**
	 * 開始/再開
	 */
	function play() {
		if( !isMounted.current ){
			alert('loading..');
			return;
		}
		const an = canvasRef.current;
		const ctx = an.getContext('2d');
		isPlayRef.current = true;
		gameStart( ctx, mapData );
	}


	//================================================
	//
	// プライベート関数
	//
	//================================================

	/**
	 * クリックされた場所のmapIndexを返す
	 */
	function handleClick( e:React.MouseEvent<HTMLCanvasElement> ){
		const canvas = canvasRef.current;
		  if (!canvas) return;
		  
		  // 1. Canvas の位置と寸法を取得
		  const rect = canvas.getBoundingClientRect();

		  // 2. ビューポート基準のクリック座標を取得
		  const clientX = e.clientX;
		  const clientY = e.clientY;

		  // 3. Canvas 内での相対座標（生の座標）を計算
		  const rawX = clientX - rect.left;
		  const rawY = clientY - rect.top;

		  // 4. (重要: スタイリングなどでCanvasのサイズをCSSで変えている場合)
		  // CSSとCanvasの描画バッファサイズの違いを補正する
		  const scaleX = canvas.width / rect.width;
		  const scaleY = canvas.height / rect.height;

		  const px = rawX * scaleX;
		  const py = rawY * scaleY;

		  // console.log(`Canvas座標: px=${px}, py=${py}`);

		  const x = Math.floor( px / size );
		  const y = Math.floor( py / size );

		  onTap( {x:x,y:y})
	}

	

	/**
	 * 描画の開始
	 * @param {CanvasRenderingContext2D} ctx - canvasのコンテキスト
	 * @param 
	 * @returns {void}
	 */
	function gameStart( ctx:CanvasRenderingContext2D, mapData:array ){

		console.log('ゲーム開始')
		let lastTime = 0; 
    	let isInitialFrameAfterResume = true;

		function animate( timestamp ){
			// console.log('animate:',timestamp)

			// ゲーム一時停止
			if (!isPlayRef.current) {
	            console.log('ゲーム停止');
	            isInitialFrameAfterResume = true; // 次回再開時のためにフラグをリセット
	            return; 
	        }

	        // 再開した
			if (isInitialFrameAfterResume) {
	            lastTime = timestamp; // lastTime を現在の絶対時刻に合わせる
	            isInitialFrameAfterResume = false;
	        }

			// 時間差分計算
			const deltaTime = timestamp - lastTime;
        	lastTime = timestamp; // 次のフレームのために現在の時刻を保存

			// 次のエネミースタンバイ
			if( !standbyEnemyRef.current ){
				// console.log('standby')
				standbyEnemyRef.current = dequeueEnemy();
			}
			else{
				// 待機時間を過ぎたら配置
				standbyEnemyRef.current.delay -= deltaTime;
				// console.log('standbyEnemyRef.current.delay:',standbyEnemyRef.current.delay)
				if( standbyEnemyRef.current.delay <= 0){
					addEnemy( standbyEnemyRef.current.params, standbyEnemyRef.current.path );
					standbyEnemyRef.current = null;
				}
			}

			// 画面の更新
			refreshCanvas( ctx, timestamp );

			// 描画クリア
			// ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			
			// // エネミー
			// drawEnemyList( ctx );

			// // タワー
			// drawTowerList( ctx, timestamp );

			// // 弾
			// drawBulletList( ctx, timestamp );

			window.requestAnimationFrame(animate);
		}
		// 開始
		window.requestAnimationFrame(animate);
	}


	function refreshCanvas( ctx:CanvasRenderingContext2D, timestamp:number ) {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		
		// エネミー
		drawEnemyList( ctx );

		// タワー
		drawTowerList( ctx, timestamp );

		// 弾
		drawBulletList( ctx, timestamp );
	}

	// 手動でのキャンバス更新
	function refreshCanvasManually() {
		const an = canvasRef.current;
		const ctx = an.getContext('2d');
		refreshCanvas(ctx,0);
	}


	// enemy
	function drawEnemyList( ctx:CanvasRenderingContext2D ){
		for( let i=0;i<enemyListRef.current.length;i++ ){
			const enemy = enemyListRef.current[i];

			enemy.move();
			// drawEnemy( ctx , enemy );
			enemy.draw( ctx );

			// ライフが0
			if(enemy.life <= 0 ){
				console.log('撃破した!')
				removeEnemy( enemy );
				onDestroy( enemy );
			}

			if(enemy.isGoal){
				console.log('ゴールされた!')

				// エネミーの残りライフ分ダメージ
				// onDamaged( enemy.life );
				onGoal( enemy );
				onDestroy( enemy );

				// エネミー削除
				removeEnemy( enemy );

			}
		}
	}

	// enemy削除
	function removeEnemy( enemy:Enemy ) {
		let list = [];
		for( let i=0;i<enemyListRef.current.length;i++ ){
			const e = enemyListRef.current[i];

			if( e.id != enemy.id ){
				list.push( e );
			}
		}
		// リストを更新
		enemyListRef.current = list;

		// 削除=デストロイ
		// onDestroy( enemy );
	}

	//================================================
	// タワー
	//================================================
	// タワーの描画
	function drawTowerList( ctx:CanvasRenderingContext2D, time:number ){
		for( let i=0;i<towerListRef.current.length;i++ ){
			const t = towerListRef.current[i];

			// 描画
			t.draw( ctx );

			// 攻撃対象を獲得
			let targetEnemyList = t.update( enemyListRef.current, time );
			// ターゲットに発射
			addBullets( t, targetEnemyList );
		}
	}

	// tower削除
	function removeTower( tower:Tower ) {
		console.log('remove tower :' , tower )
		let list = [];
		for( let i=0;i<towerListRef.current.length;i++ ){
			const t = towerListRef.current[i];

			if( t.id != tower.id ){
				list.push( t );
			}
		}
		// リストを更新
		towerListRef.current = list;
	}

	//================================================
	// 発射された弾の管理
	//================================================
	function addBullets( owner:Tower, targetList:Enemy[] ) {
		for(let i=0;i<targetList.length;i++){
			let target = targetList[i];
			addBullet( owner, target );
		}
	}
	// 指定の場所に玉を飛ばす
	function addBullet( owner:Tower, target:Enemy ) {
		const startX = owner.position.x * GRID_SIZE;
		const startY = owner.position.y * GRID_SIZE;
		const targetX = target.position.x * GRID_SIZE;
		const targetY = target.position.y * GRID_SIZE;
		const speed  = owner.speed * owner.lv;
		const damage = owner.power * owner.lv;
		console.log('damage:',damage);
		const id = new Date().getTime();
		const bullet = new Bullet( id, startX, startY, targetX, targetY, speed, damage, owner.type );

		bulletListRef.current.push( bullet );
	}

	function drawBulletList( ctx:CanvasRenderingContext2D, time:number ){
		for( let i=0;i<bulletListRef.current.length;i++ ){
			const b = bulletListRef.current[i];
			b.update();
			b.draw(ctx);

			// 画面外に飛んでったら消す
			if(b.x >= 1000 || b.x <= 0 ){
				removeBullet( b );
			}
			else if( b.y >= 1000 || b.y <= 0 ){
				removeBullet( b );
			}
			else{
				// 当たり判定
				hitCheckEnemyList( b );
			}
		}
	}

	// エネミー全体に対して着弾判定
	function hitCheckEnemyList( bullet:Bullet ) {
		// let _isHit = false
		for( let i=0;i<enemyListRef.current.length;i++ ){
			const enemy = enemyListRef.current[i];
			// 当たり判定内で、かつ同じ弾じゃなければダメージ
			if( isHit( enemy, bullet ) && !isHitedBullet( bullet, enemy ) ){
				
				// arrowは誰か1人に当たったら終わり
				if(bullet.type == 'arrow'){
					enemy.life -= bullet.damage;
					removeBullet( bullet );
					break;
				}

				// canonの弾は消さないが同じ相手には当たらないように、hit記録をつける
				if(bullet.type == 'canon'){
					enemy.life -= bullet.damage;
					hitCanonListRef.current.push({
						bulletId:bullet.id,
						enemyId:enemy.id,
					})
				}

				// wizardはダメージはないが、速度を低下させる
				if(bullet.type == 'wizard'){
					enemy.speed -= bullet.damage;
					if( enemy.speed <0.1) enemy.speed = 0.1;//最低値
					removeBullet( bullet );
					break;
				}
			}
		}
	}

	// この弾にすでに当たっているかどうか
	function isHitedBullet( bullet:Bullet , enemy:Enemy ) {
		for(let i=0;i<hitCanonListRef.current.length;i++){
			const h = hitCanonListRef.current[i];
			if( h.bulletId == bullet.id && h.enemyId == enemy.id ){
				return true;
			}
		}
		return false;
	}

	// 着弾判定
	function isHit( enemy:Enemy, bullet:Bullet ) {
		// 実際の距離の2乗を計算
		const actualDistSq = getDistanceSquared(bullet.x, bullet.y, enemy.x, enemy.y);
		// 判定
		// return actualDistSq <= HIT_RANGE_SQUARED;
		return actualDistSq <= getHitRangeSquared( bullet.type );
	}

	/**
	 * 2点間の距離の2乗を計算。平方根の計算を省略することで高速化
	 * @param {number} x1 - 最初の点の X 座標。
	 * @param {number} y1 - 最初の点の Y 座標。
	 * @param {number} x2 - 2番目の点の X 座標。
	 * @param {number} y2 - 2番目の点の Y 座標。
	 * @returns {number} 2点間の距離の2乗。
	 */
	function getDistanceSquared(x1: number, y1: number, x2: number, y2: number): number {
	    // X座標の差 (dx)
	    const dx = x2 - x1;
	    // Y座標の差 (dy)
	    const dy = y2 - y1;
	    // dx^2 + dy^2 を返す
	    return dx * dx + dy * dy; 
	}

	// 削除
	function removeBullet( bullet:Bullet ) {
		let list = [];
		for( let i=0;i<bulletListRef.current.length;i++ ){
			const b = bulletListRef.current[i];
			if( b.id != bullet.id ){
				list.push( b );
			}
		}
		// リストを更新
		bulletListRef.current = list;
	}

});


/**
 * 当たり判定を変える場合はここを修正する
 * @param {string} type
 */
function getHitRangeSquared( type ){

	let bulletRadius = 5;  // 弾丸の半径
	let targetRadius = 20; // ターゲットの半径

	switch( type ){
		case 'arrow':
			bulletRadius = 5;
			targetRadius = 20;
			break;

		case 'canon':
			bulletRadius = 5;
			targetRadius = 20;
			break;

		case 'wizard':
			bulletRadius = 5;
			targetRadius = 20;
			break;
	}

	// 許容される距離 (R) = 5 + 20 = 25
	const HIT_RANGE = bulletRadius + targetRadius; 

	// 衝突判定の基準となる距離の2乗 (R^2 = 25 * 25 = 625)
	return  HIT_RANGE * HIT_RANGE;
}

// UnitCanvasのprops(親から渡されてるもの全て)が更新されない限り、再レンダリングしないようにメモ化
export default memo(UnitCanvas);