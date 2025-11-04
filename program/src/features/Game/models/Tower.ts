//================================================
// Tower
//================================================
import { Enemy } from './Enemy';
import { GRID_SIZE } from '@/data/gameData';
import type { TowerData, Position } from '@/types/game'

export class Tower {

	public id:string;
	public type:string;
	public cost:number; //建築コスト
	public speed:number; //弾速
	public power:number; //威力
	public range:number; //射程
	public delay:number; //射出後のディレイ
	public lv:number; //レベル

	public position:Position;

	public x:number;
	public y:number;

	private beforeAttackTime:number;

	constructor( params:TowerData, position:Position ) {
		this.id = params.id;
		this.type = params.type;
		this.cost = params.cost;
		this.speed= params.speed;
		this.power= params.power;
		this.range= params.range;
		this.delay= params.delay;//ミリ秒

		this.lv = params.lv;

		this.position = position;

		// 座標
        this.x = this.position.x * GRID_SIZE;
        this.y = this.position.y * GRID_SIZE;

        this.beforeAttackTime = 0;
	}

	/**
	 * レンダリングされるたびに呼び出される
	 * 攻撃対象を返す
	 */
	public update( enemyList:Enemy[], time:number ){
		let targetEnemyList:Enemy[] = [];
		// 前回の攻撃からディレイが経過してたら攻撃する
		let dif = time - this.beforeAttackTime;
		// console.log('dif:',dif)
		if( dif >= this.delay ){
			targetEnemyList = this.getTargetList( enemyList );
			if( targetEnemyList.length > 0 ){
				this.beforeAttackTime = time;
			}
		}

		return targetEnemyList;
	}

	/**
	 * 射程範囲内のエネミーを返す
	 */
	private getTargetList( enemyList:Enemy[] ){
		let targetEnemyList:Enemy[] = [];
		for( let i=0;i<enemyList.length;i++){
			const enemy = enemyList[i];
			let dis = this.getDistance( enemy );

			// 射程圏内なので攻撃
			if( dis <= this.range ){
				// enemy.life -= this.power;
				targetEnemyList.push( enemy );
				break;
			}
		}
		return targetEnemyList;
	}

	/**
	 * 複数攻撃
	 * 
	 */
	// private attackMany( enemyList ){
	// 	let targetEnemyList = [];
	// 	for( let i=0;i<enemyList.length;i++){
	// 		const enemy = enemyList[i];
	// 		let dis = this.getDistance( enemy );

	// 		// 射程圏内なので攻撃
	// 		if( dis <= this.range ){
	// 			// enemy.life -= this.power;
	// 			targetEnemyList.push( enemy );
	// 		}
	// 	}
	// 	return targetEnemyList;
	// }

	/**
	 * mapIndex x,yでのstep数（何マス離れてるか）を返す
	 */
	private getDistance( target:Enemy ){
		let disX = Math.abs( target.position.x - this.position.x );
		let disY = Math.abs( target.position.y - this.position.y );
		return disX+disY;
	}

	public draw( ctx: CanvasRenderingContext2D ){
		let color = 'white';

		switch( this.type ){
			case 'arrow':
				color = 'white';
				break;
			case 'canon':
				color = 'gray';
				break;
			case 'wizard':
				color = 'purple';
				break;
		}

		ctx.fillStyle = color;
		// ctx.fillRect( x+5 , y+5 , 30, 30 );

		// 円
		ctx.beginPath();//パスのリセット
		ctx.arc(this.x+20,this.y+20, 15, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();

		// Lv
		ctx.fillStyle = 'black';
		ctx.fillText('Lv'+this.lv, this.x+10, this.y+20);
	}
}