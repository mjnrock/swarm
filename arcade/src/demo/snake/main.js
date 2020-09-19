import TileMap from "../../graph/TileMap";
import Tile, { EnumTerrainType } from "../../graph/Tile";
import Station from "../../broadcast/Station";
import GraphNode from "../../graph/Node";
import EntitySnake from "./entity/EntitySnake";
import { EnumComponentType } from "./entity/component/Component";
import Game from "./Game";

const map = new TileMap({
    width: 3,
    height: 3,
    generator: (x, y) => new Tile(EnumTerrainType.FLOOR),
});
const node = new GraphNode({
    map: map,
});
const e1 = new EntitySnake({ size: 3 });

Station.$.newChannel("node");
// Station.$.join("node", console.log);

e1.comp(EnumComponentType.BODY, comp => {
    comp.body.each((lln, i) => {
        lln.value = [ 1, i + 1 ];

        if(i === 0) {
            e1.comp(EnumComponentType.GRAPH, comp => {
                comp.setPosition(...lln.value);
                comp.setVelocity(1, 1);
                
                return comp;
            });

            node.addEntity(
                [ ...lln.value, e1 ],
            );
        }
    });
    
    return comp;
});

const game = new Game({ fps: 5 });
game.onTick = (ts, dt) => {
    const entity = node.getEntity(0);
    
    entity.comp(EnumComponentType.GRAPH, comp => {
        comp.applyVelocity(dt / 1000);
        
        return comp;
    });

    entity.comp(EnumComponentType.BODY, comp => {
        const { x, y } = entity.position;

        comp.cascade(Number(x.toFixed(1)), Number(y.toFixed(1)));
        
        return comp;
    });

    console.log("---------------");
    console.log(entity.position);
    entity.comp(EnumComponentType.BODY, comp => {
        console.log(comp.value());
        
        return comp;
    });
    console.log("---------------");
}
game.start();