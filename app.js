import { config } from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { engine, create } from "express-handlebars";
import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authRoutes.js";
import postRouter from "./routes/postRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import viewRouter from "./routes/viewRoutes.js";
//dotenv para variables de entorno
config();
const app = express();

//helper para validación de igualdad entre dos parametros
const hbs = create({
  helpers: {
    ifEquals(arg1, arg2, options) {
      return arg1 === arg2 ? options.fn(this) : options.inverse(this);
    },
  },
});

//objeto de configuracion de express-fileupload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    createParentPath: true,
  })
);

//middleware para procesar requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

//uso de carpeta public para acceder a archivos
app.use(express.static("public"));

//rutas del sitio y de la api
app.use("/", viewRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);

//error global para las rutas que no se encuentran
app.all("*", (req, res, next) => {
  const err = new Error(
    `No se puede encontrar ${req.originalUrl}. Verifica que la ruta sea la correcta y no falten parámetros`
  );
  err.status = "failed";
  err.statusCode = 404;
  next(err);
});

//middleware de error global que envia un objeto o envia pagina de error
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      msg: err.message,
    });
  }

  //Interfaz grafica
  return res.status(err.statusCode).render("error", {
    title: "Algo salió mal",
    msg: err.message,
  });
});

export default app;
