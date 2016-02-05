import React from "react";

export default class Features extends React.Component {
  render() {
    return (
      <div className="Features" data-body-url={ this.props.request.url.pathname }>
        Features
      </div>
    );
  }
}
