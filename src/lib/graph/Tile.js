export const EnumTerrainType = {
    VOID: 0,
    FLOOR: 1,
    WALL: 2,
    DOOR: 3,
};

export default class Tile {
    constructor(terrain, speed = 1.0) {
        this.terrain = terrain;
        this.speed = speed;
    }
};