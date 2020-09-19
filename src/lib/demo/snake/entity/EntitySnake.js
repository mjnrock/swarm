import Entity from "./../../../entity/Entity";
import { EnumComponentType } from "./component/Component"
import Body from "./component/Body";

export default class EntitySnake extends Entity {
    constructor({ size } = {}, opts = {}) {
        super(opts);

        this.state.components.set(EnumComponentType.BODY, new Body(size));
    }
}