import Hive from "@lespantsfancy/hive";
import Station from "./hive/Station";
import GameLoop from "./_GameLoop";
import { v4 as uuidv4 } from "uuid";
import ViewManager from "./view/ViewManager";
import { Enumerator } from "./hive/Helper";

export const EnumEventType = Enumerator({
    GAME_START: "Game.Start",
    GAME_STOP: "Game.Stop",
});

export default class Game extends Hive.Node {
    constructor({ settings = {}, fps = 60 } = {}) {
        super({
            players: [],
            graph: null,
            view: new ViewManager(),
            broadcastNetwork: new Station([ "graph", "node", "player", "entity", ]),
            loop: null,

            settings: {
                isRunning: false,
                isDebugMode: false,
                showNameplates: true,
                showUI: false,

                ...settings,
            },

            react: {
                canvas: null,
            },
        });

        this.id = uuidv4();

        this.state.loop = new GameLoop(fps);

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
        this.state.settings.isRunning = true;
        this.state.loop.start();
        this.dispatch(EnumEventType.GAME_START, this);

        return this;
    }
    stop() {
        this.state.settings.isRunning = false;
        this.state.loop.stop();
        this.dispatch(EnumEventType.GAME_STOP, this);

        return this;
    }

    get react() {
        return this.state.react;
    }

    get player() {
        return this.state.players[ 0 ];
    }
    set player(player) {
        this.state.players.splice(0, 1, player);
    }

    get graph() {
        return this.state.graph;
    }
    set graph(graph) {
        this.state.graph = graph;
    }

    get view() {
        return this.state.view;
    }
    set view(view) {
        this.state.view = view;
    }

    get broadcastNetwork() {
        return this.state.broadcastNetwork;
    }
    set broadcastNetwork(broadcastNetwork) {
        return this.state.broadcastNetwork = broadcastNetwork;
    }

    channel(name) {
        return this.state.broadcastNetwork.getChannel(name);
    }

    send(channelName, thisArg, type, ...args) {
        this.channel(channelName).invoke(thisArg, type, ...args);

        return this;
    }
    broadcast(thisArg, ...args) {
        this.broadcastNetwork.broadcast(thisArg, ...args);

        return this;
    }
}