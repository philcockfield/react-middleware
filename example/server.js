import express from "express";
import ReactServerPages from "../src";


// ReactServerPages.start({ base:"./example/site" });
// ReactServerPages.clearCache();

const middleware = ReactServerPages({ base:"./example/site" });
// const app = express().use(middleware);

// Create the folder-structure and base template files.
// middleware.clearCache();
// middleware.templates.create();
// middleware.start();
// middleware.init();
middleware.start();
