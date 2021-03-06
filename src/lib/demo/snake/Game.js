import CoreNode from "./../../Node";
import GameLoop from "./GameLoop";
import { v4 as uuidv4 } from "uuid";
import WebSocketNode from "./../../network/WebSocketNode";
import Station from "./../../broadcast/Station";
import GraphNode from "./../../graph/Node";
import TileMap from "./../../graph/TileMap";
import Tile from "./../../graph/Tile";
import { EnumComponentType } from "./entity/component/Component";
import { EnumTerrainType } from "./../../graph/Tile";
import EntitySnake from "./entity/EntitySnake";
import EntityFruit from "./entity/EntityFruit";
import { EnumEventType as HIDEnumEventType } from "./../../input/HIDGamePadNode";
import ViewManager from "./../../view/ViewManager";
import GameView from "../../view/GameView";
import TileCamera from "./../../map/TileCamera";

export const EnumEventType = {
    GAME_START: "Game.Start",
    GAME_STOP: "Game.Stop",
    TICK: "Game.Tick",
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
                view: new ViewManager(),
    
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

    get view() {
        return this.state.view;
    }
    set view(view) {
        return this.state.view = view;
    }

    onTick(ts, dt) {}
    onDraw(ts, ip) {}

    connect({ ws, receive } = {}) {
        this.state.network = new WebSocketNode({
            ws: ws || new WebSocket(`ws://localhost:8080`),
            //TODO  Look into why this is coming through here as json string
            receive: receive || (data => {
                if(typeof data === "string" || data instanceof String) {
                    try {
                        data = JSON.parse(data);
                    } catch(e) {}
                }
                
                Station.$.broadcast(Station.$, data);
            }),
        });
    }

    DemoWorld() {
        this.map = new TileMap({
            width: 50,
            height: 50,
            generator: (x, y) => new Tile(EnumTerrainType.FLOOR),
        });
        this.node = new GraphNode({
            map: this.map,
        });
        this.player = new EntitySnake({ size: 5 });
        
        Station.$.newChannel("node");
        Station.$.newChannel("game");
        
        this.player.comp(EnumComponentType.BODY, comp => {
            const arr = [ 24, 24 ];
            
            comp.set(0, ...arr);
            this.state.player.comp(EnumComponentType.GRAPH, comp => {
                comp.setPosition(...arr);
                comp.setVelocity(0, 1);
                
                return comp;
            });

            this.node.addEntity(
                [ ...arr, this.state.player ],
            );

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
            let velocity = [ this.player.velocity.vx, this.player.velocity.vy ],
                factor = 10;
        
            if(current.data.direction === "dir_up") {
                velocity = [ 0, -1 * factor ];
            } else if(current.data.direction === "dir_down") {
                velocity = [ 0, 1 * factor ];
            } else if(current.data.direction === "dir_left") {
                velocity = [ -1 * factor, 0 ];
            } else if(current.data.direction === "dir_right") {
                velocity = [ 1 * factor, 0 ];
            }    
            
            this.state.player.comp(EnumComponentType.GRAPH, comp => {
                comp.setVelocity(...velocity);
                
                return comp;
            });
        });

        this.onTick = (ts, dt) => {
            this.node.each(entity => {
                if(entity instanceof EntitySnake) {
                    entity.comp(EnumComponentType.GRAPH, comp => {
                        comp.applyVelocity(dt / 1000);
                        
                        return comp;
                    });
        
                    entity.comp(EnumComponentType.BODY, comp => {
                        const { x, y } = entity.position;
                        const { x: nx, y: ny } = comp.head();
        
                        if(~~x !== ~~nx || ~~y !== ~~ny) {
                            comp.cascade(~~x, ~~y);
                        }
        
                        let purge = [];
                        this.node.each(e2 => {
                            if(e2 instanceof EntityFruit) {
                                e2.comp(EnumComponentType.GRAPH, graph => {
                                    const { x: e2x, y: e2y } = graph.pos;
            
                                    if(~~x === ~~e2x && ~~y === ~~e2y) {
                                        purge.push(e2);
            
                                        comp.grow(3);
                                    }
                                    
                                    return graph;
                                });
                            }
                        });
                
                        purge.forEach(entity => {
                            this.node.removeEntity(entity);
                        });
                        
                        return comp;
                    });
                }
            });

            if(Math.random() > 0.997) {                
                const [ x, y ] = [ 
                    ~~(Math.random() * this.state.node.width),
                    ~~(Math.random() * this.state.node.height),
                ];

                this.node.addEntity(
                    [ x, y, new EntityFruit({ x, y }) ],
                );
            }
        
            const { x, y } = this.state.player.position;
            if(!this.node.isWithinBounds(x, y)) {
                this.stop();
        
                console.log("-=: GAME OVER :=-");
            } else {
                // console.log("Pos: ", `${ x }, ${ y }`);
            }

            //TODO Rewrite to respond to tick event, not emit it.
            //TODO Make state update from receiving a tick event, at least as simple as .lastTick/.ticks/etc., so as to propagate to React via state change
            // this.emit(EnumEventType.TICK, [ ts, dt ]);
            Station.$.invoke("game", Station.$, {
                type: EnumEventType.TICK,
                payload: [ ts, dt ],
            });
        }
        

        this.view.create({
            key: "GameView",
            value:  () => new GameView({
                node: this.node,
                camera: new TileCamera(this.node, {
                    x: 0,
                    y: 0,
                    w: 50,
                    h: 50,
                    tw: 16,
                    th: 16,
                    game: this,
                })
            }),
        });
        this.view.use("GameView");

        Station.$.join("game", this.next.bind(this));
        this.addReducer(CoreNode.TypedMessage(EnumEventType.TICK, (state, msg) => {
            // eslint-disable-next-line
            const [ ts, dt ] = msg.payload;

            return {
                ...state,
        
                lastTick: ts,
            }
        }));

        this.onDraw = (ts, ip) => {
            if(this.view.current instanceof GameView) {
                this.view.current.camera.draw(this, ts, ip);
            }
        }
        
        this.start();
    }
}