import Parse from "./parse";

/**
 * Simple sign-up using Parse (_User class).
 * Returns the created user object on success or throws an error.
 */
export async function signUpUser({ email, password }) {
  const user = new Parse.User();
  // Use email as the username so callers don't need to provide a separate username
  user.set("username", email);
  user.set("password", password);
  user.set("email", email);

  try {
    const created = await user.signUp();
    return created;
  } catch (err) {
    // Normalize error message
    const message = err?.message || String(err);
    throw new Error(message);
  }
}

export default { signUpUser };
