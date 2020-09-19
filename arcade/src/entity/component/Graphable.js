/* eslint-disable */
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
        });
    }

    get pos() {
        return {
            x: this.state.x,
            y: this.state.y,
        };
    }
    get vel() {
        return {
            vx: this.state.vx,
            vy: this.state.vy,
        };
    }

    setPosition(x, y) {
        this.state.x = x;
        this.state.y = y;

        return this;
    }
    addPosition(dx, dy) {
        this.state.x += dx;
        this.state.y += dy;

        return this;
    }

    setVelocity(vx, vy) {
        this.state.vx = vx;
        this.state.vy = vy;

        return this;
    }
    addVelocity(dvx, dvy) {
        this.state.vx += dvx;
        this.state.vy += dvy;

        return this;
    }

    applyVelocity(dt) {
        this.state.x += this.state.vx * dt;
        this.state.y += this.state.vy * dt;

        this.state.x = parseFloat(this.state.x.toFixed(3));
        this.state.y = parseFloat(this.state.y.toFixed(3));

        return this;
    }
};