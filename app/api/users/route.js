import prisma from "@/prisma/Client";
import { NextResponse } from "next/server";
const bcrypt = require("bcrypt");

//Registeration handler
export async function POST(req) {
    try {
        const body = await req.json();
        const requiredFields = ['firstName', 'lastName', 'email', 'password'];

        //Check for missing field
        const missingField = requiredFields.find(field => !body[field]);
        if (missingField) {
            return NextResponse.json({ success: false, error: `${missingField} is missing.` });
        }

        //Check if the email is already taken
        const user = await prisma.user.findUnique({
            where: {
                email: body.email
            }
        });

        if (user) {
            return NextResponse.json({ success: false, error: `Email ${body.email} is already taken.` });
        }

        const hashedPwd = await bcrypt.hash(body.password, 10);
        
        const newUser = {
            ...body,
            password: hashedPwd
        }

        //Create new user
        await prisma.user.create({ data: newUser });

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: error.message })
    }
}