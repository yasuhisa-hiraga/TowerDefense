export class Bullet {
    // 弾が持つべきプロパティを定義
    public id:number;
    x: number;
    y: number;
    dx: number; // X方向の速度ベクトル
    dy: number; // Y方向の速度ベクトル
    speed: number;
    damage: number;
    type: string;

    constructor(id:number, startX: number, startY: number, targetX: number, targetY: number, speed: number, damage: number, type:string) {
        this.id = id;
        this.x = startX;
        this.y = startY;
        this.speed = speed;
        this.damage = damage;
        this.type = type;
        

        // ベクトル計算
        // A. 差の計算 (方向ベクトル)
        const deltaX = targetX - startX;
        const deltaY = targetY - startY;

        // B. 距離の計算 (三平方の定理)
        // Math.sqrt(deltaX^2 + deltaY^2)
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // ターゲットが現在地と同じで距離がゼロの場合、ゼロ除算を避ける
        if (distance === 0) {
            // return { dx: 0, dy: 0 };
            this.dx = 0;
            this.dy = 0;
        }
        
        // C. 正規化 (単位ベクトルの作成)
        // 方向ベクトルを距離で割ることで、長さが1.0のベクトルになる
        const unitX = deltaX / distance;
        const unitY = deltaY / distance;

        // D. 速度調整
        // 単位ベクトルに速度を掛けて、最終的な移動ベクトル (dx, dy) を得る
        this.dx = unitX * this.speed;
        this.dy = unitY * this.speed;
    }

    // 毎フレーム呼ばれる位置更新のロジック
    update() {
        this.x += this.dx;
        this.y += this.dy;
    }

    // 毎フレーム呼ばれる描画ロジック
    draw(ctx: CanvasRenderingContext2D ) {
        let color = 'black';
        let size = 5;

        switch( this.type ){
            case 'arrow':
                color = 'lightsteelblue';
                size = 5;
                break;
            case 'canon':
                color = 'black';
                size = 10;
                break;
            case 'wizard':
                color = 'blue';
                size = 5;
                break;
        }

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(this.x+25-size, this.y+25-size, size, 0, Math.PI * 2); 
        ctx.fill();
        ctx.closePath();
    }
}