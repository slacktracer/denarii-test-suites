import { mockDataAsInsertStatements } from "../data/data.js";
import { sutPath } from "../data/env.js";

const { db, loadQuery, pgm } = await import(
  `${sutPath}/persistence/persistence.js`
);

const createTablesQuery = loadQuery({
  base: import.meta.url,
  url: `${sutPath}/persistence/create-tables.sql`,
});

export const prepareTestDatabase = async () => {
  await db.query(createTablesQuery);

  await db.query(mockDataAsInsertStatements);

  return pgm.backup();
};
