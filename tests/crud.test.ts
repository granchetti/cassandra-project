import { v4 as uuid } from "uuid";
import {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../src/index";
import { initializeCassandra, client } from "../src/cassandraClient";

describe("Repositorio – tabla users", () => {
  const username = `user_${uuid()}`;
  let userId: string;

  beforeAll(async () => {
    await initializeCassandra();
    userId = await createUser(username, "Alice", 20);
  }, 60_000);

  afterAll(async () => {
    await client.shutdown();
  });

  it("createUser devuelve un UUID válido", () => {
    expect(userId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });

  it("createUser lanza error si el username ya existe", async () => {
    await expect(createUser(username, "Bob", 30)).rejects.toThrow(/ya existe/);
  });

  it("getUser recupera el usuario insertado", async () => {
    const u = await getUser(userId);
    expect(u).toMatchObject({
      user_id: userId,
      username,
      name: "Alice",
      age: 20,
    });
  });

  it("getUser devuelve undefined si no encuentra", async () => {
    const ghost = await getUser(uuid());
    expect(ghost).toBeUndefined();
  });


  it("getAllUsers devuelve un array con el usuario presente", async () => {
    const otherId = await createUser(`other_${uuid()}`, "Charlie", 40);

    const list = await getAllUsers();

    expect(list.length).toBeGreaterThanOrEqual(2);

    const ids = list.map((u) => u.user_id);
    expect(ids).toEqual(expect.arrayContaining([userId, otherId]));
  });

  it("updateUser modifica nombre y edad", async () => {
    await updateUser(userId, "Alice Plus", 21);
    const updated = await getUser(userId);
    expect(updated).toMatchObject({ name: "Alice Plus", age: 21 });
  });

  it("deleteUser borra el registro", async () => {
    await deleteUser(userId);
    const gone = await getUser(userId);
    expect(gone).toBeUndefined();
  });
});
