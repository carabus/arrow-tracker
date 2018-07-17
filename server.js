const express = require("express");
const app = express();

const cors = require("cors");
const { CLIENT_ORIGIN } = require("./config");

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

const PORT = process.env.PORT || 3000;

app.get("/api/*", (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = { app };
