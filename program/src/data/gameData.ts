export const TOWER_DATA_LIST = [
  // 単体攻撃タイプ
  {
    id:'dummy',
    type :'arrow',
    cost :50,
    speed:1.5,//弾速
    power:1,
    range:5,//5タイル分離れてても攻撃する
    delay:1000,//msec
    lv:1,
    description:'一撃は弱いが、連射が効きやすい。射程も長い。',
  },

  // 貫通攻撃タイプ
  {
    id:'dummy',
    type :'canon',
    cost :100,
    speed:1,
    power:3,
    range:4,
    delay:2000,
    lv:1,
    description:'一撃が強く貫通するが、連射が効きにくい。',
  },

  // 妨害タイプ
  {
    id:'dummy',
    type :'wizard',
    cost :150,
    speed:1.5,
    power:0.025,//減速
    range:4,//射程
    delay:3000,//再展開にかかる時間
    lv:1,
    description:'弾が当たったエネミーの移動速度を低下させる。',
  },
];

export const  ENEMY_DATA_LIST = [
  {
    type:'pawn',
    speed:0.3,
    life :5,
    reward:25,
  },
  {
    type:'knight',
    speed:0.6,
    life :15,
    reward:50,
  },
  {
    type:'heavyKnight',
    speed:0.3,
    life :200,
    reward:100,
  },
];


export const WAVE_DATA_LIST = [
  // wave 1
  {
    enemylist:[
      {
        type:'pawn',
        delay:1500,//次のエネミーが登場するまでの待機時間
      },

      {
        type:'pawn',
        delay:1500,
      },

      {
        type:'pawn',
        delay:1500,
      },

      {
        type:'pawn',
        delay:1500,
      },

      {
        type:'pawn',
        delay:1500,
      },

      {
        type:'knight',
        delay:3000,
      },
      {
        type:'knight',
        delay:3000,
      },
      {
        type:'knight',
        delay:3000,
      },
    ],
    reward:200, //waveクリア報酬のコイン
  },

  // wave 2
  {
    enemylist:[
      {
        type:'pawn',
        delay:1500,
      },
      {
        type:'pawn',
        delay:1500,
      },
      {
        type:'pawn',
        delay:1500,
      },
      {
        type:'pawn',
        delay:1500,
      },
      {
        type:'pawn',
        delay:1500,
      },
      {
        type:'knight',
        delay:2000,
      },
      {
        type:'knight',
        delay:2000,
      },
      {
        type:'knight',
        delay:2000,
      },
      {
        type:'knight',
        delay:2000,
      },
      {
        type:'knight',
        delay:2000,
      },
      {
        type:'knight',
        delay:2000,
      },
    ],
    reward:300, //waveクリア報酬のコイン
  },

  // wave 3

  {
    enemylist:[
      {
        type:'pawn',
        delay:1500,
      },
      {
        type:'pawn',
        delay:1500,
      },
      {
        type:'pawn',
        delay:1500,
      },
      {
        type:'knight',
        delay:2000,
      },
      {
        type:'knight',
        delay:2000,
      },
      {
        type:'knight',
        delay:2000,
      },
      {
        type:'knight',
        delay:2000,
      },
      {
        type:'knight',
        delay:2000,
      },
      {
        type:'heavyKnight',
        delay:3000,
      },
      {
        type:'heavyKnight',
        delay:3000,
      },
      {
        type:'heavyKnight',
        delay:3000,
      },
      {
        type:'heavyKnight',
        delay:3000,
      },
      {
        type:'heavyKnight',
        delay:3000,
      },
      {
        type:'heavyKnight',
        delay:3000,
      },
    ],
    reward:500, //waveクリア報酬のコイン
  },
];


// 1マスのおおきさ(px)
export const GRID_SIZE = 40;

// 0 .. 歩けない
// 1 .. 歩ける
// 2 .. エネミースタート地点
// 3 .. エネミーゴール地点
export const MAP_DATA = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,1,1,1,0,1,1,2],
  [0,0,0,0,0,0,1,0,0,0,1,0,1,0,0],

  [0,0,0,0,0,0,1,0,0,0,1,0,1,0,0],
  [0,0,0,0,0,0,1,0,0,0,1,0,1,0,0],
  [3,1,1,1,0,0,1,0,0,0,1,0,1,0,0],
  [0,0,0,1,0,0,1,0,0,0,1,0,1,0,0],
  [0,0,0,1,0,0,1,0,0,0,1,0,1,0,0],

  [0,0,0,1,1,1,1,0,0,0,1,0,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,0,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,0,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];