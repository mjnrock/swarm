import Node from "../Node";
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
    constructor({ server = [], client = [], ws, wss } = {}, opts = {}) {
        super(opts);

        if(wss) {
            this.state = {
                ws: wss,
                type: EnumType.SERVER,
            };
        } else if(server.length) {
            this.state = {
                ws: new WebSocket.Server(...server),
                type: EnumType.SERVER,
            };
        } else if(ws) {
            this.state = {
                ws,
                type: EnumType.CLIENT,
                clientId: null,
            };
        } else if(client.length) {
            this.state = {
                ws: new WebSocket(...client),
                type: EnumType.CLIENT,
                clientId: null,
            };
        }

        if(this.isServer) {
            this.ws.on("connection", client => {
                client.id = uuidv4();
                client.on("message", this.onMessage.bind(this));
                client.send(JSON.stringify({
                    type: EnumMessageType.CLIENT_ID,
                    payload: client.id,
                }));
            });
        }
        
        this.ws.on("open", this.onOpen.bind(this));
        this.ws.on("message", this.onMessage.bind(this));
        this.ws.on("close", this.onClose.bind(this));
        this.ws.on("error", this.onError.bind(this));
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


    onOpen() {}
    onMessage(msg) {
        try {
            const obj = JSON.parse(msg);

            if(this.isClient) {
                if(obj.type === EnumMessageType.CLIENT_ID) {
                    if(isUUID(obj.payload)) {
                        this.state.clientId = obj.payload;      // Save assigned UUID from server
                    }
                } else {
                    // TODO
                }
            }
        } catch (e) {
            this.onError(e);
        }
    }
    onClose(code) {
        if(code in EnumCloseCode) {
            console.info(`${ EnumCloseCode[ code ][ 2 ] } (${ code })`);
        }
    }
    onError(...args) {}
};