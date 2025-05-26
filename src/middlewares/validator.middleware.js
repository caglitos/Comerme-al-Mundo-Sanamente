import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv); // Habilita validación de formatos como 'email'

export function validateSchema(schema) {
  return (req, res, next) => {
    const validate = ajv.compile(schema);
    const valid = validate(req.body);
    if (!valid) {
      console.error("AJV validation errors:", validate.errors); // Log para debug
      return res.status(400).json({
        message: "Datos inválidos",
        errors: validate.errors,
        body: req.body, // Para depuración
      });
    }
    next();
  };
}
