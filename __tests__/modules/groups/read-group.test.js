import { group01, groupID01, userID01 } from "../../../data/data.js";
import { sutPath } from "../../../data/env.js";
import { prepareTestDatabase } from "../../../functions/prepare-test-database.js";
import { endConnections } from "../../../functions/end-connections.js";

const { db, kv } = await import(`${sutPath}/build/persistence/persistence.js`);

const { readGroup } = await import(
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

describe("read group", () => {
  test("an existing group is returned", async () => {
    // given
    const expectedGroup = expect.objectContaining({
      ...group01,
    });

    // when
    const actualGroup = await readGroup({
      groupID: groupID01,
      userID: userID01,
    });

    // then
    expect(actualGroup).toEqual(expectedGroup);
  });
});
