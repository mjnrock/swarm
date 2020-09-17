import Component, { EnumComponentType } from "./Component";

export const EnumDirection = {
    NORTH: 2 << 0,
    SOUTH: 2 << 1,
    EAST: 2 << 2,
    WEST: 2 << 3,
};

export default class Graphable extends Component {
    constructor({ node, x = 0, y = 0, facing = 0, vx = 0, vy = 0, speed = 1, model, mass } = {}) {
        super(EnumComponentType.GRAPH, {
            node,
            facing,
            x,
            y,
            vx,
            vy,
            speed,
            model,
            mass,
            isColliding: false,
        }, {
            hooks: {
                node: node => {
                    
                    return node;
                }
            }
        });
    }

    get pos() {
        return {
            x: this.state.x,
            y: this.state.y,
        };
    }

    setCoords(x, y) {
        this.state.x = x;
        this.state.y = y;

        return this;
    }
    setVelocity(vx, vy) {
        this.state.vx = vx;
        this.state.vy = vy;

        return this;
    }

    applyVelocity(dt) {
        this.state.x += this.state.vx * dt;
        this.state.y += this.state.vy * dt;

        return this;
    }
};