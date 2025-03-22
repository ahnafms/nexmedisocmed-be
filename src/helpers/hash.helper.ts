import bcrypt from "bcrypt";

export const hash = async (data: string, salt = 10): Promise<string> => {
  return await bcrypt.hash(data, salt);
};

export const compare = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
