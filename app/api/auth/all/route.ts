import { findAll } from "@/repository/user";
import { NextResponse } from "next/server";

export async function GET() {
	try {
	  const users = await findAll();
	  return NextResponse.json(users);
	} catch (error: any) {
	  return NextResponse.json(
		{ message: "Gagal mengambil data transaksi", error: error.message },
		{ status: 500 }
	  );
	}
  }