import React from "react";
import ReactDOM from "react-dom";
import Home from "./Home";

if (typeof window !== "undefined") {
  console.log("Home/entry.js");

  const elRoot = document.getElementById("root");
  const props = JSON.parse(elRoot.dataset.props || "{}");

  ReactDOM.render(
    React.createElement(Home, props),
    elRoot
  );
}
