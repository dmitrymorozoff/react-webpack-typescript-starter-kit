import "normalize.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { storeCreator } from "./redux-helper/index";
import "./styles/global.scss";
import { Root } from "./views/index";

const store = storeCreator.createStore();

console.log(store.getState());

ReactDOM.render(<Root store={store} />, document.getElementById("root"));
