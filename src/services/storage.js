const {ImageKit} = require("@imagekit/nodejs");

const ImageKitClient = new ImageKit({
  privateKey: process.env.IMAGE_KIT_PRIVATE,
});

async function uploadFile(fileBuffer, fileName) {
  const result = await ImageKitClient.files.upload({
    file: fileBuffer,
    fileName: fileName,
    folder: "locations",
  });

  return result.url;
}

module.exports = { uploadFile };
