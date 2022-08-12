import "dotenv/config";

import { accounts, userID01 } from "../../../data/data.js";
import { sutPath } from "../../../data/env.js";
import { prepareTestDatabase } from "../../../functions/prepare-test-database.js";
import { endConnections } from "../../../functions/end-connections.js";

const { db, kv } = await import(`${sutPath}/build/persistence/persistence.js`);

const { createAccount, readAccounts } = await import(
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

describe("create account", () => {
  test("a new account is created", async () => {
    // given
    const initialAmount = 0;
    const name = "Account!";

    const accountData = { initialAmount, name, userID: userID01 };

    const expectedCreatedAccount = expect.objectContaining({
      initialAmount,
      name,
      userID: userID01,
    });

    const expectedAccountCount = accounts.length + 1;

    // when
    const createdAccount = await createAccount({
      data: accountData,
      userID: userID01,
    });

    const actualAccountCount = (await readAccounts({ userID: userID01 }))
      .length;

    // then
    expect(createdAccount).toEqual(expectedCreatedAccount);
    expect(actualAccountCount).toEqual(expectedAccountCount);
  });
});
