import Node from "./../../Node";
import GameLoop from "./GameLoop";
import { v4 as uuidv4 } from "uuid";

export const EnumEventType = {
    GAME_START: "Game.Start",
    GAME_STOP: "Game.Stop",
};

export default class Game extends Node {
    constructor({ settings = {}, fps = 60 } = {}) {
        super({
            state: {
                data: {},
                loop: new GameLoop(fps),
    
                settings: {
                    isRunning: false,
                    isDebugMode: false,
    
                    ...settings,
                },
    
                react: {
                    canvas: null,
                },
            },
        });

        this.id = uuidv4();

        // Create Singleton pattern
        if(!Game.Instance) {
            Game.Instance = this;
        }
    }

    // Access Singleton pattern via Game.$
    static get $() {
        if(!Game.Instance) {
            Game.Instance = new Game();
        }

        return Game.Instance;
    }

    get isRunning() {
        return this.state.settings.isRunning;
    }

    setting(prop, value) {
        if(prop in this.state.settings) {
            if(value !== void 0) {
                this.state.settings[ prop ] = value;
            }

            return this.state.settings[ prop ];
        }
    }

    start() {
        this.state.loop.hooks.update = this.onTick;
        this.state.loop.hooks.draw = this.onDraw;

        this.state.settings.isRunning = true;
        this.state.loop.start();
        this.emit(EnumEventType.GAME_START, this);

        return this;
    }
    stop() {
        this.state.settings.isRunning = false;
        this.state.loop.stop();
        this.emit(EnumEventType.GAME_STOP, this);

        return this;
    }

    get react() {
        return this.state.react;
    }

    onTick(ts, dt) {}
    onDraw(ts, ip) {}
}