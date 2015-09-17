# react-server-pages
[![Build Status](https://travis-ci.org/philcockfield/react-server-pages.svg?branch=master)](https://travis-ci.org/philcockfield/react-server-pages)

Connect middleware for serving React components from a standard folder structure.

## TODO
- [ ] js (common scrip)
- [ ] webpack react
- [ ] css/stylus
- [ ] caching


## CSS
This module works on the philosophy that styles, if not within a components itself, should be as damn close to the corresponding component as possible.

Situate **.styl** or **.css** files next to the Page.jsx or Component.jsx and the server will automatically find and compile it into production-ready CSS.

#### Global CSS
Place global CSS, such as resets and common page/class styles, within the folder:

    /base
      |-- /css # Global CSS.

This folder is automatically populated with the [normalize.css](https://necolas.github.io/normalize.css/) reset file.

#### Referencing CSS
The special `/css` route serves compiled CSS:

    /css                # The contents of the /css folder.
    /css?page=:name     # The global CSS and the given page names (comma seperated).
    /css/page/:name     # All CSS within the current page's folder.
    /css/components     # All CSS within the /components folder.

For example:

```html
<head>
  <link href="/css" rel="stylesheet"/>
  <link href="/css/page" rel="stylesheet"/>
</head>
```    



## Run
    npm install
    npm start


## Test
    # Run tests.
    npm test

    # Watch and re-run tests.
    npm run tdd
