import { Client } from "cassandra-driver";

const contactPoint = process.env.CONTACT_POINT || "cassandra";

export const client = new Client({
  contactPoints: [contactPoint],
  localDataCenter: "datacenter1",
});

async function waitForCassandra(
  maxRetries = 40,
  delayMs = 3000,
): Promise<void> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await client.connect();
      console.log("✅ Conectado a Cassandra");
      return;
    } catch {
      console.log(`⏳ Esperando Cassandra... intento ${i + 1}/${maxRetries}`);
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
  throw new Error("❌ No se pudo conectar a Cassandra después de varios intentos");
}

export async function initializeCassandra(): Promise<void> {
  await waitForCassandra();

  await client.execute(`
    CREATE KEYSPACE IF NOT EXISTS my_keyspace
    WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};
  `);

  client.keyspace = "my_keyspace";

  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      user_id  uuid PRIMARY KEY,
      username text,
      name     text,
      age      int
    );
  `);

  console.log("✅ Keyspace y tabla 'users' inicializados.");
}
