import { z } from "zod";

export const UserPipe = z.object({
  username: z.string().nonempty("Username wajib diisi"),
  name: z.string().nonempty("Name wajib diisi"),
  password: z.string().nonempty("Password wajib diisi"),
});
