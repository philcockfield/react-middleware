# react-middleware
[![Build Status](https://travis-ci.org/philcockfield/react-middleware.svg?branch=master)](https://travis-ci.org/philcockfield/react-middleware)

Connect middleware for serving React components from a standard folder structure.


## Getting Started

    npm install --save react-middleware

Once the module is added to your project, you can initialize the convention base folder structure using the `init` method:

```js
import ReactMiddleware from "react-middleware";
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



From here you can start the server in the following ways:

##### Instance Helper on Middleware

```js
const middleware = ReactMiddleware({ base:"./site" });
middleware.start(3030)
.then(() => {
  // Startup complete (callback).
});
```

##### Static Helper on Middleware
This option is useful if you want to incorporate your `react-middleware` site within a wider Express application.

```js
const app = express();
const middleware = ReactMiddleware({ base:"./example/site" });
ReactMiddleware.start(app, middleware, { port: 3030 })
.then(() => {
  // Startup complete (callback).
});
```

Options for starting:

- `port`: The port to run the app on.
- `name`: The display name of the application (emitted to console).
- `version`: The version of the application (emitted to console).



##### Using Express
Alternatively you can start the server using Express without the convenience
methods shown above:


```js
const app = express();
const site = ReactMiddleware({ base:"./example/site" });
site.build()
.then(() => {
    app
      .use(site)
      .listen(3030, () => {
          console.log("Listening on port", 3030);
      });
});
```

Notice the `build()` step that ensures all the static assets (js,css) have been compiled.


#### Passing Custom Loaders
Sometimes you need to pass in custom webpack loaders:

```js
const webpackLoaders = [
  {
    test: /\.js$/,
    exclude: /(node_modules)/,
    loader: "babel",
    query: {
      plugins: [ fsPath.join(__dirname, "relay-plugin") ]
    }
  },
  { test: /\.json$/, loader: "json" }
];

const site = ReactMiddleware({ base:"./example/site", webpackLoaders });
```

This will replace the default set of loaders with the given array.


#### Passing Custom Logger
The ReactMiddleware logs startup information.  To have this write to a customer logger (eg [Winston](https://www.npmjs.com/package/winston)), you can pass a logger to the middleware at initialization:

```js
import winston from "winston";
const logger = new (winston.Logger)({ ... });
const site = ReactMiddleware({ base:"./example/site", logger });
```

The logger object should expose `.info`, `.warn` and `.error` methods.

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
