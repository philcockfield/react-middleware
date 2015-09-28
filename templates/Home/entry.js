import React from "react";
import Home from "./Home";

console.log("Home");

React.render(
  React.createElement(Home, { title: "Client" }),
  document.getElementById("root")
);
