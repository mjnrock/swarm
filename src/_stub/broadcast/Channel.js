import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";

export default class Channel extends EventEmitter {
    constructor(subscribors = [], { id } = {}) {
        super();
        this.id = id || uuidv4();

        this.subscribors = new Set(subscribors);
    }

    invoke(thisArg, ...args) {
        for(let fn of this.subscribors.values()) {
            fn.call(thisArg, ...args);
        }
    }

    join(fn) {
        if(typeof fn === "function") {
            this.subscribors.add(fn);
        }
    }
    leave(fn) {
        this.subscribors.delete(fn);
    }
};