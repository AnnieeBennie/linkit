import Parse from "./parse";

// Create membership record
export async function joinClub(clubId) {
  const Membership = Parse.Object.extend("Membership");
  const m = new Membership();

  const user = Parse.User.current();
  m.set("user", user);

  const club = new Parse.Object("Clubs");
  club.id = clubId;
  m.set("Club", club);

  return await m.save();
}

// Delete membership record
export async function leaveClub(clubId) {
  const query = new Parse.Query("Membership");
  query.equalTo("user", Parse.User.current());

  const club = new Parse.Object("Clubs");
  club.id = clubId;
  query.equalTo("Club", club);

  //Find the membership entry
  const membership = await query.first();
  if (membership) {
    return membership.destroy();
  }
}

// Load all clubs the user is a member of
export async function loadJoinedClubs() {
  const query = new Parse.Query("Membership");
  query.equalTo("user", Parse.User.current());

  const results = await query.find();
  return results.map((m) => m.get("Club").id);
}