import { UserPipe } from "@/model/user.model";
import { findByUsername } from "@/repository/user";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
	try {
	  const rawData = await req.json();
	  const data = UserPipe.parse(rawData);
	  const users = await findByUsername(data.username);

	  if(!users){
		return NextResponse.json(
			{ message: "Username atau password salah."},
			{ status: 400 }
		)
	  }

	  if(!await bcrypt.compare(data.password, users.password)){
		return NextResponse.json(
			{ message: "Username atau password salah."},
			{ status: 400 }
		)
	  }
	  
	} catch (error: any) {
	  if (error instanceof z.ZodError) {
		return NextResponse.json(
		  { message: "Validasi gagal", errors: error.errors },
		  { status: 400 }
		);
	  }
	  return NextResponse.json(
		{ message: "Gagal membuat Users", error: error.message },
		{ status: 500 }
	  );
	}
  }