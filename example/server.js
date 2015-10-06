import express from "express";
import ReactMiddleware from "../src";


ReactMiddleware.start({ base:"./example/site" });

// const middleware = ReactMiddleware({ base:"./example/site" });
// middleware.start();
