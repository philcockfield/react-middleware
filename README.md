# react-middleware
[![Build Status](https://travis-ci.org/philcockfield/react-middleware.svg?branch=master)](https://travis-ci.org/philcockfield/react-middleware)

Connect middleware for serving React components from a standard folder structure.

## Getting Started

    npm install --save react-middleware

Once the module is added to your project, you can initialize the convention base folder structure using the `init` method:

```js
require("babel/register")({ stage: 1 });
var ReactMiddleware = require("react-middleware");
ReactMiddleware.init("./site");
```

The `init` method need only be called once, and it lays down the following folder structure within the base folder:


    /site
      |-- routes.js         # Page routes.
      |-- css               # Global stylesheets.
      |-- scripts           # Global javascript (eg. analytics).
      |-- public            # Static assets.
      |-- views
          |-- components    # Reusable UI components.
          |-- layouts       # Root level page layouts.
          |-- pages         # Specific pages.


From here you can start the server, either by calling `start` directly on the middleware, optionally passing a port:

```js
var middleware = ReactMiddleware({ base:"./site" });
middleware.start(3030);
```

Or by applying it to an existing connect server:

```js
import express from "express";
import ReactMiddleware from "react-middleware";
const middleware = ReactMiddleware({ base:"./site" });
const app = express().use(middleware);
app.listen(3030);

```





## CSS
The module works on the philosophy that styles, if not within the HTML component itself, should be as damn close to the corresponding component as possible.  CSS and layup are two sides of the same coin - they are not seperate concerns.

Situate **.styl** or **.css** files next to your Page.jsx or Component.jsx and the server will automatically find and compile it into production-ready CSS.

#### Global CSS
In the cases where you need global CSS, such as resets and common page/class styles, place these within the folder:

    /base
      |-- /css # Global CSS.

This folder is automatically populated with the [normalize.css](https://necolas.github.io/normalize.css/) reset file.

#### Referencing CSS
To bring CSS into the served page use the `/css` route, for example:

```html
<head>
  <!--
    The "/css" path combines all CSS across
        - global
        - layouts
        - pages
        - components
  -->
  <link href="/css" rel="stylesheet"/>
</head>
```    

To selectively bring in a subset of site's CSS pass a query-string:

- `?global` - includes the CSS within the `<base>/css` folder.
- Layouts
    - `?layouts` - includes all CSS within the `/views/layouts` folder.
    - `?layout=<Name>` - includes only the named layout or comma-seperated list of layout names.
- Pages
    - `?pages` - includes all CSS within the `/views/pages` folder.
    - `?page=<Name>` - includes only the named page or comma-seperated list of page names.
- Components
    - `?components` - includes all CSS within the `/views/components` folder.
    - `?component=<Name>` - includes only the named component or comma-seperated list of component names.


For example:
```html
<head>
  <link href="/css?global&components&page=Features" rel="stylesheet"/>
</head>
```    

Some common CSS paths are provided:

```html
<link href="/css/common" /><!-- Global, layouts, components -->
<link href="/css/global" /><!-- Global css. -->

<link href="/css/layouts" /><!-- All layouts -->
<link href="/css/layout/:Name1,:Name2" /><!-- The specified layout or comma-seperated list of layouts -->

<link href="/css/pages" /><!-- All pages -->
<link href="/css/page/:Name1,:Name2" /><!-- The specified page or comma-seperated list of pages -->

<link href="/css/components" /><!-- All components -->
<link href="/css/component/:Name1,:Name2" /><!-- The specified page or comma-seperated list of pages -->
```
