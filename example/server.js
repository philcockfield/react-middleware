import express from "express";
import ReactMiddleware from "../src";


ReactMiddleware.start({ base:"./example/site", port: 3030 });

// const middleware = ReactMiddleware({ base:"./example/site" });
// middleware.start();
