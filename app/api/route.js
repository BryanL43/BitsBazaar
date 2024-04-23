import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/Client";

export async function GET(req) {
    
    const user = {
        name: "HALLo",
        email: "Anfwqafwoanf@gmail.com",
        password: "totallysecured",
    }

    const newUser = await prisma.user.create({data: user});

    //console.log(newUser);
    return NextResponse.json({"HALLO": "HALLO"});
}

export async function POST(req) {
    const data = await req.json()
    console.log(data);

    const newUser = await prisma.user.create({data: data});

    return NextResponse.json(newUser);
}