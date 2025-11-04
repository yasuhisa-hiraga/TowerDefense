//================================================
// 幅優先探索でスタート(2)からゴール(3)までのルートを返す
//================================================
export class Bfs {
    private mapData: array;

    /**
     * [ [0,0,0,0],[0,0,1,0],] のようなmapData
     * @param {array} mapData - 
     * 
     */
    constructor(mapData: array ) {
        this.mapData = mapData;
    }

    /**
     * mapData上のスタート座標(2)からゴールポイント(3)の地点に向かうためのルートを取得する
     * 
     * @return {array} path
     */
    public getRootPath(){
        const startPoint = this.getTargetPoint( 2 );
        const sampleLine = this.mapData[0];
        const h = this.mapData.length;
        const w = sampleLine.length;
        const path = this.bfs( this.mapData, startPoint.x, startPoint.y, h, w );

        return path;
    }

    /**
     * 指定ポイントの座標を返す
     */
    private getTargetPoint( target:number ){
        for( let y=0;y<this.mapData.length;y++){
            const line = this.mapData[y];
            for( let x=0;x<line.length;x++){
                const point = line[x];

                if( point == target ){
                    return {x:x,y:y};
                }
            }
        }
        return {x:0,y:0};
    }


    // 指定地点から一番近い 3 を探して、そのpathを返す
    public bfs( map , startX, startY, h , w ){
        
        const startNode = startX+'_'+startY;
        const queue = [{ node: startNode , path:[startNode] }];
        
        // 訪問済みの場所
        const visited = new Set();
        visited.add( startNode );
        
        while( queue.length ){
            const q = queue.shift();

            // 3(ゴール)かどうかしらべる
            const element = this.getElement( map , q.node );
            
            // 見つけたらそこまでかかったpathを返す
            if( element == 3 ){
                return q.path;
            }

            // 進行不能の場所じゃなければ、隣人から調査続行
            if( element != 0 ){
                // 見つからなかったので隣人を調査
                const neighbors = this.getNeighbors( map , q.node , h , w );
                
                for( let i=0;i<neighbors.length;i++){
                    const n = neighbors[i];

                    // 訪問してなければ調査
                    if( !visited.has( n ) ){
                        visited.add( n );
                        // path を継承
                        const newPath = [...q.path , n ];
                        queue.push({node:n , path:newPath } );
                    }
                }
            }            
        }
        
        return null;
    }

    // 指定ノードの内容を取得
    private getElement( map , nodeXY ){
        let x = nodeXY.split('_')[0];
        let y = nodeXY.split('_')[1];
        
        return map[y][x];
    }

    // 特定地点の隣人を取得
    private getNeighbors( map , nodeXY , h , w ){
        let ns = [];
        
        let x = Number( nodeXY.split('_')[0] );
        let y = Number( nodeXY.split('_')[1] );

        // 左座標
        if( x > 0 ){
            let x2 = x-1;
            ns.push( x2+'_'+y );
        }
        // 右
        if( x < w-1 ){
            let x2 = x+1;
            ns.push( x2+'_'+y );
        }
        // 上
        if( y > 0 ){
            let y2 = y-1;
            ns.push( x+'_'+y2 );
        }
        //下
        if( y < h-1 ){
            let y2 = y+1;
            ns.push( x+'_'+y2 );
        }
        
        return ns;
    }

}