import React from 'react';


export default class Mobile extends React.Component {
  render() {
    return (
      <html>
        <head>
          <title>{ this.props.title }</title>
          <meta charSet="utf-8"/>
          <link href="/css" rel="stylesheet"/>
        </head>
        <body className="mobile">
          <div id="root">{ this.props.body }</div>
        </body>
      </html>
    );
  }
}
