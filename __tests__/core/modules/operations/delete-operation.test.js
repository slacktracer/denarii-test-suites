import { jest } from "@jest/globals";

import { operationID02, operations, userID01 } from "../../../../data/data.js";
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

const { deleteOperation, readOperations } = await import(
  `${sutPath}/core/modules/operations/operations.js`
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

describe("delete operation", () => {
  test("an existing operation is deleted", async () => {
    // given
    const expectedOperationCount =
      operations.filter((operation) => operation.userID === userID01).length -
      1;

    // when
    await deleteOperation({ operationID: operationID02, userID: userID01 });
    const actualOperationCount = (await readOperations({ userID: userID01 }))
      .length;

    // then
    expect(actualOperationCount).toEqual(expectedOperationCount);
  });
});
