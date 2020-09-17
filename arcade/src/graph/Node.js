import CoreNode from "./../Node";
import { EnumComponentType } from "./../entity/component/Component";

export default class Node extends CoreNode {
    constructor({
        map,
        portals = [],
        entities = [],
    } = {}, opts = {}) {
        super(opts);

        this.map = map;
        this.portals = new Map();
        this.entities = new Set(entities);

        for(let [ x, y, map, nx, ny ] of portals) {
            this.portals.set(`${ x }.${ y }`, [ map, nx, ny ]);
        }
    }

    checkPortal(entity) {
        const gc = entity.getComponent(EnumComponentType.GRAPH);

        if(gc) {
            for(let [ x, y, map, nx, ny ] of this.portals.values()) {
                if(~~gc.x === x + w && ~~gc.y === y) {
                    //TODO Invoke a change of .map event in the component itself
                    gc.map = map;
                    gc.x = nx;
                    gc.y = ny;

                    return true;
                }
            }
        }

        return false;
    }

    occupants(x, y, w, h) {
        let entities = [];
        for(let entity of this.entities.values()) {
            const gc = entity.getComponent(EnumComponentType.GRAPH);

            if(gc) {
                if(gc.x >= x && gc.x <= x + w && gc.y >= y && gc.y <= y + h) {
                    entities.push(entity);
                }
            }
        }

        return entities;
    }
}