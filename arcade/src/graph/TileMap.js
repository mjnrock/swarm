export const EnumMapType = {
    SQUARE_GRID: 1,
    HEX_GRID: 2,
};

export default class TileMap {
    constructor({
        type = EnumMapType.SQUARE_GRID,
        width,
        height,
        meta = {},
        generator,
    } = {}) {
        this.type = type;    
        this.meta = meta;
        
        this.width = width;
        this.height = height;
        
        this.tiles = new Map();
        for(let w = 0; w < width; w++) {
            for(let h = 0; h < height; h++) {
                if(typeof generator === "function") {
                    this.tiles.set(`${ w }.${ h }`, generator(w, h));
                } else {
                    this.tiles.set(`${ w }.${ h }`, null);
                }
            }
        }
    }

    getNeighbors4(x, y) {
        const neighbors = [];
        if(this.type === EnumMapType.SQUARE_GRID) {
            [
                [ 1, 0 ],
                [ -1, 0 ],
                [ 0, 1 ],
                [ 0, -1 ],
            ].forEach(([ dx, dy ]) => {
                let nx = ~~x + dx,
                    ny = ~~y + dy;

                neighbors.push([
                    nx,
                    ny,
                    this.tiles.get(`${ nx }.${ ny }`),
                ]);
            });
        }

        return neighbors;
    }
    getNeighbors8(x, y) {
        const neighbors = [];
        if(this.type === EnumMapType.SQUARE_GRID) {
            [
                [ 1, 0 ],
                [ -1, 0 ],
                [ 0, 1 ],
                [ 0, -1 ],

                [ 1, 1 ],
                [ 1, -1 ],
                [ -1, 1 ],
                [ -1, -1 ],
            ].forEach(([ dx, dy ]) => {
                let nx = ~~x + dx,
                    ny = ~~y + dy;

                neighbors.push([
                    nx,
                    ny,
                    this.tiles.get(`${ nx }.${ ny }`),
                ]);
            });
        }

        return neighbors;
    }
}