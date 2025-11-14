import Parse from "./parse";

export const fetchClubs = async () => {
  const Club = Parse.Object.extend("Clubs");
  const query = new Parse.Query(Club);
  return await query.find();
};
