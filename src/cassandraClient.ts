import { Client } from "cassandra-driver";

export const client = new Client({
  contactPoints: ["cassandra"],
  localDataCenter: "datacenter1",
});

async function waitForCassandra(maxRetries = 40, delayMs = 3000): Promise<void> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await client.connect();
      console.log("✅ Conectado a Cassandra");
      return;
    } catch (err) {
      console.log(`⏳ Esperando Cassandra... intento ${i + 1}/${maxRetries}`);
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
  throw new Error("❌ No se pudo conectar a Cassandra después de varios intentos");
}

export async function initializeCassandra(): Promise<void> {
  await waitForCassandra();

  // Crear el keyspace si no existe
  await client.execute(`
    CREATE KEYSPACE IF NOT EXISTS my_keyspace
    WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};
  `);

  // Establecer el keyspace
  client.keyspace = "my_keyspace";

  // Crear la tabla 'users' si no existe
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      user_id uuid PRIMARY KEY,
      username text,
      name text,
      age int
    );
  `);

  console.log("✅ Keyspace y tabla 'users' inicializados.");
}
