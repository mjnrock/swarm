import View from "./View";

export default class GameView extends View {
    constructor({ node, camera } = {}) {
        super();

        this.node = node;
        this.camera = camera;
    }
}