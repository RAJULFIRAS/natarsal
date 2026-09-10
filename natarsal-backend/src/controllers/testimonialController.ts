import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

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
    const file = (req as any).file;

    console.log("Create Testimonial - Body:", req.body);
    console.log("Create Testimonial - File:", file?.filename || "No file");

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
        image: file ? `/uploads/${file.filename}` : null,
        rating: rating ? parseInt(rating) : 5,
        order: order ? parseInt(order) : 0,
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
    const id = parseInt(req.params.id);
    const { name, role, content, rating, order, isActive } = req.body;
    const file = (req as any).file;

    console.log("Update Testimonial - ID:", id);
    console.log("Update Testimonial - Body:", req.body);
    console.log("Update Testimonial - File:", file?.filename || "No file");

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

    let image = existing.image;
    if (file) {
      if (existing.image) {
        const oldPath = path.join(__dirname, "../../", existing.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
          console.log("Old image deleted:", existing.image);
        }
      }
      image = `/uploads/${file.filename}`;
    }

    const updateData: any = { image };
    if (name) updateData.name = name.trim();
    if (role) updateData.role = role.trim();
    if (content) updateData.content = content.trim();
    if (rating !== undefined) updateData.rating = parseInt(rating);
    if (order !== undefined) updateData.order = parseInt(order);
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

    if (existing.image) {
      const filePath = path.join(__dirname, "../../", existing.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("Image deleted:", existing.image);
      }
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
