import CoreNode from "../Node";
import { EnumComponentType } from "../entity/component/Component";
import Station from "../broadcast/Station";
import Entity from "../entity/Entity";

export const EnumMessageType = {
    JOIN_WORLD: "JOIN_WORLD",
    LEAVE_WORLD: "LEAVE_WORLD",
};

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

        for(let [ x, y, m, nx, ny ] of portals) {
            this.portals.set(`${ x }.${ y }`, [ m, nx, ny ]);
        }
    }

    get width() {
        return this.map.width;
    }
    get height() {
        return this.map.height;
    }
    get bounds() {
        return {
            top: 0,
            bottom: this.map.height,
            left: 0,
            right: this.map.width,
        };
    }

    isWithinBounds(x, y) {
        const { top, bottom, left, right } = this.bounds;

        return x >= left && x <= right && y >= top && y <= bottom;
    }

    checkPortal(entity) {
        const gc = entity.getComponent(EnumComponentType.GRAPH);

        if(gc) {
            for(let [ x, y, map, nx, ny ] of this.portals.values()) {
                if(~~gc.x === x && ~~gc.y === y) {
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

    getEntities() {
        return [ ...this.entities.values() ];
    }
    getEntity(indexOrId) {
        const entities = this.getEntities();

        for(let i = 0; i < entities.length; i++) {
            const entity = entities[ i ];

            if(indexOrId === i || entity.id === indexOrId) {
                return entity;
            }
        }
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

    addEntity(...entries) {
        let joins = [];
        for(let entry of entries) {
            const [ x, y, entity ] = entry || [];

            if(entity instanceof Entity) {
                entity.comp(EnumComponentType.GRAPH, comp => {
                    comp.node = this;
                    comp.x = x;
                    comp.y = y;
                });
    
                joins.push(entity);

                this.entities.add(entity);
            }
        }

        if(joins.length) {
            Station.$.invoke("node", this, EnumMessageType.JOIN_WORLD, joins);
        }
    }
    removeEntity(...entities) {
        let leaves = [];
        for(let entity of entities) {
            if(entity instanceof Entity) {
                entity.comp(EnumComponentType.GRAPH, comp => {
                    comp.node = null;
                    comp.x = null;
                    comp.y = null;
                });

                leaves.push(entity);
                
                this.entities.delete(entity);
            }
        }

        if(leaves.length) {
            Station.$.invoke("node", this, EnumMessageType.LEAVE_WORLD, leaves);
        }
    }

    each(fn, { offset = 0, args = [] } = {}) {
        if(typeof fn === "function") {
            const entities = [ ...this.entities.values() ];
            for(let i = offset; i < entities.length; i++) {
                fn(entities[ i ], ...args);
            }
        }
    }
}