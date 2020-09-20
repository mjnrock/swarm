import LayeredCanvasNode from "@lespantsfancy/hive/lib/client/LayeredCanvasNode";
import { EnumComponentType } from "./../demo/snake/entity/component/Component";

export default class TileCamera extends LayeredCanvasNode {
    constructor(node, { x, y, w, h, tw = 32, th = 32, size = [], subject, stack = [], game, scale = 1.0, rotation = 0, translation = [ 0, 0 ] } = {}) {
        super({
            state: {
                game: game,
                node: node,
                viewport: {
                    x,
                    y,
                    width: w,
                    height: h,
                },
                subject,
                scale,
                rotation,
                translation,
            },
            width: w * (size[ 0 ] || tw),
            height: h * (size[ 1 ] || th),
            size: [ size[ 0 ] || tw, size[ 1 ] || th ],
            stack: [],
        });
        
        this.stack = stack;
    
        this.ctx.translate(...translation);
        this.ctx.rotate(rotation * Math.PI / 180);   // Expects Degrees
    }

    get pos() {
        return {
            x0: this.state.viewport.x,
            y0: this.state.viewport.y,
            x1: this.state.viewport.x + this.state.viewport.width,
            y1: this.state.viewport.y + this.state.viewport.height,
        };
    }

    get game() {
        return this.state.game;
    }

    get scale() {
        return this.state.scale;
    }
    set scale(scale) {
        this.mergeState({
            scale: scale,
        });
    }

    get subject() {
        return this.state.subject;
    }
    set subject(subject) {
        this.mergeState({
            subject: subject,
        });
    }
    desubject() {
        this.state.subject = null;

        return this;
    }

    get node() {        
        return this.state.node;
    }
    set node(node) {
        this.mergeState({
            node: node,
        });
    }

    draw(...args) {
        if(this.canvas !== this.game.react.canvas) {
            this.game.react.canvas.width = this.width;
            this.game.react.canvas.height = this.height;

            this.canvas = this.game.react.canvas;
        }

        this.ctx.clearRect(0, 0, this.width, this.height);
        this.node.map.each((tx, ty, tile) => {
            this.prop({
                fillStyle: "#bbb",
            }).gRect(tx, ty, 1, 1, { isFilled: true });
        });

        this.game.player.comp(EnumComponentType.BODY, comp => {
            comp.each((lln, i) => {
                const [ x, y ] = lln.value;
                this.prop({
                    fillStyle: i === 0 ? "#000" : "#555",
                }).gRect(x, y, 1, 1, { isFilled: true });
            })
            
            return comp;
        });
    }
};