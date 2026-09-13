import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types";
import {
  uploadToBlob,
  deleteFromBlob,
  isBlobConfigured,
} from "../services/storage.service";

const prisma = new PrismaClient();

const processImageUpload = async (
  file: Express.Multer.File | undefined,
  existingImage: string | null = null,
  isUpdate: boolean = false,
): Promise<string | null> => {
  if (!file) {
    return isUpdate ? existingImage : null;
  }

  if (isUpdate && existingImage) {
    await deleteFromBlob(existingImage);
  }

  if (!isBlobConfigured()) {
    throw new Error(
      "Fitur upload gambar belum tersedia. BLOB_READ_WRITE_TOKEN belum dikonfigurasi.",
    );
  }

  const imageUrl = await uploadToBlob(
    file.buffer,
    file.originalname,
    "testimonial",
  );
  console.log("Testimonial image uploaded:", imageUrl);
  return imageUrl;
};

export const getTestimonials = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    res.json({
      success: true,
      data: testimonials,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: error.message },
      timestamp: new Date().toISOString(),
    });
  }
};

export const createTestimonial = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { name, role, content, rating, order } = req.body;
    const file = req.file;

    console.log("Create Testimonial - Body:", req.body);
    console.log("Create Testimonial - File:", file?.originalname || "No file");

    if (!name || !role || !content) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Name, role, and content are required",
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    let imageUrl: string | null = null;
    try {
      imageUrl = await processImageUpload(file, null, false);
    } catch (uploadError: any) {
      console.error("Upload image failed:", uploadError);
      res.status(500).json({
        success: false,
        error: {
          code: "UPLOAD_ERROR",
          message: uploadError.message || "Failed to upload image",
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name: name.trim(),
        role: role.trim(),
        content: content.trim(),
        image: imageUrl,
        rating: rating ? parseInt(rating, 10) : 5,
        order: order ? parseInt(order, 10) : 0,
        isActive: true,
      },
    });

    console.log("Testimonial created:", testimonial.id);

    res.status(201).json({
      success: true,
      data: testimonial,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Create testimonial error:", error);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: error.message },
      timestamp: new Date().toISOString(),
    });
  }
};

export const updateTestimonial = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, role, content, rating, order, isActive } = req.body;
    const file = req.file;

    console.log("Update Testimonial - ID:", id);
    console.log("Update Testimonial - File:", file?.originalname || "No file");

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Invalid ID" },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Testimonial not found" },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    let imageUrl: string | null = existing.image;
    if (file) {
      try {
        imageUrl = await processImageUpload(file, existing.image, true);
      } catch (uploadError: any) {
        console.error("Upload image failed:", uploadError);
        res.status(500).json({
          success: false,
          error: {
            code: "UPLOAD_ERROR",
            message: uploadError.message || "Failed to upload image",
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }
    }

    const updateData: any = { image: imageUrl };
    if (name) updateData.name = name.trim();
    if (role) updateData.role = role.trim();
    if (content) updateData.content = content.trim();
    if (rating !== undefined) updateData.rating = parseInt(rating, 10);
    if (order !== undefined) updateData.order = parseInt(order, 10);
    if (isActive !== undefined) {
      updateData.isActive = isActive === "true" || isActive === true;
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: updateData,
    });

    console.log("Testimonial updated:", testimonial.id);

    res.json({
      success: true,
      data: testimonial,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Update testimonial error:", error);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: error.message },
      timestamp: new Date().toISOString(),
    });
  }
};

export const deleteTestimonial = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Invalid ID" },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Testimonial not found" },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (existing.image) {
      await deleteFromBlob(existing.image);
    }

    await prisma.testimonial.delete({ where: { id } });

    res.json({
      success: true,
      data: { id },
      message: "Testimonial deleted successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Delete testimonial error:", error);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: error.message },
      timestamp: new Date().toISOString(),
    });
  }
};
