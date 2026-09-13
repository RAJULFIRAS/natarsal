import { put, del } from "@vercel/blob";
import { config } from "../config/env";

const BLOB_READ_WRITE_TOKEN = config.BLOB_READ_WRITE_TOKEN;

export const isBlobConfigured = (): boolean => {
  return !!BLOB_READ_WRITE_TOKEN;
};

/**
 * Upload buffer Vercel Blob.
 * @returns URL publik file
 */
export const uploadToBlob = async (
  buffer: Buffer,
  originalName: string,
  prefix: "menu" | "testimonial" = "menu",
): Promise<string> => {
  if (!BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN belum di-set. Konfigurasi Vercel Blob terlebih dahulu.",
    );
  }

  const safeName = originalName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-");

  const uniqueName = `${prefix}-${Date.now()}-${Math.round(
    Math.random() * 1e9,
  )}-${safeName}`;

  const blob = await put(uniqueName, buffer, {
    access: "public",
    token: BLOB_READ_WRITE_TOKEN,
    contentType: getContentType(originalName),
  });

  return blob.url;
};

export const deleteFromBlob = async (
  imageUrl: string | null | undefined,
): Promise<void> => {
  if (!imageUrl) return;

  if (!imageUrl.includes(".public.blob.vercel-storage.com")) {
    return;
  }

  if (!BLOB_READ_WRITE_TOKEN) return;

  try {
    await del(imageUrl, { token: BLOB_READ_WRITE_TOKEN });
    console.log("Blob deleted:", imageUrl);
  } catch (err: any) {
    console.warn("Failed to delete blob:", err.message);
  }
};

const getContentType = (filename: string): string => {
  const ext = filename.toLowerCase().split(".").pop();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
};
