const express = require("express");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const AWS = require("aws-sdk");
const router = require("./router");
const swaggerDocument = require("./swagger.json");
AWS.config.update({ region: "us-east-2" });

var sqs = new AWS.SQS({ apiVersion: "2012-11-05" });
var params = {
  QueueName: "notifications-queue",
  Attributes: {
    DelaySeconds: "60",
    MessageRetentionPeriod: "86400",
  },
};

const PORT_NUMBER = 3000;

console.log("Starting SMS component");

app.use(cors());
// Fire up healthcheck endpoint
app.use(bodyParser.json());

// Swagger
router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.get("/health", (req, res) => {
  sqs.createQueue(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data.QueueUrl);
    }
  });
  res.status(201).send("HI");
});

app.use("/", router);

app.use(function (req, res) {
  res.status(404);
  res.send({ error: "not Found - error 404" });
});

app.listen(PORT_NUMBER, () => {
  console.info(`Server listening @ http://localhost:${PORT_NUMBER}`);
});
