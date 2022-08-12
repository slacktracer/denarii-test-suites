import {
  accountID01,
  categoryID01,
  groupID01,
  operations,
  userID01,
} from "../../../data/data.js";
import { sutPath } from "../../../data/env.js";
import { prepareTestDatabase } from "../../../functions/prepare-test-database.js";
import { endConnections } from "../../../functions/end-connections.js";

const { db, kv } = await import(`${sutPath}/build/persistence/persistence.js`);

const { createOperation, readOperations } = await import(
  `${sutPath}/build/core/modules/operations/operations.js`
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

describe("create operation", () => {
  test("a new operation is created", async () => {
    // given
    const amount = 1;
    const amountPerUnit = 100;
    const comments = "";
    const type = "Expense";
    const unitCount = 1;

    const data = {
      accountID: accountID01,
      amount,
      amountPerUnit,
      categoryID: categoryID01,
      comments,
      groupID: groupID01,
      type,
      unitCount,
    };

    const expectedCreatedOperation = expect.objectContaining({
      accountID: accountID01,
      amount,
      amountPerUnit,
      categoryID: categoryID01,
      comments,
      groupID: groupID01,
      type,
      unitCount,
      userID: userID01,
    });

    const expectedOperationCount = operations.length + 1;

    // when
    const createdOperation = await createOperation({ data, userID: userID01 });

    const actualOperationCount = (await readOperations({ userID: userID01 }))
      .length;

    // then
    expect(createdOperation).toEqual(expectedCreatedOperation);
    expect(actualOperationCount).toEqual(expectedOperationCount);
  });
});
