import { jest } from "@jest/globals";

import { accounts, userID01 } from "../../../../data/data.js";
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

const { createAccount, readAccounts } = await import(
  `${sutPath}/core/modules/accounts/accounts.js`
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
