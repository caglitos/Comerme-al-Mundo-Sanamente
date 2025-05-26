// Esquema de validación para registro e inicio de sesión de usuario
export const registerSchema = {
  type: "object",
  properties: {
    nombre: { type: "string", minLength: 1 },
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 1 },
  },
  required: ["nombre", "email", "password"],
  additionalProperties: false,
};

export const loginSchema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 1 },
  },
  required: ["email", "password"],
  additionalProperties: false,
};
