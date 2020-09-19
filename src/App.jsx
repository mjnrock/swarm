import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import ScrollToTop from "./ScrollToTop";
import Routes from "./routes/package";

import Game from "./lib/demo/snake/Game";

// Game.$.connect();
console.log(Game.$)
Game.$.DemoWorld();

export const Context = React.createContext(Game.$);

function App() {
    return (
        <Router>
            <ScrollToTop>
                <Context.Provider value={{ node: Game.$ }}>
                    <Switch>                            
                        <Route path="/">
                            <Routes.Home />
                        </Route>
                    </Switch>
                </Context.Provider>
            </ScrollToTop>
        </Router>
    )
}

export default App;