const express = require("express");
const applyMiddleWare = require("./middlewares/applyMiddleware");
const connectDB = require("./db/connectDB");
const seedInitialBlog = require("./utils/seedInitialBlog");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

const authenticationRoutes = require("./routes/authentication");

const districtsRoutes = require("./routes/districts");
const upuzilaRoutes = require("./routes/upuzilas");
const userRoutes = require("./routes/users/user");
const donationRoutes = require("./routes/DonationReqs");
const blogRoutes = require("./routes/blogs");
const fundRoutes = require('./routes/fund')
const statisticRoutes = require('./routes/statisticReport')
const messageRoutes = require('./routes/message')
const pushRoutes = require('./routes/push')
const reportRoutes = require('./routes/reports')


applyMiddleWare(app);

// On Vercel this file runs as a serverless function per request, so the DB
// connection can't be made once at boot like a normal always-on server.
// dbReady caches the connection promise so a warm (already-connected)
// invocation reuses it instead of reconnecting on every single request.
let dbReady = null;
const ensureDB = () => {
  if (!dbReady) {
    dbReady = connectDB().then(() => seedInitialBlog());
  }
  return dbReady;
};

if (process.env.VERCEL) {
  app.use((req, res, next) => {
    ensureDB().then(() => next()).catch(next);
  });
}

app.use(authenticationRoutes);
app.use(districtsRoutes);
app.use(upuzilaRoutes);
app.use(userRoutes);
app.use(donationRoutes);
app.use(blogRoutes);
app.use(fundRoutes);
app.use(statisticRoutes)
app.use(messageRoutes);
app.use(pushRoutes);
app.use(reportRoutes);

app.get("/health", (req, res) => {
  res.send("Blood Donation Server is Running");
});

app.all("*", (req, res, next) => {
  const error = new Error(`the requested url is invalid :[${req.err}]`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
  });
});

if (!process.env.VERCEL) {
  // Local dev / a traditional always-on server: connect once, then listen.
  const main = async () => {
    await connectDB();
    await seedInitialBlog();
    app.listen(port, () => {
      console.log(`Blood Donation Server running on this port: ${port}`);
    });
  };
  main();
}

// Vercel's @vercel/node runtime needs the Express app itself exported here —
// it wraps this export as the serverless function and calls it per-request.
// Without this line, Vercel has no valid handler to route requests to,
// which is what was causing the intermittent "404: NOT_FOUND" errors.
module.exports = app;
