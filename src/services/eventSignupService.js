import Parse from "./parse";

/**
 * Register the currently logged-in user for an event.
 * Saves a pointer to the user and a pointer to the event in the
 * `RegisteredEvents` class (create this class in Back4App with
 * `user` (Pointer<_User>) and `event` (Pointer<Events>) columns).
 *
 * Throws if the user is not logged in or if the save fails.
 */
export async function registerForEvent(eventId) {
  const currentUser = Parse.User.current();
  if (!currentUser) {
    throw new Error("User must be logged in to register for events");
  }
  // Create a pointer to the existing Events object by id
  const Event = Parse.Object.extend("Events");
  const eventPointer = new Event();
  eventPointer.id = eventId;

  // Duplicate-check: ensure the same user hasn't already registered
  try {
    const q = new Parse.Query("RegisteredEvents");
    q.equalTo("user", currentUser);
    // RegisteredEvents uses the column 'event_id' as a pointer to Events
    q.equalTo("event_id", eventPointer);
    const existing = await q.first();
    if (existing) {
      // already registered — return existing registration
      return existing;
    }
  } catch (err) {
    // If the query fails for any reason, log but continue to attempt save
    console.warn("registerForEvent: duplicate-check failed", err);
  }

  const Registered = Parse.Object.extend("RegisteredEvents");
  const registration = new Registered();
  registration.set("user", currentUser);
  // Save the pointer in the 'event_id' column
  registration.set("event_id", eventPointer);

  // Set ACL so only the registering user can read/write this registration
  try {
    const acl = new Parse.ACL(currentUser);
    registration.setACL(acl);
  } catch (aclErr) {
    console.warn("registerForEvent: failed to set ACL", aclErr);
  }

  try {
    const saved = await registration.save();
    return saved;
  } catch (err) {
    const message = err?.message || String(err);
    throw new Error(message);
  }
}

export default { registerForEvent };

/**
 * Return the RegisteredEvents object for the current user and event, or null.
 */
export async function getRegistrationForEvent(eventId) {
  const currentUser = Parse.User.current();
  if (!currentUser) return null;

  const Event = Parse.Object.extend("Events");
  const eventPointer = new Event();
  eventPointer.id = eventId;

  const q = new Parse.Query("RegisteredEvents");
  q.equalTo("user", currentUser);
  q.equalTo("event_id", eventPointer);
  const existing = await q.first();
  return existing || null;
}

/**
 * Unregister the current user from an event (delete the RegisteredEvents row).
 * Returns true if an object was deleted, false if none existed.
 */
export async function unregisterForEvent(eventId) {
  const existing = await getRegistrationForEvent(eventId);
  if (!existing) return false;
  try {
    await existing.destroy();
    return true;
  } catch (err) {
    const message = err?.message || String(err);
    throw new Error(message);
  }
}
