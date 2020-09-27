import TileMap from "../../graph/TileMap";
import Tile, { EnumTerrainType } from "../../graph/Tile";
import Station from "../../broadcast/Station";
import GraphNode from "../../graph/Node";
import EntitySnake from "./entity/EntitySnake";
import { EnumComponentType } from "./entity/component/Component";
import Game from "./Game";

import WebSocket from "ws";
import WebSocketNode from "./../../network/WebSocketNode";
import { EnumEventType as HIDEnumEventType } from "./../../input/HIDGamePadNode";
import CoreNode from "./../../Node";

const wsn = new WebSocketNode({
    ws: new WebSocket(`ws://localhost:8080`),
    receive: data => Station.$.broadcast(Station.$, data),
});

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
        lln.value = [ 5, i + 5 ];

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
Station.$.join("node", game.next.bind(game));
game.addReducer(CoreNode.TypedMessage([
    HIDEnumEventType.ACTIVATE,
    // HIDEnumEventType.DEACTIVATE,
], (state, data) => {
    return {
        ...state,

        data: {
            ...state.data,
            direction: data.payload.key,
        }
    }
}));
game.addEffect((current) => {
    const entity = node.getEntity(0);
    let velocity = [ 0, 0 ];

    if(current.data.direction === "dir_up") {
        velocity = [ 0, -1 ];
    } else if(current.data.direction === "dir_down") {
        velocity = [ 0, 1 ];
    } else if(current.data.direction === "dir_left") {
        velocity = [ -1, 0 ];
    } else if(current.data.direction === "dir_right") {
        velocity = [ 1, 0 ];
    }    
    
    entity.comp(EnumComponentType.GRAPH, comp => {
        comp.setVelocity(...velocity);
        
        return comp;
    });
});
game.onTick = (ts, dt) => {
    const entity = node.getEntity(0);
    
    entity.comp(EnumComponentType.GRAPH, comp => {
        comp.applyVelocity(dt / 1000);
        
        return comp;
    });

    entity.comp(EnumComponentType.BODY, comp => {
        const { x, y } = entity.position;

        comp.cascade(~~Number(x.toFixed(1)), ~~Number(y.toFixed(1)));
        
        return comp;
    });

    const { x, y } = entity.position;
    if(!node.isWithinBounds(x, y)) {
        game.stop();

        console.log("-=: GAME OVER :=-");
    } else {
        console.log("Pos: ", `${ x }, ${ y }`);
    }
}

game.start();