import { jest } from "@jest/globals";

import { transferID01, transfers, userID01 } from "../../../../data/data.js";
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

const { readTransfers, updateTransfer } = await import(
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

describe("update transfer", () => {
  test("an existing transfer is updated", async () => {
    // given
    const newAmount = 1_000_00;

    const expectedTransfer = expect.objectContaining({
      transferID: transferID01,
      amount: newAmount,
      userID: userID01,
    });

    const expectedTransferCount = transfers.filter(
      (transfer) => transfer.userID === userID01,
    ).length;

    // when
    const updatedTransfer = await updateTransfer({
      transferID: transferID01,
      data: { amount: newAmount },
      userID: userID01,
    });

    const actualTransferCount = (await readTransfers({ userID: userID01 }))
      .length;

    // then
    expect(updatedTransfer).toEqual(expectedTransfer);
    expect(actualTransferCount).toEqual(expectedTransferCount);
  });
});
