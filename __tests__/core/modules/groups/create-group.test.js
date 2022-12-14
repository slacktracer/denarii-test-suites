import { jest } from "@jest/globals";

import { groups, userID01 } from "../../../../data/data.js";
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

const { createGroup, readGroups } = await import(
  `${sutPath}/core/modules/groups/groups.js`
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

describe("create group", () => {
  test("a new group is created", async () => {
    // given
    const name = "Group!";

    const groupData = { name, userID: userID01 };

    const expectedCreatedGroup = expect.objectContaining({
      name,
      userID: userID01,
    });

    const expectedGroupCount = groups.length + 1;

    // when
    const createdGroup = await createGroup({
      data: groupData,
      userID: userID01,
    });
    const actualGroupCount = (await readGroups({ userID: userID01 })).length;

    // then
    expect(createdGroup).toEqual(expectedCreatedGroup);
    expect(actualGroupCount).toEqual(expectedGroupCount);
  });
});
