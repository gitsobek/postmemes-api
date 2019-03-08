const AWS = require("aws-sdk");
const uuid = require("uuid/v1");
const checkLogin = require("../middlewares/checkLogin");
const keys = require("../config/keys");

const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
  signatureVersion: "v4",
  endpoint: "s3-eu-central-1.amazonaws.com",
  region: "eu-central-1"
});

module.exports = app => {
  app.get("/api/upload", checkLogin, (req, res) => {
    console.log(req);
    const key = `${req.user.id}/${uuid()}.jpeg`;

    s3.getSignedUrl(
      "putObject",
      {
        Bucket: "postmemes",
        ContentType: "image/jpeg",
        Key: key
      },
      (err, url) => res.send({ key, url })
    );
  });
};
