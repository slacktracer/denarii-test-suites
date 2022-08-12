import { groupID02, groups, userID01 } from "../../../data/data.js";
import { sutPath } from "../../../data/env.js";
import { prepareTestDatabase } from "../../../functions/prepare-test-database.js";
import { endConnections } from "../../../functions/end-connections.js";

const { db, kv } = await import(`${sutPath}/build/persistence/persistence.js`);

const { deleteGroup, readGroups } = await import(
  `${sutPath}/build/core/modules/groups/groups.js`
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
