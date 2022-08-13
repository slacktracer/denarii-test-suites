import { users } from "../../../../data/data.js";
import { sutPath } from "../../../../data/env.js";
import { prepareTestDatabase } from "../../../../functions/prepare-test-database.js";
import { endConnections } from "../../../../functions/end-connections.js";

const { db, kv } = await import(`${sutPath}/build/persistence/persistence.js`);

const { createUser, readUsers } = await import(
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

describe("create user", () => {
  test("a new user is created", async () => {
    // given
    const email = "thiago@example.com";
    const password = "Password1234!";
    const username = "thiago";

    const data = { email, password, username };

    const expectedCreatedUser = expect.objectContaining({ email, username });
    const expectedUserCount = users.length + 1;

    // when
    const createdUser = await createUser({ data });
    const userCount = (await readUsers()).length;

    // then
    expect(createdUser).toEqual(expectedCreatedUser);
    expect(userCount).toEqual(expectedUserCount);
  });
});
