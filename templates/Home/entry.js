import React from "react";
import Home from "./Home";


if (typeof window !== 'undefined') {
  console.log("Home/entry.js");
  React.render(
    React.createElement(Home, { title: "Client" }),
    document.getElementById("root")
  );
}
