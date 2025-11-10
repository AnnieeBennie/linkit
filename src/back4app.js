import Parse from "parse/dist/parse.min.js";

const APP_ID  = process.env.REACT_APP_PARSE_APP_ID;
const JS_KEY  = process.env.REACT_APP_PARSE_JS_KEY;
const URL     = process.env.REACT_APP_PARSE_URL || "https://parseapi.back4app.com/";

Parse.serverURL = URL;
Parse.initialize(APP_ID, JS_KEY);

export default Parse;



