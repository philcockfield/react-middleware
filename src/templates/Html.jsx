import React from "react";


/**
 * The root HTML page.
 */
export default class Html extends React.Component {
  render() {
    console.log("Layout props", this.props); // TEMP
    return (
      <html>
        <head>
          <title>{ this.props.title }</title>
          <meta charSet="utf-8"/>
        </head>
        <body>
          <h1>Layout</h1>
          { this.props.body }
        </body>
      </html>
    );
  }
}

// API -------------------------------------------------------------------------
Html.propTypes = {
  title: React.PropTypes.string,
  body: React.PropTypes.node,
  env: React.PropTypes.oneOf(["production", "development"]),
};
Html.defaultProps = {
  title: "Untitled",
  env: "development"
};
