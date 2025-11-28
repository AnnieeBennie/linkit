import Parse from "./parse";

// Small helper to create an event pointer
function eventPointer(id) {
  const Event = Parse.Object.extend("Events");
  const e = new Event();
  e.id = id;
  return e;
}

// --- Register user for an event ---
export async function registerForEvent(eventId) {
  const user = Parse.User.current();
  if (!user) throw new Error("You must be logged in.");

  const event = eventPointer(eventId);

  // Check if already registered
  const q = new Parse.Query("RegisteredEvents");
  q.equalTo("user", user);
  q.equalTo("event_id", event);
  const existing = await q.first();
  if (existing) return existing;

  // Create registration
  const Registered = Parse.Object.extend("RegisteredEvents");
  const reg = new Registered();
  reg.set("user", user);
  reg.set("event_id", event);

  // Only user can see/edit this row
  reg.setACL(new Parse.ACL(user));

  return reg.save();
}

// --- Check if user registered ---
export async function getRegistrationForEvent(eventId) {
  const user = Parse.User.current();
  if (!user) return null;

  const q = new Parse.Query("RegisteredEvents");
  q.equalTo("user", user);
  q.equalTo("event_id", eventPointer(eventId));
  return q.first();
}

// --- Unregister user ---
export async function unregisterForEvent(eventId) {
  const reg = await getRegistrationForEvent(eventId);
  if (!reg) return false;
  await reg.destroy();
  return true;
}

// --- Get all eventIds user is registered for ---
export async function getRegisteredEventIdsForCurrentUser() {
  const user = Parse.User.current();
  if (!user) return [];

  const q = new Parse.Query("RegisteredEvents");
  q.equalTo("user", user);
  q.include("event_id");
  const rows = await q.find();

  return rows.map((r) => r.get("event_id")?.id).filter(Boolean);
}
