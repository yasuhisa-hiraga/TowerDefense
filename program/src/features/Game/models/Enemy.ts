//================================================
// enemy
//================================================
export class Enemy {
    // パラメータ
    public id : number;
    public type : string;
    public speed : number;
    public life  : number;
    // protected range: number;

    // 移動path
    private path: array; // スタートからゴールまでのルートpath

    // ピクセル座標
    public x: number;
    public y: number;
    public isGoal: boolean;

    // mapIndex
    public position: object;

    // pathのindex参照
    public pathIndex : number;

    private tileSize : number;

    // コンストラクタ：インスタンス生成時に実行される初期化メソッド
    constructor( params:object, path:array ) {
    	this.id    = params.id;
    	this.type  = params.type;
        this.speed = params.speed;
        this.life  = params.life;
        this.reward= params.reward;
        this.path  = path;

        this.isGoal = false;
        this.pathIndex = 0;
        this.tileSize = 40;//1タイルの縦横サイズ(px)

        // 最初の座標
        const currentPoint = this.getLocalPoint( this.path[ this.pathIndex ] );
        this.x = currentPoint.x;
        this.y = currentPoint.y;
        this.pathIndex++;
    }

    // speedに応じて次のエリアに進ませる
    public move(){

    	// 次のmapIndexを更新
    	const position = this.getMapIndex( this.path[ this.pathIndex ] );

    	// local座標
    	const nextPoint = this.getLocalPoint( position );

    	// x すすめる
    	if( Math.abs(nextPoint.x - this.x ) > 1 ){
    		this.x += ( nextPoint.x < this.x ) ? -1 *this.speed : this.speed;
    	}else{
    		this.x = nextPoint.x;
    	}

    	// y すすめる
    	if( Math.abs(nextPoint.y - this.y ) > 1 ){
    		this.y += ( nextPoint.y < this.y ) ? -1 *this.speed : this.speed;
    	}
    	else{
    		this.y = nextPoint.y;
    	}

    	// 目標地点についてる場合、pathを進める
		if( this.x == nextPoint.x && this.y == nextPoint.y ){
			if( this.pathIndex+1 >= this.path.length ){
				console.log('GOAL!');
				this.isGoal = true;
			}
			else{
				// 現在のmapIndexを更新
				this.position = position;
				this.pathIndex++;
			}
		}
    }

    /**
     * 'x_y'を与えて、localのpx座標x,yを返す
     */
    private getLocalPoint( position ){
    	// const x = pathString.split('_')[0] * this.tileSize;
    	// const y = pathString.split('_')[1] * this.tileSize;
    	return {
    		x : position.x * this.tileSize,
    		y : position.y * this.tileSize,
    	}
    }

    /**
     * mapIndex(mapDataにおけるxy座標)
     */
    private getMapIndex( pathString ){
    	const x = pathString.split('_')[0];
    	const y = pathString.split('_')[1];

    	return{
    		x: Number(x),
    		y: Number(y),
    	}
    }


   	public draw( ctx: CanvasRenderingContext2D){
   		ctx.fillStyle = 'red';
		ctx.fillRect( this.x+5 , this.y+5 , 30, 30 );
		// life
		ctx.fillStyle = 'white';
		ctx.fillText(this.life, this.x+15, this.y+20);
   	}
}