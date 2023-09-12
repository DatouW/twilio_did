const axios = require("axios");
require("dotenv").config();

const client = require("twilio")(
  process.env.ACCOUNT_SID_TWILIO,
  process.env.AUTH_TOKEN_TWILIO
);

const headers = {
  Authorization: `Basic ${process.env.API_KEY_DID}`,
  "Content-Type": "application/json",
};

const apiUrl = "https://api.d-id.com";

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: headers,
});

async function generateVideo(text) {
  console.log("generating video");
  return await axiosInstance.post("/talks", {
    source_url: process.env.AVATAR_URL,
    script: {
      type: "text",
      input: text,
      provider: {
        type: "microsoft",
        voice_id: "es-BO-SofiaNeural",
        voice_config: {
          style: "Default",
        },
      },
    },
    webhook: process.env.WEBHOOK,
  });
}

async function getVideo(id) {
  return await axiosInstance.get(`/talks/${id}`);
}

function sendTextMessage(sender, message) {
  return new Promise((resolve, reject) => {
    client.messages
      .create({
        from: "whatsapp:+14155238886",
        body: message,
        to: "whatsapp:+" + sender,
      })
      .then((message) => resolve(console.log(message)))
      .catch((err) => reject(err));
  });
}

module.exports = {
  sendTextMessage,
  generateVideo,
  getVideo,
};
