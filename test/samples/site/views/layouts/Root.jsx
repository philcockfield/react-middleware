import React from "react";


export default class Root extends React.Component {
  render() {
    return (
      <html data-layout="root">
        <head>
          <title>{ this.props.title }</title>
          <meta charSet="utf-8"/>
          <link href="/css" rel="stylesheet"/>
        </head>
        <body className="desktop">
          <div id="root">{ this.props.body }</div>
        </body>
      </html>
    );
  }
}
