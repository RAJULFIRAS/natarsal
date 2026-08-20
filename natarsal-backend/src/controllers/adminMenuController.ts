// D:/natarsal/natarsal-backend/src/controllers/adminMenuController.ts
import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

// ============================================================
// CREATE MENU (ADMIN)
// ============================================================
export const createMenu = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    // ✅ Ambil dari body (multer akan parse FormData)
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

    const file = (req as any).file;

    // ✅ DEBUG: Log untuk cek data masuk
    console.log("📝 Create Menu - Body:", req.body);
    console.log("📝 Create Menu - File:", file?.filename || "No file");

    // ✅ Validasi - Cek satu per satu
    if (!name || typeof name !== "string" || !name.trim()) {
      console.log("❌ Name is missing or invalid:", name);
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Name is required",
          details: { received: name },
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      console.log("❌ Price is missing or invalid:", price);
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Valid price is required",
          details: { received: price },
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (!categoryId || isNaN(parseInt(categoryId))) {
      console.log("❌ CategoryId is missing or invalid:", categoryId);
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Valid category ID is required",
          details: { received: categoryId },
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // ✅ Cek category exists
    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) },
    });

    if (!category) {
      console.log("❌ Category not found:", categoryId);
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

    // ✅ Cek duplicate name dalam category yang sama
    const existing = await prisma.menu.findFirst({
      where: {
        name: name.trim(),
        categoryId: parseInt(categoryId),
      },
    });

    if (existing) {
      console.log("❌ Duplicate menu:", name);
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

    // ✅ Create menu
    const menu = await prisma.menu.create({
      data: {
        name: name.trim(),
        description: description?.trim() || "",
        price: parseFloat(price),
        categoryId: parseInt(categoryId),
        isAvailable: isAvailable === "true" || isAvailable === true,
        isRecommended: isRecommended === "true" || isRecommended === true,
        isSpicy: isSpicy === "true" || isSpicy === true,
        isVegetarian: isVegetarian === "true" || isVegetarian === true,
        image: file ? `/uploads/${file.filename}` : null,
      },
      include: {
        category: true,
      },
    });

    console.log("✅ Menu created:", menu.name);
    res.status(201).json({
      success: true,
      data: menu,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("❌ Create menu error:", error);
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

// ============================================================
// UPDATE MENU (ADMIN) - Sama seperti create
// ============================================================
export const updateMenu = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
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
    const file = (req as any).file;

    console.log("📝 Update Menu - ID:", id);
    console.log("📝 Update Menu - Body:", req.body);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid menu ID",
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const existing = await prisma.menu.findUnique({
      where: { id },
    });

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

    let image = existing.image;
    if (file) {
      if (existing.image) {
        const oldPath = path.join(__dirname, "../../", existing.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      image = `/uploads/${file.filename}`;
    }

    const updateData: any = {};
    if (name && name.trim()) updateData.name = name.trim();
    if (description !== undefined)
      updateData.description = description?.trim() || "";
    if (price && !isNaN(parseFloat(price)))
      updateData.price = parseFloat(price);
    if (categoryId && !isNaN(parseInt(categoryId))) {
      const category = await prisma.category.findUnique({
        where: { id: parseInt(categoryId) },
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
      updateData.categoryId = parseInt(categoryId);
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
    if (image) updateData.image = image;

    const menu = await prisma.menu.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    console.log("✅ Menu updated:", menu.name);
    res.json({
      success: true,
      data: menu,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("❌ Update menu error:", error);
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

// ============================================================
// DELETE MENU (ADMIN)
// ============================================================
export const deleteMenu = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid menu ID",
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const existing = await prisma.menu.findUnique({
      where: { id },
    });

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
      const filePath = path.join(__dirname, "../../", existing.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await prisma.menu.delete({
      where: { id },
    });

    res.json({
      success: true,
      data: { id },
      message: "Menu deleted successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("❌ Delete menu error:", error);
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
