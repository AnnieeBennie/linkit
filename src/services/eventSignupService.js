import Parse from "./parse";

/* ---------------------- HELPER FUNCTIONS ---------------------- */

// Small helper to create an event pointer
function eventPointer(id) {
  const Event = Parse.Object.extend("Events");
  const e = new Event();
  e.id = id;
  return e;
}

function createRegistration(user, event) {
  const Registered = Parse.Object.extend("RegisteredEvents");
  const reg = new Registered();
  reg.set("user", user);
  reg.set("event_id", event);

  const acl = new Parse.ACL();
  acl.setPublicReadAccess(true);
  acl.setWriteAccess(user, true);
  reg.setACL(acl);

  return reg;
}

function extractEventIds(rows) {
  return rows
    .map((r) => {
      const evt = r.get("event_id");
      return evt ? evt.id : null;
    })
    .filter(Boolean);
}

/* ---------------------- PUBLIC API ---------------------- */

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
  const reg = createRegistration(user, event);
  return reg.save();
}

export async function getRegistrationForEvent(eventId) {
  const user = Parse.User.current();
  if (!user) return null;

  const q = new Parse.Query("RegisteredEvents");
  q.equalTo("user", user);
  q.equalTo("event_id", eventPointer(eventId));
  return q.first();
}

export async function unregisterForEvent(eventId) {
  const reg = await getRegistrationForEvent(eventId);
  if (!reg) return false;

  await reg.destroy();
  return true;
}

export async function getRegisteredEventIdsForCurrentUser() {
  const user = Parse.User.current();
  if (!user) return [];

  const q = new Parse.Query("RegisteredEvents");
  q.equalTo("user", user);
  q.include("event_id");
  const rows = await q.find();

  return extractEventIds(rows);
}

export async function getRegistrationCountForEvent(eventId) {
  const q = new Parse.Query("RegisteredEvents");
  q.equalTo("event_id", eventPointer(eventId));
  return q.count();
}
