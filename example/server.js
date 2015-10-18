import R from "ramda";
import express from "express";
import ReactMiddleware from "../src";



const startWithMiddlewareInstanceMethod = () => {
    const middleware = ReactMiddleware({ base:"./example/site" });
    middleware.start()
    .then(() => console.log("Start Callback"));
};



const startWithStaticHelperMethod = () => {
    const app = express();
    const middleware = ReactMiddleware({ base:"./example/site" });
    ReactMiddleware.start(app, middleware, { port: 3030 })
    .then(() => console.log("Start Callback"));
  };




const startWithExpress = () => {
    const app = express();
    const site = ReactMiddleware({ base:"./example/site" });
    site.build()
    .then(() => {
        app
          .use(site)
          .listen(3030, () => {
              console.log("Listening on port", 3030);
          });
    });
  };


// ----------------------------------------------------------------------------
startWithStaticHelperMethod();
// startWithMiddlewareInstanceMethod();
// startWithExpress();
