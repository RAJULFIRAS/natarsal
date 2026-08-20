// D:/natarsal/natarsal-backend/src/controllers/menuController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================
// GET ALL MENUS
// ============================================================
export const getMenus = async (_req: Request, res: Response): Promise<void> => {
  // ✅ _req
  try {
    const menus = await prisma.menu.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json({
      success: true,
      data: menus,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: error.message,
      },
      timestamp: new Date().toISOString(),
    });
  }
};

// ============================================================
// GET MENU BY ID
// ============================================================
export const getMenuById = async (
  req: Request,
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

    const menu = await prisma.menu.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!menu) {
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

    res.json({
      success: true,
      data: menu,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: error.message,
      },
      timestamp: new Date().toISOString(),
    });
  }
};

// ============================================================
// GET CATEGORIES
// ============================================================
export const getCategories = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  // ✅ _req
  try {
    const categories = await prisma.category.findMany({
      include: {
        menus: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    const formattedCategories = categories.map((cat) => ({
      ...cat,
      _count: {
        menus: cat.menus.length,
      },
    }));

    res.json({
      success: true,
      data: formattedCategories,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: error.message,
      },
      timestamp: new Date().toISOString(),
    });
  }
};
