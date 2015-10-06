import express from "express";
import ReactMiddleware from "../src";



const middleware = ReactMiddleware({ base:"./example/site" });
middleware.start();
