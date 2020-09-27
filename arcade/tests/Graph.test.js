import TileMap from "./../src/graph/TileMap";
import Tile, { EnumTerrainType } from "../src/graph/Tile";
import Station from "./../src/broadcast/Station";
import GraphNode from "./../src/graph/Node";
import Entity from "./../src/entity/Entity";

const map = new TileMap({
    width: 10,
    height: 10,
    generator: (x, y) => new Tile(EnumTerrainType.FLOOR),
});
const node = new GraphNode({
    map: map,
});
const e1 = new Entity();
const e2 = new Entity();

Station.$.newChannel("node");
Station.$.join("node", console.log);

node.addEntity(
    [ 5, 5, e1 ],
    [ 2, 2, e2 ]
);
node.removeEntity(e2);