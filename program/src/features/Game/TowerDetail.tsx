import React, { useRef, useState, useEffect } from 'react'
import iconCross from '@/assets/img/icon_cross.png'
import iconCoin from '@/assets/img/icon_coin_tower.png'

/**
 * 詳細データパネル
 */
function TowerDetail( {children, towerData, onCancel, onUpgrade } ){

	console.log('再レンダリング TowerPanel:',towerData);

	// メッセージを引き渡されてる場合は表示
	if (!children) {
        return null;
    }

    const handleUpgrade = ()=>{
    	onUpgrade( towerData );
    }

    let content;
    if( towerData.lv < 5 ){
    	content = (
    		<div onClick={ handleUpgrade } className="rounded-md bg-gray-800 text-center p-4 hover:bg-blue-400 hover:text-gray-500" >
				<div>UPGRADE</div>
				<div className="flex flex-row gap-1 justify-center items-center">
					<img src={iconCoin} className="w-6 object-contain"/>
					<span>{ towerData.cost * towerData.lv }</span>
				</div>
			</div>
		);
    }
    else{
    	content = (

    		<div className="rounded-md bg-gray-800 text-center p-4 hover:bg-blue-400 hover:text-gray-500" >
				<div>UPGRADE</div>
				<div className="flex flex-row gap-1 justify-center items-center">
					LV MAX
				</div>
			</div>
    	)
    }

	return (
		<div className="bg-gray-800 text-white bg-opacity-80 rounded-md p-2 w-full" >
			<div className="p-1 flex flex-row gap-1 items-center">
				<div onClick={ onCancel } className="rounded-full bg-white hover:bg-blue-100 h-8 p-1">
					<img src={iconCross} className="h-full object-contain"/></div>
				<div className="text-left">{children}</div>
			</div>

			<div className="flex flex-row justify-around gap-1">
				<div className="text-left text-sm">
					<p className="bg-black p-1 text-center">{ towerData.type } Lv { towerData.lv } / 5</p>
					<p>{ towerData.description }</p>
					{content}
					<ul className="text-xs text-center p-1">
						<li>マップクリックで配置</li>
						<li>配置タワーをクリックで削除</li>
					</ul>
				</div>
			</div>
		</div>
	)
}

export default TowerDetail;