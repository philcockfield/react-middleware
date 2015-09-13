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
          <div id="root">{ this.props.body }</div>
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
  title: "Untitled"
};
