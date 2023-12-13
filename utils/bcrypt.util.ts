import bcrypt from 'bcryptjs';

// eslint-disable-next-line import/prefer-default-export
export const bcryptHashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};
