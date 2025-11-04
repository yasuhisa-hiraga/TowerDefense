import { useRef, useEffect, memo } from 'react';
import { GRID_SIZE, MAP_DATA } from '@/data/gameData'

type MapData = any[][];
interface FieldCanvasProps {
  mapData: MapData;
}


function FieldCanvas({mapData}:FieldCanvasProps){

	console.log('再レンダリング FieldCanvas')

	const canvasBgRef    = useRef<HTMLCanvasElement>(null);

	useEffect(()=>{
		const bg = canvasBgRef.current;
		if(!bg)return;
		const ctxBg = bg.getContext('2d');

		// 地形描画		
		if(ctxBg)drawMap( ctxBg, mapData );
	});

	// 一番最後
	const sizeW = GRID_SIZE*MAP_DATA[0].length;
	const sizeH = GRID_SIZE*MAP_DATA.length;
	return (
		    <canvas width={sizeW} height={sizeH} ref={canvasBgRef} className="game-canvas-bg" />
	);

	/**
	 * mapの描画
	 */
	function drawMap( ctx:CanvasRenderingContext2D, mapData:MapData ){

		// console.log('mapData:',mapData)

		// グリッド描画
		const size = GRID_SIZE;
		for(let y=0;y<mapData.length;y++){
			const line = mapData[y];

			for(let x=0;x<line.length;x++){

				const tile   = line[x];
				const pointX = x*size;
				const pointY = y*size;

				switch( tile ){
					case 0:
						ctx.fillStyle = 'gray';
						ctx.strokeStyle = 'white';
				    	break;

				    case 1:
						ctx.fillStyle = 'white';
						ctx.strokeStyle = 'white';
				    	break;

				    case 2:
						ctx.fillStyle = 'blue';
						ctx.strokeStyle = 'white';
				    	break;

				    case 3:
						ctx.fillStyle = 'red';
						ctx.strokeStyle = 'white';
				    	break;

				    default:
				    	ctx.fillStyle = 'black';
						ctx.strokeStyle = 'white';
				    	break;
				}

		    	ctx.fillRect( pointX, pointY, size, size);
		    	ctx.strokeRect( pointX, pointY, size, size);
			}
		}
	}
};



// export default FieldCanvas;
export default memo(FieldCanvas);