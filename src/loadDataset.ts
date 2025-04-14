import fs from "fs";
import path from "path";
import { client, initializeCassandra } from "./cassandraClient";
import { createUser } from "./index";

async function seed() {
    const dataPath = path.join(process.cwd(), "data", "datasetUsers.json");

  try {
    await initializeCassandra();
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    for (const record of data) {
      await createUser(record.username, record.name, record.age);
    }

    console.log("🎉 Dataset insertado correctamente.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error al insertar el dataset:", err);
    process.exit(1);
  } finally {
    await client.shutdown();
  }
}

seed();
