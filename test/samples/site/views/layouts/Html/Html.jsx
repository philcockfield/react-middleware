import React from "react";


/**
 * The root HTML page.
 */
export default class Html extends React.Component {
  render() {
    return (
      <html data-layout="html">
        <head>
          <title>{ this.props.title }</title>
          <meta charSet="utf-8"/>
          <link href="/css" rel="stylesheet"/>
        </head>
        <body className="desktop" data-layout-url={ this.props.request.url.pathname }>
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
