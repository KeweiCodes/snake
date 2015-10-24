import React from "react";
import {Route, IndexRoute} from "react-router";

import Root from "./components/Root";
import GamePanel from "./components/GamePanel";

var routes = (
    <Route component={Root} path="/">
        <IndexRoute component={GamePanel} />
    </Route>
);

export default routes;
