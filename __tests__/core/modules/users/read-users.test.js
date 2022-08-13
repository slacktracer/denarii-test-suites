import { users } from "../../../../data/data.js";
import { sutPath } from "../../../../data/env.js";
import { prepareTestDatabase } from "../../../../functions/prepare-test-database.js";
import { endConnections } from "../../../../functions/end-connections.js";

const { db, kv } = await import(`${sutPath}/build/persistence/persistence.js`);

const { readUsers } = await import(
  `${sutPath}/build/core/modules/users/users.js`
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

describe("read users", () => {
  it("returns all users", async () => {
    // given
    const expectedUserCount = users.length;

    // when
    const actualUserCount = (await readUsers()).length;

    // then
    expect(actualUserCount).toEqual(expectedUserCount);
  });
});
