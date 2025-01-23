import { idSchemaPipe, TransaksiPipe } from "@/model/transaksi.model";
import { findById, update, remove } from "@/repository/transaksi";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {

    const id = Number(params.id);
    idSchemaPipe.parse(id);

    const transaction = await findById(id);

    if (!transaction) {
      return NextResponse.json(
        { message: "Transaksi tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Gagal mengambil transaksi", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {

    const id = Number(params.id);
    idSchemaPipe.parse(id);

    const rawData = await req.json();
    const data = TransaksiPipe.partial().parse(rawData);

    const response = await update(id, data);
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validasi gagal", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Gagal memperbarui transaksi", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {

    const id = Number(params.id);
    idSchemaPipe.parse(id);

    const response = await remove(id);
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Gagal menghapus transaksi", error: error.message },
      { status: 500 }
    );
  }
}
