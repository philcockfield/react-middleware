import React from "react";


/**
 * The main home page.
 */
export default class Home extends React.Component {
  render() {
    return (
      <div className="Home">
        <link href="/css/page/Home" rel="stylesheet"/>
        <h1>{ this.props.title || "Home" }</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <div className="image-moon">Moon: bg-image(...)</div>
        <script type="text/javascript" src="/js/page/Home"/>
      </div>
    );
  }
}
