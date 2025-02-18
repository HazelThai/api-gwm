require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
// const routes = require("./routes");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const db = require("./config/db");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const config = require("./config/config");
db();
const app = express();
const port = config.port;

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation for my application",
    },
    servers: [
      {
        url: `https://api-mbbc.onrender.com`,
      },
    ],
  },
  apis: ["./Controllers/*.js"],
};

app.listen(port, () => {
  console.log(`Server chạy trên http://localhost:${port}`);
});
