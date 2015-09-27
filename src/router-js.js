import R from "ramda";
import { BUILD_PATH } from "./webpack-builder";

const send = (path) => {
  return (req, res) => res.sendFile(`${ BUILD_PATH }/${ path }`);
};


export default (middleware) => {

  middleware.get("/js", send("base.js"));
};
