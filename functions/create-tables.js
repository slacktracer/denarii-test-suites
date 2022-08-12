import { db, loadQuery } from "../../src/persistence/persistence.js";

const createTablesQuery = loadQuery({
  base: import.meta.url,
  url: "../../src/persistence/create-tables.sql",
});

export const createTables = () => db.query(createTablesQuery);
