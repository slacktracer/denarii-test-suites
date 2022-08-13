import { categories, categoryID01, userID01 } from "../../../../data/data.js";
import { sutPath } from "../../../../data/env.js";
import { prepareTestDatabase } from "../../../../functions/prepare-test-database.js";
import { endConnections } from "../../../../functions/end-connections.js";

const { db, kv } = await import(`${sutPath}/build/persistence/persistence.js`);

const { readCategories, updateCategory } = await import(
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

describe("update category", () => {
  test("an existing category is updated", async () => {
    // given
    const newCategoryName = "New Category Name!";

    const expectedCategory = expect.objectContaining({
      categoryID: categoryID01,
      name: newCategoryName,
      userID: userID01,
    });

    const expectedCategoryCount = categories.filter(
      (category) => category.userID === userID01,
    ).length;

    // when
    const updatedCategory = await updateCategory({
      categoryID: categoryID01,
      data: { name: newCategoryName },
      userID: userID01,
    });

    const actualCategoryCount = (await readCategories({ userID: userID01 }))
      .length;

    // then
    expect(updatedCategory).toEqual(expectedCategory);
    expect(actualCategoryCount).toEqual(expectedCategoryCount);
  });
});
