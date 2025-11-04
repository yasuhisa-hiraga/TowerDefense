import iconCoin from '@/assets/img/icon_coin_tower.png'
import type { TowerData } from '@/types/game'

interface TowerPanelProps {
	onSelect:(towerData: TowerData) => void;
	towerData:TowerData;
}

function TowerPanel( props:TowerPanelProps ){


	const onClick = ()=>{
		props.onSelect( props.towerData )
	}

	let content;

	switch( props.towerData.type ){
		case 'arrow':
			content = ( <div className="rounded-full bg-white h-4 w-4"></div>)
			break;
		case 'canon':
			content = ( <div className="rounded-full bg-gray-400 h-4 w-4"></div>)
			break;
		case 'wizard':
			content = ( <div className="rounded-full bg-purple-400 h-4 w-4"></div>)
			break;
	}

	
	return (
		<div onClick={onClick} className="border p-3 shadow rounded-md hover:bg-blue-100" >
			<div className="flex flex-row gap-1 items-center" >
				{content}
				<div>{props.towerData.type}</div>
			</div>
			<div className="flex flex-row gap-1">
				<img src={iconCoin} className="w-6 object-contain"/>
				<span>{props.towerData.cost * props.towerData.lv}</span>
			</div>
		</div>
	)
}

export default TowerPanel;