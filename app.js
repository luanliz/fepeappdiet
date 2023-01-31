const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
dotenv.config();

const mailchimp = require("@mailchimp/mailchimp_marketing");
console.log("teste", process.env.MAILCHIMP_API_KEY);
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: "us12",
});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const addMember = async () => {
    try {
      const data = await mailchimp.lists.addListMember("4485f30520", {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      });
      res.sendFile(__dirname + "/success.html");
    } catch (error) {
      res.sendFile(__dirname + "/failute.html");
    }
  };
  addMember();
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Servidor está rodando na porta 3001");
});
