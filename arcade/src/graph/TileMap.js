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
        for(let x = 0; x < width; x++) {
            for(let y = 0; y < height; y++) {
                if(typeof generator === "function") {
                    this.tiles.set(`${ x }.${ y }`, generator(x, y));
                } else {
                    this.tiles.set(`${ x }.${ y }`, null);
                }
            }
        }
    }

    each(fn, ...args) {
        for(let [ key, value ] of this.tiles.entries()) {
            const [ tx, ty ] = key.split(".").map(v => ~~v);

            fn(tx, ty, value, ...args);
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