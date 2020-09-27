/* eslint-disable */
import Component from "../../../../entity/component/Component";
import { EnumComponentType } from "./Component";

export default class Body extends Component {
    constructor(size = 1) {
        super(EnumComponentType.BODY, {
            body: [],
        });

        this.grow(size);
    }

    get(index = 0) {        
        return this.state.body[ index ];
    }
    value(index = 0, asObject = true) {      
        const arr = this.get(index);

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
            this.state.body.push([ false, false ]);
        }
    }

    head(x, y) {
        if(arguments.length) {
            this.set(0, x, y);
        }

        return this.value(0);
    }

    set(index, x, y) {
        this.state.body[ index ] = [ x, y ];
    }
    add(index, dx, dy) {
        const [ x, y ] = this.state.body[ index ];

        this.state.body[ index ] = [ x + dx, y + dy ];
    }

    cascade(x, y) {
        let temp = this.get(0);
        this.set(0, x, y);

        for(let i = 1; i < this.state.body.length; i++) {
            let temp2 = this.get(i);

            this.set(i, ...temp);

            temp = temp2;

            if(temp[ 0 ] === false) {
                return this;
            }
        }

        return this;
    }
    each(fn, ...args) {
        return this.state.body.forEach((value, i) => fn(value, i, ...args));
    }
}