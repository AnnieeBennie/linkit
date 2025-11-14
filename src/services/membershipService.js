import Parse from "./parse";

// Create membership record
export async function joinClub(clubId) {
  const Membership = Parse.Object.extend("Membership");
  const m = new Membership();

  m.set("user", Parse.User.current());
  m.set("Club", {
    __type: "Pointer",
    className: "Clubs",
    objectId: clubId,
  });

  return await m.save();
}

// Delete membership record
export async function leaveClub(clubId) {
  const query = new Parse.Query("Membership");
  query.equalTo("user", Parse.User.current());
  query.equalTo("Club", {
    __type: "Pointer",
    className: "Clubs",
    objectId: clubId,
  });

  const membership = await query.first();
  if (membership) {
    return membership.destroy();
  }
}

// Load all clubs joined by current user
export async function loadJoinedClubs() {
  const query = new Parse.Query("Membership");
  query.equalTo("user", Parse.User.current());

  const results = await query.find();
  return results.map((m) => m.get("Club").id);
}