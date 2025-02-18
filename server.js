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






app.listen(port, () => {
  console.log(`Server chạy trên http://localhost:${port}`);
});
