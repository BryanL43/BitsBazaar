import { NextResponse } from "next/server";
import prisma from "@/prisma/Client";
const bcrypt = require("bcrypt");

//Signin REST API
export async function POST(req) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ success: false, error: "Please fill in all fields" });
        }

        let user = await prisma.user.findUnique({
            where: {
                email: email,
            }
        });

        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" });
        }
        const pwdMatch = await bcrypt.compare(password, user.password);
        if (!pwdMatch) {
            return NextResponse.json({ success: false, error: "Password is incorrect" });
        }

        //Return adjusted cookie data
        user = await prisma.user.findUnique({
            where: {
                email: email,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                password: false,
                addresses: true,
                orderlog: true,
                cart: true,
            }
        });

        return NextResponse.json({success: true, user});
    } catch(error) {
        return NextResponse.json({ success: false, error: error.message });
    }
}