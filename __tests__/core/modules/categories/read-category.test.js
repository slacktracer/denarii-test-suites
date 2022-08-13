import { category01, categoryID01, userID01 } from "../../../../data/data.js";
import { sutPath } from "../../../../data/env.js";
import { prepareTestDatabase } from "../../../../functions/prepare-test-database.js";
import { endConnections } from "../../../../functions/end-connections.js";

const { db, kv } = await import(`${sutPath}/build/persistence/persistence.js`);

const { readCategory } = await import(
  `${sutPath}/build/core/modules/categories/categories.js`
);

let backup;

afterAll(async () => {
  await endConnections({ db, kv });
});

beforeAll(async () => {
  backup = await prepareTestDatabase();
});

beforeEach(async () => {
  backup.restore();
});

describe("read category", () => {
  test("an existing category is returned", async () => {
    // given
    const expectedCategory = expect.objectContaining({
      ...category01,
    });

    // when
    const actualCategory = await readCategory({
      categoryID: categoryID01,
      userID: userID01,
    });

    // then
    expect(actualCategory).toEqual(expectedCategory);
  });
});
