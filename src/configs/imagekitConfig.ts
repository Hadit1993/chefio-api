import ImageKit from "imagekit";
import {
  IMAGE_KIT_PRIVATE_KEY,
  IMAGE_KIT_PUBLIC_KEY,
  IMAGE_KIT_URL_ENDPOINT,
} from "../constants/env";

const imageKitInstance = new ImageKit({
  publicKey: IMAGE_KIT_PUBLIC_KEY!,
  privateKey: IMAGE_KIT_PRIVATE_KEY!,
  urlEndpoint: IMAGE_KIT_URL_ENDPOINT!,
});

export default imageKitInstance;
