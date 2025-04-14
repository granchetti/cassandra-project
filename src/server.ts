import express from "express";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import routes from "./routes";
import { initializeCassandra } from "./cassandraClient";
import { JsonObject } from "swagger-ui-express";

const app = express();
app.use(express.json());

const swaggerFile = path.join(__dirname, "swagger.yaml");
const swaggerDocument = fs.readFileSync(swaggerFile, "utf8");
const swaggerSpec = yaml.load(swaggerDocument) as JsonObject;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/", routes);

const port = process.env.PORT || 3000;

initializeCassandra()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Servidor en http://localhost:${port}`);
      console.log(`📄 Swagger en http://localhost:${port}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("❌ Error inicializando Cassandra:", err);
  });
