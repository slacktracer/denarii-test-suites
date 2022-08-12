import { groupID01, groups, userID01 } from "../../../data/data.js";
import { sutPath } from "../../../data/env.js";
import { prepareTestDatabase } from "../../../functions/prepare-test-database.js";
import { endConnections } from "../../../functions/end-connections.js";

const { db, kv } = await import(`${sutPath}/build/persistence/persistence.js`);

const { readGroups, updateGroup } = await import(
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

describe("update group", () => {
  test("an existing group is updated", async () => {
    // given
    const newGroupName = "New Group Name!";

    const expectedGroup = expect.objectContaining({
      groupID: groupID01,
      name: newGroupName,
      userID: userID01,
    });

    const expectedGroupCount = groups.filter(
      (group) => group.userID === userID01,
    ).length;

    // when
    const updatedGroup = await updateGroup({
      groupID: groupID01,
      data: { name: newGroupName },
      userID: userID01,
    });

    const actualGroupCount = (await readGroups({ userID: userID01 })).length;

    // then
    expect(updatedGroup).toEqual(expectedGroup);
    expect(actualGroupCount).toEqual(expectedGroupCount);
  });
});
