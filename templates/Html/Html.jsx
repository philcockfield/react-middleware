import React from "react";


/**
 * The root HTML page.
 */
export default class Html extends React.Component {
  render() {
    return (
      <html>
        <head>
          <title>{ this.props.title }</title>
          <meta charSet="utf-8"/>
          <link href="/css/common" rel="stylesheet"/>
        </head>
        <body>
          <div id="root" data-props={ JSON.stringify(this.props.body.props) }>{ this.props.body }</div>
          <script type="text/javascript" src="/js"/>
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
  page: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
  }).isRequired
};
Html.defaultProps = {
  title: "Untitled"
};
