import Parse from "./parse";

// --- Register ---
export async function registerForEvent(eventId) {
  const user = Parse.User.current();
  if (!user) throw new Error("You must be logged in.");

  // event pointer
  const Event = Parse.Object.extend("Events");
  const event = new Event();
  event.id = eventId;

  // check if already registered
  const q = new Parse.Query("RegisteredEvents");
  q.equalTo("user", user);
  q.equalTo("event_id", event);
  const found = await q.first();
  if (found) return found;

  // create new registration
  const Registered = Parse.Object.extend("RegisteredEvents");
  const reg = new Registered();
  reg.set("user", user);
  reg.set("event_id", event);

  // ACL only for this user
  reg.setACL(new Parse.ACL(user));

  return await reg.save();
}

// --- Check registration ---
export async function getRegistrationForEvent(eventId) {
  const user = Parse.User.current();
  if (!user) return null;

  const Event = Parse.Object.extend("Events");
  const event = new Event();
  event.id = eventId;

  const q = new Parse.Query("RegisteredEvents");
  q.equalTo("user", user);
  q.equalTo("event_id", event);
  return await q.first();
}

// --- Unregister ---
export async function unregisterForEvent(eventId) {
  const reg = await getRegistrationForEvent(eventId);
  if (!reg) return false;

  await reg.destroy();
  return true;
}

/**
 * Return an array of event ids the current user is registered for.
 */
export async function getRegisteredEventIdsForCurrentUser() {
  const user = Parse.User.current();
  if (!user) return [];

  const q = new Parse.Query("RegisteredEvents");
  q.equalTo("user", user);
  q.include("event_id");
  const rows = await q.find();
  return rows
    .map((r) => {
      const evt = r.get("event_id");
      return evt ? evt.id : null;
    })
    .filter(Boolean);
}
