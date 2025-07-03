import express from "express";
import bodyParser from "body-parser";
import path from "path";
import http from "https";
import { fileURLToPath } from "url";
import { log } from "console";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.FNAME;
  const email = req.body.email;
  const lastName = req.body.LNAME;
  var birthNum = req.body.birthday;
  const birthday = birthNum.toString();

  console.log(typeof birthday);

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
          BIRTHDAY: birthday,
        },
      },
    ],
  };
  console.log(data);

  const jsonData = JSON.stringify(data);

  const url = "https://us11.api.mailchimp.com/3.0/lists/cd086977f1";

  const options = {
    method: "POST",
    auth: "Izuchukwu:44eee036d95eb15c96cfe4e214462534-us11",
  };

  const request = http.request(url, options, function (response) {
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.listen(port, () => console.log(`Server running on port ${port}`));

//My API Key = 44eee036d95eb15c96cfe4e214462534-us11

//  My List ID = cd086977f1
