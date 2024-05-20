import prisma from "@/prisma/Client";
import { NextResponse } from "next/server";
const bcrypt = require("bcrypt");

//Forgot Password send code handler
export async function POST(req) {
    try {
        const body = await req.json();

        const foundEmail = await prisma.user.findUnique({
            where: {
                email: body.email
            }
        })

        if (!foundEmail) {
            return NextResponse.json({ success: false, error: "User is not found." });
        }

        if (foundEmail) {
            try {
                const randomCode = String(Math.floor(Math.random() * 900000) + 100000);
                const expirationTime = new Date();
                expirationTime.setMinutes(expirationTime.getMinutes() + 5);
                const newCode = await prisma.ResetCode.create({
                    data: {
                        code: randomCode,
                        expiresAt: expirationTime
                    }
                });
                await newCode;
                
                //Working email sender
                try {
                    console.log(body.email, randomCode);
                    const response = await fetch(req.headers.get('origin') + "/api/email", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email: body.email,
                            randomCode: randomCode
                        })
                    });

                    if (!response.ok) {
                        throw new Error("Sending email failed!");
                    }
            
                    await response.json(); //Not returning anything as we need to return the bottom data
                } catch (error) {
                    console.error('Error during code acquisition:', error);
                    throw error;
                }

                return NextResponse.json({ success: true, email: body.email });
            } catch (error) {
                console.error("Error occurred during reset code creation:", error);
                return NextResponse.error("Error occurred during reset code creation", 500);
            }
        } else {
            return NextResponse.json({ success: false, error: "Not Found" });
        }
    } catch (error) {
        console.error("Error occurred during finding email:", error);
        return NextResponse.error("Error occurred when finding email", 500);
    }
}

//Reset Password Handler
export async function PUT(req) {
    try {
        const { email, newPassword } = await req.json();

        //Find user by email
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (!user) {
            return NextResponse.error("User not found", 404); //Need 404 error return as there should NOT be a logic error where user is not found
        }

        //Update password
        const hashedPwd = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: {
                email: email
            },
            data: {
                password: hashedPwd
            }
        })

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error occurred during password change:", error);
        return NextResponse.error("Error occurred during password change", 500);
    }
}