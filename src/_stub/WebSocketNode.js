import Node from "./Node";
import { v4 as uuidv4, validate as isUUID } from "uuid";

export const EnumType = {
    CLIENT: "client",
    SERVER: "server",
};

export const EnumMessageType = {
    CLIENT_ID: "WebSocketNode.ClientID",
};

export const EnumCloseCode = {
    1000: [ 1000, "CLOSE_NORMAL", "Successful operation / regular socket shutdown" ],
    1001: [ 1001, "CLOSE_GOING_AWAY", "Client is leaving (browser tab closing)" ],
    1002: [ 1002, "CLOSE_PROTOCOL_ERROR", "Endpoint received a malformed frame" ],
    1003: [ 1003, "CLOSE_UNSUPPORTED", "Endpoint received an unsupported frame (e.g. binary-only endpoint received text frame)" ],
    1005: [ 1005, "CLOSED_NO_STATUS", "Expected close status, received none" ],
    1006: [ 1006, "CLOSE_ABNORMAL", "No close code frame has been receieved" ],
    1007: [ 1007, "UNSUPPORTED PAYLOAD", "Endpoint received inconsistent message (e.g. malformed UTF-8)" ],
    1008: [ 1008, "POLICY VIOLATION", "Generic code used for situations other than 1003 and 1009" ],
    1009: [ 1009, "CLOSE_TOO_LARGE", "Endpoint won't process large frame" ],
    1010: [ 1010, "MANDATORY EXTENSION", "Client wanted an extension which server did not negotiate" ],
    1011: [ 1011, "SERVER ERROR", "Internal server error while operating" ],
    1012: [ 1012, "SERVICE RESTART", "Server/service is restarting" ],
    1013: [ 1013, "TRY AGAIN LATER", "Temporary server condition forced blocking client's request" ],
    1014: [ 1014, "BAD GATEWAY", "Server acting as gateway received an invalid response" ],
    1015: [ 1015, "TLS HANDSHAKE FAILURE", "Transport Layer Security handshake failure" ],
};

export default class WebSocketNode extends Node {
    constructor({ server = [], client = [], ws, wss, receive } = {}, opts = {}) {
        super(opts);

        if(wss) {
            this.state = {
                ws: wss,
                type: EnumType.SERVER,
                hooks: {
                    receive,
                },
                clients: new Map(),
            };
        } else if(server.length) {
            this.state = {
                ws: new WebSocket.Server(...server),
                type: EnumType.SERVER,
                hooks: {
                    receive,
                },
                clients: new Map(),
            };
        } else if(ws) {
            this.state = {
                ws,
                type: EnumType.CLIENT,
                hooks: {
                    receive,
                },
                clientId: null,
            };
        } else if(client.length) {
            this.state = {
                ws: new WebSocket(...client),
                type: EnumType.CLIENT,
                hooks: {
                    receive,
                },
                clientId: null,
            };
        }

        if(this.isServer) {
            this.addReducer((state, ...args) => {
                const [ client ] = args;

                if(client && isUUID(client.id)) {
                    if(state.clients.has(client.id)) {
                        state.clients.delete(client.id);
                    } else {
                        state.clients.set(client.id, client);
                    }

                    return {
                        ...state,

                        clients: state.clients,
                    };
                }

                return state;
            });

            this.ws.on("connection", client => {
                client.id = uuidv4();
                client.on("message", this.onMessage.bind(this));
                client.on("close", code => this.onClose.call(this, code, client));
                client.send(JSON.stringify({
                    type: EnumMessageType.CLIENT_ID,
                    payload: client.id,
                }));

                this.next(client);
            });
        }
        
        if("on" in this.ws) {
            this.ws.on("message", this.onMessage.bind(this));
            this.ws.on("error", this.onError.bind(this));

            if(this.isClient) {
                this.ws.on("open", this.onOpen.bind(this));
                this.ws.on("close", this.onClose.bind(this));
            }
        } else {
            this.ws.onmessage = this.onMessage.bind(this);
            this.ws.onerror = this.onError.bind(this);

            if(this.isClient) {
                this.ws.onopen = this.onOpen.bind(this);
                this.ws.onclose = this.onClose.bind(this);
            }
        }
    }

    get ws() {
        return this.state.ws;
    }

    get isReady() {
        return this.ws && this.ws.readyState === 1;
    }

    get type() {
        return this.state.type;
    }
    get isClient() {
        return this.type === EnumType.CLIENT;
    }
    get isServer() {
        return this.type === EnumType.SERVER;
    }

    send(type, payload) {
        if(this.isClient) {
            try {
                this.ws.send(JSON.stringify({
                    type,
                    payload: typeof payload === "object" ? payload : { value: payload },
                }));
            } catch(e) {
                this.onError(e);
            }
        } else {
            const [ clientId, type, payload ] = arguments;
            let client;

            if(isUUID(clientId)) {
                client = this.state.clients.get(clientId);
            } else if(typeof clientId === "object") {
                client = clientId;
            }

            if(client) {
                try {
                    client.send(JSON.stringify({
                        type,
                        payload,
                    }));
                } catch(e) {
                    this.onError(e);
                }
            }
        }
    }
    broadcast(type, payload) {
        if(this.isServer) {
            this.ws.clients.forEach(client => {
                if(client.readyState === 1) {
                    this.send(client, type, payload);
                }
            });
        }
    }

    onOpen() {}
    onMessage(msg) {
        try {
            if(this.isServer) {
                const data = JSON.parse(msg);
            
                if(typeof this.state.hooks.receive === "function") {
                    this.state.hooks.receive.call(this, data);
                }
            } else {
                const data = JSON.parse(msg.data);

                if(data.type === EnumMessageType.CLIENT_ID) {
                    if(isUUID(data.payload)) {
                        this.state.clientId = data.payload;      // Save assigned UUID from server
                    }
                }                
            
                if(typeof this.state.hooks.receive === "function") {
                    this.state.hooks.receive.call(this, data);
                }
            }
        } catch (e) {
            this.onError(e);
        }
    }
    onClose(code, client) {
        if(this.isServer) {
            if(code in EnumCloseCode) {
                console.info(`[${ client.id }]: ${ EnumCloseCode[ code ][ 2 ] } (${ code })`);
            }

            this.next(client);
        }
    }
    onError(...args) {}
};