import Registry from "@lespantsfancy/hive/lib/ext/Registry";

export default class ViewManager extends Registry {
    constructor(views = []) {
        super();

        views.forEach(view => {
            if(view instanceof View) {
                this.create(ViewManager.Package(view.id, view));
            } else if(Array.isArray(view)) {
                this.create(ViewManager.Package(...view));
            } else if(typeof view === "object") {
                this.create(view);
            }
        });
    }

    static Package(key, value) {
        return {
            key,
            value: typeof value === "function" ? value : () => value,
        };
    }

    get current() {
        return this._current;
    }
    set current(current) {
        this._current = current;
    }

    use(key) {
        const current = this.get(key);

        if(current) {
            this._current = current();
        }

        return this._current;
    }

    start() {
        this.use("GameView");
        Game.$.start();
    }
    stop() {
        Game.$.stop();
    }
}