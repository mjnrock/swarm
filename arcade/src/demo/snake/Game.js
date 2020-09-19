import CoreNode from "./../../Node";
import GameLoop from "./GameLoop";
import { v4 as uuidv4 } from "uuid";
import WebSocketNode from "./../../network/WebSocketNode";
import Station from "./../../broadcast/Station";
import GraphNode from "./../../graph/Node";
import TileMap from "./../../graph/TileMap";
import Tile from "./../../graph/Tile";
import { EnumComponentType } from "./../../entity/component/Component";
import EnumTerrainType from "./../../graph/Tile";
import EntitySnake from "./entity/EntitySnake";
import { EnumEventType as HIDEnumEventType } from "./../../input/HIDGamePadNode";

export const EnumEventType = {
    GAME_START: "Game.Start",
    GAME_STOP: "Game.Stop",
};

export default class Game extends CoreNode {
    constructor({ settings = {}, fps = 60 } = {}) {
        super({
            state: {
                data: {},
                loop: new GameLoop(fps),
                player: null,
                network: null,
                node: null,
    
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

    get player() {
        return this.state.player;
    }
    set player(player) {
        return this.state.player = player;
    }

    get node() {
        return this.state.node;
    }
    set node(node) {
        return this.state.node = node;
    }

    onTick(ts, dt) {}
    onDraw(ts, ip) {}

    connect({ ws, receive } = {}) {
        this.state.network = new WebSocketNode({
            ws: ws || new WebSocket(`ws://localhost:8080`),
            receive: receive || (data => Station.$.broadcast(Station.$, data)),
        });
    }

    // connect({ ws, receive } = {}) {
    //     this.state.network = new WebSocketNode({
    //         ws: ws || new WebSocket(`ws://localhost:8080`),
    //         //TODO  Look into why this is coming through here as json string
    //         receive: receive || (data => {
    //             if(typeof data === "string" || data instanceof String) {
    //                 try {
    //                     data = JSON.parse(data);
    //                 } catch(e) {}
    //             }
                
    //             Station.$.broadcast(Station.$, data);
    //         }),
    //     });
    // }

    DemoWorld() {
        this.map = new TileMap({
            width: 3,
            height: 3,
            generator: (x, y) => new Tile(EnumTerrainType.FLOOR),
        });
        this.node = new GraphNode({
            map: this.map,
        });
        this.state.player = new EntitySnake({ size: 3 });
        
        Station.$.newChannel("node");
        // Station.$.join("node", console.log);
        
        this.state.player.comp(EnumComponentType.BODY, comp => {
            comp.body.each((lln, i) => {
                lln.value = [ 1, i + 1 ];
        
                if(i === 0) {
                    this.state.player.comp(EnumComponentType.GRAPH, comp => {
                        comp.setPosition(...lln.value);
                        comp.setVelocity(1, 1);
                        
                        return comp;
                    });
        
                    this.node.addEntity(
                        [ ...lln.value, this.state.player ],
                    );
                }
            });
            
            return comp;
        });
        
        Station.$.join("node", this.next.bind(this));
        this.addReducer(CoreNode.TypedMessage([
            HIDEnumEventType.ACTIVATE,
            // HIDEnumEventType.DEACTIVATE,
        ], (state, data) => {
            return {
                ...state,
        
                data: {
                    ...state.data,
                    direction: data.payload.key,
                }
            }
        }));
        this.addEffect((current) => {
            let velocity = [ 0, 0 ];
        
            if(current.data.direction === "dir_up") {
                velocity = [ 0, -1 ];
            } else if(current.data.direction === "dir_down") {
                velocity = [ 0, 1 ];
            } else if(current.data.direction === "dir_left") {
                velocity = [ -1, 0 ];
            } else if(current.data.direction === "dir_right") {
                velocity = [ 1, 0 ];
            }    
            
            this.state.player.comp(EnumComponentType.GRAPH, comp => {
                comp.setVelocity(...velocity);
                
                return comp;
            });
        });
        this.onTick = (ts, dt) => {            
            this.state.player.comp(EnumComponentType.GRAPH, comp => {
                comp.applyVelocity(dt / 1000);
                
                return comp;
            });
        
            this.state.player.comp(EnumComponentType.BODY, comp => {
                const { x, y } = this.state.player.position;
        
                comp.cascade(~~Number(x.toFixed(1)), ~~Number(y.toFixed(1)));
                
                return comp;
            });
        
            const { x, y } = this.state.player.position;
            if(!this.node.isWithinBounds(x, y)) {
                this.this();
        
                console.log("-=: GAME OVER :=-");
            } else {
                console.log("Pos: ", `${ x }, ${ y }`);
            }
        }
        
        this.start();
    }
}