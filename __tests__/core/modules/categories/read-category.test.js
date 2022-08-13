import { jest } from "@jest/globals";

import { category01, categoryID01, userID01 } from "../../../../data/data.js";
import { sutPath } from "../../../../data/env.js";
import { endConnections } from "../../../../functions/end-connections.js";

import * as mockPersistence from "../../../../mocks/persistence.js";

jest.unstable_mockModule(
  `${sutPath}/persistence/persistence.js`,
  () => mockPersistence,
);

const { prepareTestDatabase } = await import(
  "../../../../functions/prepare-test-database.js"
);

const { db, kv } = await import(`${sutPath}/persistence/persistence.js`);

const { readCategory } = await import(
  `${sutPath}/core/modules/categories/categories.js`
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
