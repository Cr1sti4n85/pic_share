import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import __dirname from "./dirName.js";

export const uploadImage = (files, id, imgUrl = null) => {
  const validExtensions = ["jpg", "jpeg", "png"];
  return new Promise((resolve, reject) => {
    const { archivo } = files;
    const splitName = archivo.name.split(".");
    const extension = splitName.at(-1).toLowerCase();

    if (!validExtensions.includes(extension)) {
      return reject({
        status: "failed",
        msg: `La extensión ${extension} no es permitida. Extensiones válidas: ${validExtensions}`,
      });
    }

    // borrar imagen previa del server si es que existe
    if (imgUrl) {
      deleteImg(id, imgUrl);
    }

    const tempName = uuidv4() + "." + extension;
    const uploadPath = path.join(
      __dirname,
      `../public/uploads/${id}/`,
      tempName
    );

    archivo.mv(uploadPath, (err) => {
      if (err) {
        return reject({
          status: "failed",
          msg: `No se pudo guardar la imagen`,
        });
      }
    });

    resolve(tempName);
  });
};

export const deleteImg = (id, imgUrl) => {
  const pathImg = path.join(__dirname, `../public/uploads/${id}/`, imgUrl);
  if (fs.existsSync(pathImg)) {
    fs.unlinkSync(pathImg);
  }
};
