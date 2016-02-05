# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).


## [Unreleased] - YYYY-MM-DD
#### Added
#### Changed
#### Deprecated
#### Removed
#### Fixed
#### Security




## [2.2.0] - 2016-02-05
#### Added
- Passing request `url` details to the layout and page props.



## [2.1.0] - 2016-02-05
#### Changed
- Referencing [Babel](https://babeljs.io/) dependencies via `js-babel-ui` and `js-babel-dev` modules.
- Linting updated to use [AirBnB style guide](https://github.com/airbnb/javascript).



## [2.0.0] - 2015-12-29
#### Added
- `webpackLoaders` parameter allowing custom loaders to be passed into the middleware.

#### Removed
- Lodash references (from webpack settings as well). Now using Ramda.



## [1.2.2] - 2015-12-24
#### Changed
- Updated ES6 compiler to use Babel version 6 (from Babel version 5).



## [1.2.0] - 2015-11-26
#### Added
- Lint command within the `prepublish` script.

#### Changed
- Increase required node version to `^5.0.0`

#### Removed
- Init script that copied react into the root `node_modules`.  No longer needed given the way Node 5 manages modules.
