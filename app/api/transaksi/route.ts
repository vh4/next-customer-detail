import { idSchemaPipe, TransaksiPipe } from "@/model/transaksi.model";
import { findAll, create, update, remove } from "@/repository/transaksi";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  try {
    const transactions = await findAll();
    return NextResponse.json(transactions);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Gagal mengambil data transaksi", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const rawData = await req.json();
    const data = TransaksiPipe.parse(rawData);
    const response = await create(data);
    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validasi gagal", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Gagal membuat transaksi", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const id = Number(url.searchParams.get("id"));

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

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = Number(url.searchParams.get("id"));

    idSchemaPipe.parse(id);

    const response = await remove(id);
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validasi gagal", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Gagal menghapus transaksi", error: error.message },
      { status: 500 }
    );
  }
}
