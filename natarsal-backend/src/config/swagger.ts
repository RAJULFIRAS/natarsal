// natarsal-backend/src/config/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Natarsal API Documentation",
      version: "1.0.0",
      description: "API for Natarsal Restaurant Reservation System",
      contact: {
        name: "Natarsal Team",
        email: "support@natarsal.com",
      },
      license: {
        name: "MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Development",
      },
      {
        url: "https://natarsal-backend.vercel.app/api",
        description: "Production",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            role: { type: "string", enum: ["admin", "user"] },
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Reservation: {
          type: "object",
          properties: {
            id: { type: "integer" },
            reservationNumber: { type: "string" },
            date: { type: "string", format: "date-time" },
            guests: { type: "integer", minimum: 1, maximum: 20 },
            customerName: { type: "string" },
            customerEmail: { type: "string", format: "email" },
            customerPhone: { type: "string" },
            status: {
              type: "string",
              enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
            },
            notes: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        MenuItem: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
            category: { type: "string" },
            isAvailable: { type: "boolean" },
            image: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: {
              type: "object",
              properties: {
                code: { type: "string" },
                message: { type: "string" },
                details: { type: "object" },
              },
            },
            timestamp: { type: "string", format: "date-time" },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { type: "object" },
            meta: {
              type: "object",
              properties: {
                page: { type: "integer" },
                limit: { type: "integer" },
                total: { type: "integer" },
                totalPages: { type: "integer" },
              },
            },
            timestamp: { type: "string", format: "date-time" },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Menu", description: "Menu management" },
      { name: "Reservations", description: "Reservation management" },
      { name: "Admin", description: "Admin-only endpoints" },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export const setupSwagger = (app: Express) => {
  const specs = swaggerJsdoc(options);
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Natarsal API Documentation",
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: "none",
        filter: true,
      },
    }),
  );
  console.log("📚 Swagger docs available at /api-docs");
};
