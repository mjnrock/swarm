import TileMap from "./../src/graph/TileMap";
import Tile, { EnumTerrainType } from "../src/graph/Tile";
import Station from "./../src/broadcast/Station";

const map = new TileMap({
    width: 10,
    height: 10,
    generator: (x, y) => new Tile(EnumTerrainType.FLOOR),
});

console.log(Station.$);