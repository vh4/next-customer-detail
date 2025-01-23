import { UserPipe } from "@/model/user.model";
import { create, findByUsername } from "@/repository/user";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
	try {
	  const rawData = await req.json();
	  const data = UserPipe.parse(rawData);

	  const findExisting = await findByUsername(data.username);
	  if(findExisting){
		return NextResponse.json(
			{ message: "Username sudah ada."},
			{ status: 400 }
		  );
	  }
	  
	  data.password = bcrypt.hashSync(data.password, 10);
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
		{ message: "Gagal membuat Users", error: error.message },
		{ status: 500 }
	  );
	}
  }