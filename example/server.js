import express from "express";
import ReactMiddleware from "../src";


// ReactMiddleware.start({ base:"./example/site" });
// ReactMiddleware.clearCache();

const middleware = ReactMiddleware({ base:"./example/site" });
// const app = express().use(middleware);

// Create the folder-structure and base template files.
// middleware.clearCache();
// middleware.templates.create();
// middleware.start();
// middleware.init();
middleware.start();
