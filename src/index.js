import app from "./app.js";
import { connectDB } from "./db.js";

const port = process.env.PORT || 3000;

connectDB();

app.listen(port, () => {
  console.log(`Servidor en el puerto ${port}`);
});

console.log("manzna");
