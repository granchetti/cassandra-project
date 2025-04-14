import { Client } from "cassandra-driver";
import { v4 as uuidv4 } from "uuid";

const client = new Client({
  contactPoints: ["cassandra"],
  localDataCenter: "datacenter1",
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function initializeCassandra(): Promise<void> {
  await delay(10000);

  const createKeyspaceQuery = `
    CREATE KEYSPACE IF NOT EXISTS my_keyspace
    WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}
    AND durable_writes = true;
  `;
  await client.execute(createKeyspaceQuery);

  client.keyspace = "my_keyspace";

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      user_id uuid,
      name text,
      age int,
      PRIMARY KEY (user_id)
    );
  `;
  await client.execute(createTableQuery);

  console.log("Keyspace y tabla 'users' inicializados.");
}

export async function createUser(name: string, age: number): Promise<string> {
  const userId = uuidv4();
  const query = "INSERT INTO users (user_id, name, age) VALUES (?, ?, ?)";
  await client.execute(query, [userId, name, age], { prepare: true });
  return userId;
}

export async function getUser(userId: string): Promise<any> {
  const query = "SELECT user_id, name, age FROM users WHERE user_id = ?";
  const result = await client.execute(query, [userId], { prepare: true });
  return result.rows[0];
}

export async function updateUser(
  userId: string,
  newName: string,
  newAge: number
): Promise<void> {
  const query = "UPDATE users SET name = ?, age = ? WHERE user_id = ?";
  await client.execute(query, [newName, newAge, userId], { prepare: true });
}

export async function deleteUser(userId: string): Promise<void> {
  const query = "DELETE FROM users WHERE user_id = ?";
  await client.execute(query, [userId], { prepare: true });
}

async function main() {
  try {
    await initializeCassandra();

    const newUserId = await createUser("Alice", 30);
    console.log(`Usuario creado con ID: ${newUserId}`);

    let user = await getUser(newUserId);
    console.log("Usuario leído:", user);

    await updateUser(newUserId, "Alice Actualizada", 31);
    user = await getUser(newUserId);
    console.log("Usuario actualizado:", user);

    await deleteUser(newUserId);
    user = await getUser(newUserId);
    console.log("Usuario eliminado (debe ser undefined):", user);
  } catch (error) {
    console.error("Error en operaciones CRUD:", error);
  } finally {
    await client.shutdown();
  }
}

main();
