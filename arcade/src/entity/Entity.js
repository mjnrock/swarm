import { v4 as uuidv4 } from "uuid";

import Node from "./../Node";
import { EnumComponentType } from "./component/Component";
import Graphable from "./component/Graphable";

export default class Entity extends Node {
    constructor({ data = {}, lifespan = -1, id } = {}, opts = {}) {
        super(opts);
        this.id = id || uuidv4();

        this.state = {
            birth: Date.now(),
            lifespan: lifespan,
            components: new Map([
                [ EnumComponentType.GRAPH, new Graphable() ]
            ]),
        };
        this.config = {
            shouldDie: false,
        };

        for(let flag of Object.keys(data)) {
            const comp = this.getComponent(~~flag);

            if(comp) {
                for(let [ key, value ] of Object.entries(data[ flag ])) {
                    comp[ key ] = value;
                }
            }
        }
    }

    getComponent(flag) {
        for(let comp of this.state.components.values()) {
            if(comp.flag === flag) {
                return comp;
            }
        }

        return null;
    }
    comp(compType, fn, ...args) {
        const comp = this.getComponent(compType);

        if(comp && typeof fn === "function") {
            return fn.call(this, comp, ...args);
        }
    }

    get isExpired() {
        if(this.lifespan === -1) {
            return this.config.shouldDie;
        }

        return this.config.shouldDie || (Date.now() >= (this.birth + this.lifespan));
    }
    kill() {
        this.config.shouldDie = true;
    }

    onTick(ts, dt) {}
};