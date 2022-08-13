import { userID01, users } from "../../../../data/data.js";
import { sutPath } from "../../../../data/env.js";
import { prepareTestDatabase } from "../../../../functions/prepare-test-database.js";
import { endConnections } from "../../../../functions/end-connections.js";

const { db, kv } = await import(`${sutPath}/build/persistence/persistence.js`);

const { readUsers, updateUser } = await import(
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

describe("update user", () => {
  test("an existing user is updated", async () => {
    // given
    const newUserUsername = "lorena";

    const expectedUser = expect.objectContaining({
      username: newUserUsername,
      userID: userID01,
    });

    const expectedUserCount = users.length;

    // when
    const updatedUser = await updateUser({
      data: { username: newUserUsername, userID: userID01 },
    });
    const actualUserCount = (await readUsers()).length;

    // then
    expect(updatedUser).toEqual(expectedUser);
    expect(actualUserCount).toEqual(expectedUserCount);
  });
});
