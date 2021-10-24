const express = require("express");
const path = require("path");
const cookieSession = require("cookie-session");
const createError = require("http-errors");
const bodyParser = require("body-parser");

const FeedbackService = require("./services/FeedbackService");
const SpeakerService = require("./services/SpeakerService");

const routes = require("./routes");

const feedbackService = new FeedbackService("./data/feedback.json");
const speakerService = new SpeakerService("./data/speakers.json");

const app = express();

const port = 3000;

app.set("trust proxy", 1);

app.use(
  cookieSession({
    name: "session",
    keys: ["savsaasdgasfd", "sadfacvaer"],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

app.use(express.static(path.join(__dirname, "static")));

app.use(async (request, response, next) => {
  try {
    const names = await speakerService.getNames();
    response.locals.speakerNames = names;
    return next();
  } catch (err) {
    return next(err);
  }
});

app.locals.siteName = "ROUX Meetups";

app.use((request, response, next) => {
  response.locals.someVariable = "hello";
  return next();
});

app.use("/", routes({ feedbackService, speakerService }));

app.use((req, res, next) => {
  next(createError(404, "File not found"));
});

app.use((err, req, res, next) => {
  try {
    res.locals.message = err.message;
    console.error(err);
    const status = err.status || 500;
    res.locals.status = status;
    res.status(status);
    res.render("error");
  } catch {
    next();
  }
});

app.listen(port, () => {
  console.log(`Express server listening on http://127.0.0.1:${port}`);
});
