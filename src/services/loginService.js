import Parse from "./parse";

/**
 * Logs in a user using Parse's _User table.
 */

export async function loginUser({ email, password }) {
  try {
    const user = await Parse.User.logIn(email, password);
    return user;
  } catch (err) {
    throw new Error(err?.message || "Login failed");
  }
}

export default { loginUser };