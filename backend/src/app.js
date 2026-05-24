const express = require("express");
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes");
const { checkDatabase } = require("./config/database");
const { ok, fail } = require("./utils/response");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  ok(res, {
    name: "益小助 API",
    status: "running",
    docs: "/api/health"
  });
});

app.get("/api/health", (req, res) => {
  ok(res, {
    service: "yixiaozhu-backend",
    time: new Date().toISOString()
  });
});

app.get("/api/health/db", async (req, res, next) => {
  try {
    const result = await checkDatabase();
    ok(res, {
      database: "mysql",
      connected: result.ok === 1
    });
  } catch (err) {
    next(err);
  }
});

app.use("/api", routes);

app.use((req, res) => {
  fail(res, 404, "接口不存在");
});

app.use((err, req, res, next) => {
  console.error(err);
  fail(res, 500, "服务器内部错误", {
    detail: process.env.NODE_ENV === "production" ? undefined : err.message
  });
});

app.listen(port, () => {
  console.log(`Yixiaozhu API server is running at http://localhost:${port}`);
});
