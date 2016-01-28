import R from "ramda";
import express from "express";
import ReactMiddleware from "../src";


const PATH = "./example/site";


// ReactMiddleware.init(PATH);



const startWithMiddlewareInstanceMethod = () => {
    const middleware = ReactMiddleware({ base: PATH });
    middleware.start()
    .then(() => console.log("Start Callback"));
};


// Simulate a custom logger, eg. Winston.
const logger = {
  info(...msg) { console.log(msg.join(" ")); }
};

const startWithStaticHelperMethod = () => {
    const app = express();
    const middleware = ReactMiddleware({ base: PATH, logger });
    ReactMiddleware.start(app, middleware, { port: 3030 })
    .then(() => console.log("Start Callback"));
  };




const startWithExpress = () => {
    const app = express();
    const site = ReactMiddleware({ base: PATH });
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
