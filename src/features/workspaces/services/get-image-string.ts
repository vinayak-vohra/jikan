import { ID, type Storage } from "node-appwrite";
import { BUCKET_ID } from "@/constants";

interface IUploadImage {
  (storage: Storage, image?: File | string): Promise<string | undefined>;
}

/**
 * Uploads an image to the Appwrite storage bucket and returns its base64 string representation.
 * If the image is already a base64 string, it returns the original value.
 * This function handles uploading both File objects and base64 strings.
 *
 * @param storage - The Appwrite storage instance used to upload and retrieve the file.
 * @param image - The image to be uploaded. Can be a File object or a base64 string.
 *                If the image is undefined, the function returns undefined.
 * @returns A promise that resolves to a base64 string representation of the uploaded image
 *          or the original base64 string. If no image is provided, it returns undefined.
 */
export const getImageString: IUploadImage = async function (storage, image) {
  if (image instanceof File) {
    const uploadedImage = await storage.createFile(
      BUCKET_ID,
      ID.unique(),
      image
    );

    // getFilePreview returns ArrayBuffer object in node-appwrite
    const arrayBuffer = await storage.getFilePreview(
      BUCKET_ID,
      uploadedImage.$id
    );

    // convert ArrayBuffer to data string
    return `data:${image.type};base64,${Buffer.from(arrayBuffer).toString(
      "base64"
    )}`;
  }

  return image;
};
