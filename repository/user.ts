import { UserDto } from "@/dto/user.dto";
import { prisma } from "@/lib/prisma";

export const create = async (data: UserDto): Promise<UserDto> => {
  return await prisma.users.create({
    data,
  });
};

export const findByUsername = async (username: string): Promise<UserDto | null> => {
  const user = await prisma.users.findFirst({
    where: {
      username,
    },
  });
  return user;
};


export const findAll = async (): Promise<UserDto[]> => {
  return await prisma.users.findMany();
};
