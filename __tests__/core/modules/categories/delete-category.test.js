import { categories, categoryID04, userID01 } from "../../../../data/data.js";
import { sutPath } from "../../../../data/env.js";
import { prepareTestDatabase } from "../../../../functions/prepare-test-database.js";
import { endConnections } from "../../../../functions/end-connections.js";

const { db, kv } = await import(`${sutPath}/build/persistence/persistence.js`);

const { deleteCategory, readCategories } = await import(
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

describe("delete category", () => {
  test("an existing category is deleted", async () => {
    // given
    const expectedCategoryCount =
      categories.filter((category) => category.userID === userID01).length - 1;

    // when
    await deleteCategory({ categoryID: categoryID04, userID: userID01 });
    const actualCategoryCount = (await readCategories({ userID: userID01 }))
      .length;

    // then
    expect(actualCategoryCount).toEqual(expectedCategoryCount);
  });
});
