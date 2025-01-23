import { z } from "zod";

export const TransaksiPipe = z.object({
  productID: z.string().nonempty("Product ID wajib diisi"),
  productName: z.string().nonempty("Nama Produk wajib diisi"),
  amount: z.string().nonempty("Jumlah wajib diisi"),
  customerName: z.string().nonempty("Nama Pelanggan wajib diisi"),
  status: z
    .number()
    .int()
    .min(0, "Status harus bernilai 0 atau 1")
    .max(1, "Status harus bernilai 0 atau 1"),
  createBy: z.string().nonempty("Dibuat Oleh wajib diisi"),
});

export const idSchemaPipe = z.number().positive("ID harus berupa angka positif");