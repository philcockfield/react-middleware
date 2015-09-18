export default {
  "/": {
    page: "home",
    title: "Home Page",
    props: {}
  },

  "/mobile-layout": {
    page: "home",
    layout: "Mobile",
    title: "Mobile Home Page"
  },

  "/mobile-layout-func": {
    page: (args) => "home",
    layout: (args) => "Mobile",
    title: (args) => "Mobile Home Page (Func)"
  },

  "/root-layout": {
    page: (args) => "home",
    layout: (args) => "Root",
    title: (args) => "Mobile Home Page (Func)"
  }
};
