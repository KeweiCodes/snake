import '../static/css/main';
import React from "react";
import ReactDOM from "react-dom";
var { Router } = require('react-router');
var routes = require("./routes");

//ReactDOM.render(<Router>{routes}</Router>, document.getElementById('app'));


import createBrowserHistory from 'history/lib/createBrowserHistory'
let history = createBrowserHistory()

ReactDOM.render(<Router history={history}>{routes}</Router>, document.getElementById('app'));
