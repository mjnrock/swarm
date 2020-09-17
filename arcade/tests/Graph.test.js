import TileMap from "./../src/graph/TileMap";
import Tile, { EnumTerrainType } from "../src/graph/Tile";
import Station from "./../src/broadcast/Station";
import GraphNode from "./../src/graph/Node";

const map = new TileMap({
    width: 10,
    height: 10,
    generator: (x, y) => new Tile(EnumTerrainType.FLOOR),
});
const node = new GraphNode({
    map: map,
});

Station.$.newChannel("node");

console.log(node);