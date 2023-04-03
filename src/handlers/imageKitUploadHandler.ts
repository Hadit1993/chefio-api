import imageKitInstance from "../configs/imagekitConfig";

export default async function uploadToImageKit(
  imageFile: Express.Multer.File,
  imageType: "user" | "recipe"
) {
  const timestamp = Date.now();
  const folder = `${imageType}s`;
  const fileName = `$${timestamp}.${imageFile.mimetype.split("/")[1]}`;

  const uploadResult = await imageKitInstance.upload({
    file: imageFile.buffer,
    fileName,
    folder,
  });

  return uploadResult.url;
}
