const express = require("express");
const cors = require("cors");
const logger = require("morgan");
require("dotenv").config();
require("express-async-errors");
// const multer = require("multer");
require("./models/index.js");
const { fallBack, errorHandler } = require("./middlewares/error.middleware");
const router = require("./routes/index.js");
const { responseHandler } = require("./middlewares/response.middleware.js");
// const engines = require("consolidate");
const app = express();

/**Start Using Middlewares */
/**Parse requests of content-type: application/json*/
app.use(express.json({ extended: true, limit: "50mb" }));
/**Parse requests of content-type: application/x-www-form-urlencoded*/
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
/**Allow cross origin access*/
app.use(
    cors({
        origin: '*',
        credentials: true,
    })
);
/**Node Request Logger */
app.use(logger("dev"));
/**End Using Middlewares */

app.use(responseHandler);
/**Main application router*/
app.use(router)

// For static assets
app.use("/public", express.static(__dirname + "/public"));

//For EJS views
// app.engine("ejs", engines.ejs);
// app.set("views", "./public/views");
// app.set("view engine", "ejs");


/**If Route Not Exits Then Show Message */
app.use(fallBack);
/**For Catching and Handling Default Errors */
app.use(errorHandler);

module.exports = app;
