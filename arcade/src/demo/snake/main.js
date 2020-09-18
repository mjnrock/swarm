import TileMap from "../../graph/TileMap";
import Tile, { EnumTerrainType } from "../../graph/Tile";
import Station from "../../broadcast/Station";
import GraphNode from "../../graph/Node";
import Entity from "../../entity/Entity";

const map = new TileMap({
    width: 25,
    height: 25,
    generator: (x, y) => new Tile(EnumTerrainType.FLOOR),
});
const node = new GraphNode({
    map: map,
});
const e1 = new Entity();

Station.$.newChannel("node");
Station.$.join("node", console.log);

node.addEntity(
    [ 1, 1, e1 ],
);