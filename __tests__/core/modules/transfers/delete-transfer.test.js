import { jest } from "@jest/globals";

import { transfers, transferID04, userID01 } from "../../../../data/data.js";
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

const { deleteTransfer, readTransfers } = await import(
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

describe("delete transfer", () => {
  test("an existing transfer is deleted", async () => {
    // given
    const expectedTransferCount =
      transfers.filter((transfer) => transfer.userID === userID01).length - 1;

    // when
    await deleteTransfer({ transferID: transferID04, userID: userID01 });
    const actualTransferCount = (await readTransfers({ userID: userID01 }))
      .length;

    // then
    expect(actualTransferCount).toEqual(expectedTransferCount);
  });
});
