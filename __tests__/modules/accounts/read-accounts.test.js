import { accounts, userID01 } from "../../../data/data.js";
import { sutPath } from "../../../data/env.js";
import { prepareTestDatabase } from "../../../functions/prepare-test-database.js";
import { endConnections } from "../../../functions/end-connections.js";

const { db, kv } = await import(`${sutPath}/build/persistence/persistence.js`);

const { readAccounts } = await import(
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

describe("read accounts", () => {
  test("all existing accounts for the given user are returned", async () => {
    // given
    const expectedAccountCount = accounts.filter(
      (account) => account.userID === userID01,
    ).length;

    // when
    const actualAccounts = await readAccounts({ userID: userID01 });

    // then
    expect(actualAccounts.length).toEqual(expectedAccountCount);
  });
});
