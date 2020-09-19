import Component from "../../../../entity/component/Component";
import { EnumComponentType } from "./Component";
import LinkedList from "./../../util/LinkedList";

export default class Body extends Component {
    constructor(size = 1) {
        super(EnumComponentType.BODY, {
            body: new LinkedList(),
        });

        this.grow(size);
    }

    get(index = 0) {        
        return this.state.body.get(index);
    }
    value(index = 0, asObject = true) {      
        const arr = this.state.body.value(index);

        if(Array.isArray(arr)) {
            const [ x, y ] = arr;

            if(asObject === true) {
                return {
                    x,
                    y,
                };
            }
        }

        return arr;
    }

    grow(amount = 1) {
        for(let i = 0; i < amount; i++) {
            this.state.body.add([ false, false ]);
        }
    }

    head(x, y) {
        if(arguments.length) {
            this.state.body.set(0, [ x, y ]);
        }

        return this.value(0);
    }

    set(index, x, y) {
        this.state.body.set(index, [ x, y ]);
    }
    add(index, dx, dy) {
        const i = this.get(index);

        if(i) {
            const [ x, y ] = i.value || [ 0, 0 ];

            i.set(index, [ x + dx, y + dy ]);
        }
    }

    cascade(x, y) {
        return this.state.body.cascade([ x, y ]);
    }
    each(fn, ...args) {
        return this.state.body.each(fn, ...args);
    }
}