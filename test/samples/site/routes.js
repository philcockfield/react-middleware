export default {
  "/": {
    page: "Home",
    title: "Home Page",
    props: {}
  },

  "/features": {
    page: "Features",
    title: "Features Page",
    props: {}
  },

  "/mobile-layout": {
    page: "Home",
    layout: "Mobile",
    title: "Mobile Home Page"
  },

  "/mobile-layout-func": {
    page: (args) => "Home",
    layout: (args) => "Mobile",
    title: (args) => "Mobile Home Page (Func)"
  },

  "/root-layout": {
    page: (args) => "Home",
    layout: (args) => "Root",
    title: (args) => "Mobile Home Page (Func)"
  }
};
