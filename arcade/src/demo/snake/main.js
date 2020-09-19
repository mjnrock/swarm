import TileMap from "../../graph/TileMap";
import Tile, { EnumTerrainType } from "../../graph/Tile";
import Station from "../../broadcast/Station";
import GraphNode from "../../graph/Node";
import EntitySnake from "./entity/EntitySnake";
import { EnumComponentType } from "./entity/component/Component";

const map = new TileMap({
    width: 25,
    height: 25,
    generator: (x, y) => new Tile(EnumTerrainType.FLOOR),
});
const node = new GraphNode({
    map: map,
});
const e1 = new EntitySnake({ size: 3 });

Station.$.newChannel("node");
// Station.$.join("node", console.log);

node.addEntity(
    [ 1, 1, e1 ],
);

e1.comp(EnumComponentType.BODY, comp => {
    comp.body.each((lln, i) => lln.value = [ 1, i + 1]);

    console.log("---------------")
    console.log(comp.head())
    console.log(comp.value(1))
    console.log(comp.value(2))

    console.log("---------------")
    comp.cascade(5, 5);

    console.log(comp.head())
    console.log(comp.value(1))
    console.log(comp.value(2))
    
    console.log("---------------")
    comp.cascade(3, 3);

    console.log(comp.head())
    console.log(comp.value(1))
    console.log(comp.value(2))
    
    return comp;
});