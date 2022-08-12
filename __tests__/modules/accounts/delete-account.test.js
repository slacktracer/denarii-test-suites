import { accounts, accountID05, userID01 } from "../../../data/data.js";
import { sutPath } from "../../../data/env.js";
import { prepareTestDatabase } from "../../../functions/prepare-test-database.js";
import { endConnections } from "../../../functions/end-connections.js";

const { db, kv } = await import(`${sutPath}/build/persistence/persistence.js`);

const { deleteAccount, readAccounts } = await import(
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

describe("delete account", () => {
  test("an existing account is deleted", async () => {
    // given
    const expectedAccountCount =
      accounts.filter((account) => account.userID === userID01).length - 1;

    // when
    await deleteAccount({ accountID: accountID05, userID: userID01 });
    const actualAccountCount = (await readAccounts({ userID: userID01 }))
      .length;

    // then
    expect(actualAccountCount).toEqual(expectedAccountCount);
  });
});
