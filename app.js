const express = require("express");
const app = express();
const twilio = require("./twilio_api");

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
let result_url =
  "https://d-id-talks-prod.s3.us-west-2.amazonaws.com/google-oauth2%7C114569263787566454359/tlk_Iu3sD_s2iCEVGX59PacD-/1694541882192.mp4?AWSAccessKeyId=AKIA5CUMPJBIK65W6FGA&Expires=1694628285&Signature=GtzVnYM1qOUTgi43Vaccu5oIQIE%3D&X-Amzn-Trace-Id=Root%3D1-6500a83d-3bae8af15fd7ded4366eaed4%3BParent%3D5c03e69370dc72dc%3BSampled%3D1%3BLineage%3D6b931dd4%3A0";
let title = "Video";

app.post("/video", async (req, res) => {
  // 1. generar el video
  const response = await twilio.generateVideo(req.body.Body);

  if (response.status >= 200 && response.status < 400) {
    const { status, id } = response.data;
    console.log(status, id);
    if (status === "created") {
      let dataa;
      while (true) {
        await esperar(1000);
        const { data } = await twilio.getVideo(id);
        dataa = data;
        if (data.status === "done") break;
      }
      console.log(dataa.result_url);
      result_url = dataa.result_url;
      res.redirect("/");
    }
  }
});

app.get("/", (req, res) => {
  const videoData = {
    text: title,
    source: result_url,
  };
  res.render("video", { videoData });
});

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.post("/webhook", (req, res) => {
  const { WaId: sender, Body: text } = req.body;
  twilio.sendTextMessage(sender, text);
});

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.listen(3000, () => {
  console.log("servidor montado en el puerto 3000");
});
