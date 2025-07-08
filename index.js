import express from "express";
import bodyParser from "body-parser";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";
import "dotenv/config";
import { log } from "console";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  console.log("Received:", req.body);
  const firstName = req.body.FNAME;
  const email = req.body.email;
  const lastName = req.body.LNAME;
  const { birthday_month, birthday_day } = req.body;
  const birthday = `${birthday_month}/${birthday_day}`;

  console.log(birthday);

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;

  console.log(apiKey);

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
    update_existing: true,
  };
  console.log(data);

  const jsonData = JSON.stringify(data);

  const url = `https://us11.api.mailchimp.com/3.0/lists/${listId}`;

  const options = {
    method: "POST",
    auth: `Izuchukwu:${apiKey}`,
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });

    let responseData = "";

    response.on("data", (chunk) => {
      responseData += chunk;
    });

    request.on("end", async () => {
      const result = JSON.parse(responseData);

      if (response.statusCode === 200) {
        res.json({
          success: true,
          isUpdate: result.total_updated > 0,
          email: email,
        });
      } else {
        res.json({
          success: false,
          error: result.detail || "Operation failed",
        });
      }
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
