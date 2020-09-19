import { EnumComponentType as CoreEnumComponentType } from "./../../../../entity/component/Component";

export const EnumComponentType = {
    ...CoreEnumComponentType,
    BODY: 2 << 1
};