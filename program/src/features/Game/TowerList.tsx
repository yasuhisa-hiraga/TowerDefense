import React, { useRef, useState } from 'react'
import TowerPanel from './TowerPanel'

function TowerList( {towerDataList, onTowerSelect}){

	const handleTowerClick = ( towerData )=>{
		onTowerSelect( towerData );
	}


	return (
		<div className="flex justify-around">
		{
			towerDataList.map(( towerData )=>(
				<TowerPanel key={towerData.type} {...towerData} onSelect={handleTowerClick}/>
			))
		}		
		</div>
	)
}

export default TowerList;