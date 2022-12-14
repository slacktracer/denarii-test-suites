import { jest } from "@jest/globals";

import { groupID02, groups, userID01 } from "../../../../data/data.js";
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

const { deleteGroup, readGroups } = await import(
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

describe("delete group", () => {
  test("an existing group is deleted", async () => {
    // given
    const expectedGroupCount =
      groups.filter((group) => group.userID === userID01).length - 1;

    // when
    await deleteGroup({ groupID: groupID02, userID: userID01 });
    const actualGroupCount = (await readGroups({ userID: userID01 })).length;

    // then
    expect(actualGroupCount).toEqual(expectedGroupCount);
  });
});
