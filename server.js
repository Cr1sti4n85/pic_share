import app from "./app.js";
import { sequelize } from "./database/db.js";
//importacion de los modelos sequelize
import "./models/User.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await sequelize.sync();

  console.log(`Servidor escuchando en puerto ${PORT}`);
});
