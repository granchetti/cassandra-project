import { client } from "./cassandraClient";
import { v4 as uuidv4 } from "uuid";

export async function createUser(
  username: string,
  name: string,
  age: number
): Promise<string> {
  const check = await client.execute(
    "SELECT * FROM users WHERE username = ?",
    [username],
    { prepare: true }
  );

  if (check.rowLength > 0) {
    throw new Error(`Usuario con username "${username}" ya existe.`);
  }

  const userId = uuidv4();
  const insert =
    "INSERT INTO users (username, user_id, name, age) VALUES (?, ?, ?, ?)";
  await client.execute(insert, [username, userId, name, age], {
    prepare: true,
  });

  return userId;
}

export async function getUser(userId: string) {
  const result = await client.execute(
    "SELECT user_id, username, name, age FROM users WHERE user_id = ?",
    [userId],
    { prepare: true }
  );
  return result.rows[0];
}

export async function getAllUsers() {
  const result = await client.execute(
    "SELECT user_id, username, name, age FROM users"
  );
  return result.rows;
}

export async function updateUser(
  userId: string,
  newName: string,
  newAge: number
) {
  await client.execute(
    "UPDATE users SET name = ?, age = ? WHERE user_id = ?",
    [newName, newAge, userId],
    { prepare: true }
  );
}

export async function deleteUser(userId: string) {
  await client.execute("DELETE FROM users WHERE user_id = ?", [userId], {
    prepare: true,
  });
}
