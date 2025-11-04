export interface TowerData {
  id: string;
  type: string;
  cost: number;
  speed: number;
  power: number;
  range: number;
  delay: number;
  lv: number;
  description: string;
}

export interface EnemyData{
  id: string;
  type:string,
  speed:number,
  life :number,
  reward:number,
}

/**
 * MAP_DATAの配列参照用
 */
export interface MapIndex{
  x: number;
  y: number;
}

export type MapData = any[][];

export interface Position{
  x: number;
  y: number;
}