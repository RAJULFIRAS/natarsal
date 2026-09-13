import { Response } from "express";
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

  const imageUrl = await uploadToBlob(file.buffer, file.originalname, "menu");
  console.log("Image uploaded to Blob:", imageUrl);
  return imageUrl;
};

export const createMenu = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const {
      name,
      description,
      price,
      categoryId,
      isAvailable,
      isRecommended,
      isSpicy,
      isVegetarian,
    } = req.body;

    const file = req.file;

    console.log("Create Menu - Body:", req.body);
    console.log("Create Menu - File:", file?.originalname || "No file");

    if (!name || typeof name !== "string" || !name.trim()) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Name is required",
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Valid price is required",
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (!categoryId || isNaN(parseInt(categoryId))) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Valid category ID is required",
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId, 10) },
    });

    if (!category) {
      res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: `Category with ID ${categoryId} not found`,
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const existing = await prisma.menu.findFirst({
      where: {
        name: name.trim(),
        categoryId: parseInt(categoryId, 10),
      },
    });

    if (existing) {
      res.status(409).json({
        success: false,
        error: {
          code: "CONFLICT",
          message: `Menu "${name}" already exists in this category`,
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

    const menu = await prisma.menu.create({
      data: {
        name: name.trim(),
        description: description?.trim() || "",
        price: parseFloat(price),
        categoryId: parseInt(categoryId, 10),
        isAvailable: isAvailable === "true" || isAvailable === true,
        isRecommended: isRecommended === "true" || isRecommended === true,
        isSpicy: isSpicy === "true" || isSpicy === true,
        isVegetarian: isVegetarian === "true" || isVegetarian === true,
        image: imageUrl,
      },
      include: {
        category: true,
      },
    });

    console.log("Menu created:", menu.name);
    res.status(201).json({
      success: true,
      data: menu,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Create menu error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: error.message || "Failed to create menu",
      },
      timestamp: new Date().toISOString(),
    });
  }
};

export const updateMenu = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const {
      name,
      description,
      price,
      categoryId,
      isAvailable,
      isRecommended,
      isSpicy,
      isVegetarian,
    } = req.body;
    const file = req.file;

    console.log("Update Menu - ID:", id);
    console.log("Update Menu - File:", file?.originalname || "No file");

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Invalid menu ID" },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const existing = await prisma.menu.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: `Menu with ID ${id} not found`,
        },
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

    const updateData: any = {};
    if (name && name.trim()) updateData.name = name.trim();
    if (description !== undefined)
      updateData.description = description?.trim() || "";
    if (price && !isNaN(parseFloat(price)))
      updateData.price = parseFloat(price);
    if (categoryId && !isNaN(parseInt(categoryId, 10))) {
      const category = await prisma.category.findUnique({
        where: { id: parseInt(categoryId, 10) },
      });
      if (!category) {
        res.status(404).json({
          success: false,
          error: {
            code: "NOT_FOUND",
            message: `Category with ID ${categoryId} not found`,
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }
      updateData.categoryId = parseInt(categoryId, 10);
    }
    if (isAvailable !== undefined) {
      updateData.isAvailable = isAvailable === "true" || isAvailable === true;
    }
    if (isRecommended !== undefined) {
      updateData.isRecommended =
        isRecommended === "true" || isRecommended === true;
    }
    if (isSpicy !== undefined) {
      updateData.isSpicy = isSpicy === "true" || isSpicy === true;
    }
    if (isVegetarian !== undefined) {
      updateData.isVegetarian =
        isVegetarian === "true" || isVegetarian === true;
    }
    updateData.image = imageUrl;

    const menu = await prisma.menu.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });

    console.log("Menu updated:", menu.name);
    res.json({
      success: true,
      data: menu,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Update menu error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: error.message || "Failed to update menu",
      },
      timestamp: new Date().toISOString(),
    });
  }
};

export const deleteMenu = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Invalid menu ID" },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const existing = await prisma.menu.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: `Menu with ID ${id} not found`,
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (existing.image) {
      await deleteFromBlob(existing.image);
    }

    await prisma.menu.delete({ where: { id } });

    res.json({
      success: true,
      data: { id },
      message: "Menu deleted successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Delete menu error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: error.message || "Failed to delete menu",
      },
      timestamp: new Date().toISOString(),
    });
  }
};
