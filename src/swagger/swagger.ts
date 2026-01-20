import swaggerJSDoc from "swagger-jsdoc";
import { components } from "./components";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth API",
      version: "1.0.0",
      description: "JWT authentication service",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components,
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./src/**/*.routes.ts"],
});
