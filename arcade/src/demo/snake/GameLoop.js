import MainLoop from "mainloop.js";

export default class GameLoop {
    constructor(fps = 30, hooks = {}) {
        this._fps = fps;
        this._hooks = hooks;

        this.loop = MainLoop.setBegin(this.pre.bind(this))
            .setUpdate(this.update.bind(this))
            .setDraw(this.draw.bind(this))
            .setEnd(this.post.bind(this))
            .setSimulationTimestep(this.spf);
    }

    get hooks() {
        return this._hooks;
    }

    get fps() {
        return this._fps;
    }
    set fps(fps) {
        this._fps = fps;

        if(this.isRunning === true) {
            this.stop();
            this.start();
        }
    }
    get spf() {
        return 1000 / this.fps;
    }

    start() {
        this.loop.start();

        return this;
    }
    stop() {
        

        return this;
    }

    /**
     * @param {number} ts Total elapsed time
     * @param {number} dt Frame delta in ms
     */
    pre(ts, dt) {
        try {
            this._hooks.pre(ts, dt);
        } catch(e) {}
    }

    /**
     * @param {number} dt Frame delta in ms
     */
    update(dt) {
        try {
            this._hooks.update(Date.now(), dt);
        } catch(e) {}
    }

    /**
     * @param {number} interpolationPercentage A factor between 0.0 and 1.0, used as a scaling weight similar to delta time
     */
    draw(interpolationPercentage) {        
        try {
            this._hooks.draw(Date.now(), interpolationPercentage);
        } catch(e) {}
    }

    post(fps, panic) {
        if(panic) {
            let discardedTime = Math.round(MainLoop.resetFrameDelta());
            console.warn("Main loop panicked, probably because the browser tab was put in the background. Discarding ", discardedTime, "ms");
        }
        
        try {
            this._hooks.post(fps);
        } catch(e) {}
    }
}