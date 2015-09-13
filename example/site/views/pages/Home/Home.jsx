import React from "react";


/**
 * The main home page.
 */
export default class Home extends React.Component {
  render() {
    console.log("Home props:", this.props); // TEMP
    return (
      <div>Home</div>
    );
  }
}

// API -------------------------------------------------------------------------
Home.propTypes = {
  env: React.PropTypes.oneOf(["production", "development"]),
};
Home.defaultProps = {
  env: "development"
};
