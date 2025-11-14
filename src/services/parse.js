import Parse from "parse/dist/parse.min.js";

// Initialize Parse once here so non-React scripts can import this module and
// get a ready-to-use Parse instance. Values are read from environment vars and
// fall back to the existing keys used previously in the project.
const APP_ID = process.env.REACT_APP_PARSE_APP_ID ||
	"rxX7m4vzLGRd3yZnesjokyWoPHtBTa0G0sjuMocr";
const JS_KEY = process.env.REACT_APP_PARSE_JS_KEY ||
	"Zc3PJPcbi8cGbvOfOg9Tn2Q3XkFfMXbx4FulIw7N";
const SERVER_URL = process.env.REACT_APP_PARSE_SERVER_URL ||
	"https://parseapi.back4app.com";

Parse.initialize(APP_ID, JS_KEY);
Parse.serverURL = SERVER_URL;

// Anonymous login
async function ensureAnonUser() {
  try {
    if (!Parse.User.current()) {
      await Parse.AnonymousUtils.logIn();
    }
  } catch (err) {
    console.error("Anonymous login failed:", err);
  }
}
ensureAnonUser();

export default Parse;
