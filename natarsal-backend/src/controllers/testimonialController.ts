import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types";

const prisma = new PrismaClient();

// ============================================================
// GET ALL TESTIMONIALS (PUBLIC)
// ============================================================
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

// ============================================================
// CREATE TESTIMONIAL (ADMIN)
// ============================================================
export const createTestimonial = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { name, role, content, image, rating, order } = req.body;

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

    const testimonial = await prisma.testimonial.create({
      data: {
        name: name.trim(),
        role: role.trim(),
        content: content.trim(),
        image: image || null,
        rating: rating || 5,
        order: order || 0,
        isActive: true,
      },
    });

    res.status(201).json({
      success: true,
      data: testimonial,
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

// ============================================================
// UPDATE TESTIMONIAL (ADMIN)
// ============================================================
export const updateTestimonial = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { name, role, content, image, rating, order, isActive } = req.body;

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

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        name: name?.trim(),
        role: role?.trim(),
        content: content?.trim(),
        image: image,
        rating: rating,
        order: order,
        isActive: isActive,
      },
    });

    res.json({
      success: true,
      data: testimonial,
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

// ============================================================
// DELETE TESTIMONIAL (ADMIN)
// ============================================================
export const deleteTestimonial = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

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

    await prisma.testimonial.delete({ where: { id } });

    res.json({
      success: true,
      data: { id },
      message: "Testimonial deleted successfully",
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
