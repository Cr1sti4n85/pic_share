//este middelware es para obtener la informacion del propio usuario logueado

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
