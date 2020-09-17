import { v4 as uuidv4 } from "uuid";

import Node from "./../Node";

export default class Entity extends Node {
    constructor({ id } = {}, opts = {}) {
        super(opts);
        this.id = id || uuidv4();
    }

    getComponent(flag) {
        for(let comp of this.components) {
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
};