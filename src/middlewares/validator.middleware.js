import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true });

export function validateSchema(schema) {
  return (req, res, next) => {
    const validate = ajv.compile(schema);
    const valid = validate(req.body);
    if (!valid) {
      return res.status(400).json({
        message: "Datos inválidos",
        errors: validate.errors,
      });
    }
    next();
  };
}
