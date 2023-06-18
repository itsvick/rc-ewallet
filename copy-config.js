require("dotenv").config();

const fs = require("fs");
const fileName = "./src/assets/config/config.json";

fs.readFile(fileName, (err, data) => {
  if (err) {
    console.log(error);
    return;
  }

  const parsedData = JSON.parse(data);

  parsedData.keycloak.url = process.env.KEYCLOAK_URL;
  parsedData.keycloak.clientId = process.env.KEYCLOAK_CLIENT_ID;
  parsedData.keycloak.realm = process.env.KEYCLOAK_realm;
  parsedData.baseUrl = process.env.BASE_URL;
  parsedData.bffUrl = process.env.BFF_URL;
  parsedData.schemaUrl = process.env.SCHEMA_URL;

  fs.writeFile(fileName, JSON.stringify(parsedData, null, 2), (err) => {
    if (err) {
      console.log("Failed to write updated data to file");
      return;
    }
    console.log("Updated file successfully");
  });
});
