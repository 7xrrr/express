const express = require("express");
const axios = require("axios");
const sharp = require("sharp");
const { Buffer } = require("buffer");

const app = express();
const port = 3000;

let config = {
  "1": "aHR0cHM6Ly9qLnRvcDR0b3AuaW8vcF8yOTIxYjM3cWExLnBuZw=="
};

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/:filename.png", async (req, res) => {
  try {
    console.log(req)
    const filenameWithExtension = req.params.filename;

    const filename = filenameWithExtension.replace(".png", "");


    if (!config[filename]) {
      return res.status(404).send("File not found");
    }

    const imageUrlBase64 = config[filename];
    const imageUrl = Buffer.from(imageUrlBase64, "base64").toString("utf-8");

    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

    const pngBuffer = await sharp(response.data).toFormat("png").toBuffer();

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Length", pngBuffer.length);

    res.end(pngBuffer);
  } catch (error) {
    console.error("Error fetching or processing image:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
