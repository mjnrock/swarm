import React from "react";
import Controller, { EnumKeyMessage } from "./controller/Controller";

const controller = new Controller();
controller.bindKey(32, (...args) => console.log(...args));
controller.bindKey(32, (...args) => console.log(...args), EnumKeyMessage.KEY_DOWN);
controller.bindMouse(0, (...args) => console.log(...args));

function App() {
    return (
        <div>Test</div>
    );
}

export default App;