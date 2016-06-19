import R from 'ramda';
import express from 'express';
import ReactMiddleware from '../src';


const PATH = './example/site';
const PORT = 1234;

// ReactMiddleware.init(PATH);



const startWithMiddlewareInstanceMethod = () => {
    const middleware = ReactMiddleware({ base: PATH });
    middleware
      .start()
      .then(() => console.log('Start Callback'));
};


// Simulate a custom logger, eg. Winston.
const logger = {
  info(...msg) { console.log(msg.join(' ')); }
};

const startWithStaticHelperMethod = () => {
    const app = express();
    const middleware = ReactMiddleware({ base: PATH, logger });
    ReactMiddleware
      .start(app, middleware, { port: PORT })
      .then(() => console.log('Start Callback'));
  };




const startWithExpress = () => {
    const app = express();
    const site = ReactMiddleware({ base: PATH });
    site.build()
    .then(() => {
        app
          .use(site)
          .listen(PORT, () => {
              console.log('Listening on port', PORT);
          });
    });
  };


// ----------------------------------------------------------------------------
startWithStaticHelperMethod();
// startWithMiddlewareInstanceMethod();
// startWithExpress();
