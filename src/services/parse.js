import Parse from "parse/dist/parse.min.js";

const APP_ID =
  process.env.REACT_APP_PARSE_APP_ID ||
  "rxX7m4vzLGRd3yZnesjokyWoPHtBTa0G0sjuMocr";
const JS_KEY =
  process.env.REACT_APP_PARSE_JS_KEY ||
  "Zc3PJPcbi8cGbvOfOg9Tn2Q3XkFfMXbx4FulIw7N";
const SERVER_URL =
  process.env.REACT_APP_PARSE_SERVER_URL || "https://parseapi.back4app.com";

Parse.initialize(APP_ID, JS_KEY);
Parse.serverURL = SERVER_URL;

export default Parse;
