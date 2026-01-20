export const components = {
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
        id: { type: "number", example: 1 },
        email: { type: "string", example: "bob@example.com" },
        name: { type: "string", example: "Bob" },
        role: { type: "string", example: "ADMIN" },
      },
    },

    TokenPayload: {
      type: "object",
      properties: {
        userId: { type: "number", example: 1 },
        role: { type: "string", example: "ADMIN" },
        tokenVersion: { type: "number", example: 1 },
      },
    },

    LoginRequest: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: { type: "string", example: "bob@example.com" },
        password: { type: "string", example: "Bob12345" },
      },
    },

    AuthResponse: {
      type: "object",
      properties: {
        accessToken: { type: "string" },
        user: { $ref: "#/components/schemas/User" },
      },
    },

    ErrorResponse: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};
