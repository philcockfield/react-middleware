import R from "ramda";
import fs from "fs-extra";
import { BUILD_PATH } from "./webpack-builder";

const send = (res, path) => {
    path = `${ BUILD_PATH }/${ path }`;
    fs.exists(path, exists => {
        if (exists) {
          res.sendFile(path);
        } else {
          res.status(404).send({ message: "Javascript file not found." })
        }
    })
};


export default (middleware, routes) => {
  middleware.get("/js", (req, res) => send(res, "base.js"));
  middleware.get("/js/page/:name", (req, res) => send(res, `pages/${ req.params.name }.js`));
};
