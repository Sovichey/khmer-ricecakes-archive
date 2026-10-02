// The column in the "entries" table that links a row to the auth user who
// owns it. It is written from the logged-in session on create and used to gate
// edit and delete.
export const OWNER_COLUMN = "owner";