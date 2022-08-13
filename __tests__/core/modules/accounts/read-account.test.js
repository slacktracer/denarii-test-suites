import { account01, accountID01, userID01 } from "../../../../data/data.js";
import { sutPath } from "../../../../data/env.js";
import { prepareTestDatabase } from "../../../../functions/prepare-test-database.js";
import { endConnections } from "../../../../functions/end-connections.js";

const { db, kv } = await import(`${sutPath}/build/persistence/persistence.js`);

const { readAccount } = await import(
  `${sutPath}/build/core/modules/accounts/accounts.js`
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

describe("read account", () => {
  test("an existing account is returned", async () => {
    // given
    const expectedAccount = expect.objectContaining({
      ...account01,
    });

    // when
    const actualAccount = await readAccount({
      accountID: accountID01,
      userID: userID01,
    });

    // then
    expect(actualAccount).toEqual(expectedAccount);
  });
});
