import Parse from "./parse";

export async function signUpUser({ email, password }) {
  const user = new Parse.User();
  user.set("username", email);
  user.set("password", password);
  user.set("email", email);

  try {
    return await user.signUp();
  } catch (err) {
    throw new Error(err?.message || "Sign up failed");
  }
}

export default { signUpUser };
