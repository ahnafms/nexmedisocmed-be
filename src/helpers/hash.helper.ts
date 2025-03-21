import bcrypt from "bcrypt";

export const hash = async (data: string): Promise<string> => {
  return await bcrypt.hash(data, 10);
};

export const compare = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
