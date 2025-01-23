import { transaksiDto } from "@/dto/transaksi.dto";
import { prisma as db } from "@/lib/prisma";

export const findAll = async (): Promise<transaksiDto[]> => {
  return await db.transaksi.findMany();
};

export const findById = async (id: number): Promise<transaksiDto | null> => {
  return await db.transaksi.findUnique({
    where: { id },
  });
};

export const create = async (data: transaksiDto): Promise<transaksiDto> => {
  return await db.transaksi.create({
    data
  });
};

export const update = async (
  id: number,
  data: Partial<transaksiDto>
): Promise<transaksiDto> => {
  return await db.transaksi.update({
    where: { id },
    data,
  });
};

export const remove = async (id: number): Promise<transaksiDto> => {
  return await db.transaksi.delete({
    where: { id },
  });
};
