import { jest } from "@jest/globals";

import { userID01, users } from "../../../../data/data.js";
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

const { readUsers, updateUser } = await import(
  `${sutPath}/core/modules/users/users.js`
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
