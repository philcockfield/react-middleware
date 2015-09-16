import fsCss from "fs-css";
const IS_DEVELOPMENT = process.env.NODE_ENV !== "production";



export default (middleware) => {
  const paths = middleware.paths;
  const options = {
    watch: IS_DEVELOPMENT,
    minify: true
  };

  // fsCss.compile(paths.css, options)
  // .then(result => {
  //     // console.log("result.paths", result.files);
  //     const css = result.css;
  //     console.log("css: ", css.substr(0, 350)); // TEMP
  //     // console.log("css", css);
  // });

};
