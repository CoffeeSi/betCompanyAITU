const express = require("express");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const blogsRouter = require("./routes/blogs");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/blogs", blogsRouter);

// Swagger UI (OpenAPI)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Serve frontend UI
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
