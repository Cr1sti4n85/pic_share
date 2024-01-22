import bcrypt from "bcrypt";

export const encrypt = (plainPass) => {
  //cifrar password
  const salt = bcrypt.genSaltSync(12);
  const password = bcrypt.hashSync(plainPass, salt);

  return password;
};
