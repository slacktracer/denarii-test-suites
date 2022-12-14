import { jest } from "@jest/globals";

import { transfer01, transferID01, userID01 } from "../../../../data/data.js";
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

const { readTransfer } = await import(
  `${sutPath}/core/modules/transfers/transfers.js`
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

describe("read transfer", () => {
  test("an existing transfer is returned", async () => {
    // given
    const expectedTransfer = expect.objectContaining({
      ...transfer01,
      at: new Date(transfer01.at),
    });

    // when
    const actualTransfer = await readTransfer({
      transferID: transferID01,
      userID: userID01,
    });

    // then
    expect(actualTransfer).toEqual(expectedTransfer);
  });
});
