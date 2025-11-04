import TowerPanel from './TowerPanel'
import type { TowerData } from '@/types/game'

interface TowerListProps {
    towerDataList: TowerData[]; // TowerData の配列
    onTowerSelect: (towerData: TowerData) => void; // TowerData を引数にとる関数
}

function TowerList( {towerDataList, onTowerSelect}:TowerListProps){

	const handleTowerClick = ( towerData:TowerData )=>{
		onTowerSelect( towerData );
	}


	return (
		<div className="flex justify-around">
		{
			towerDataList.map(( towerData )=>(
				<TowerPanel key={towerData.type} towerData={towerData} onSelect={handleTowerClick}/>
			))
		}		
		</div>
	)
}

export default TowerList;