import prisma from "@/prisma/Client";
import { NextResponse } from "next/server";

const resend_api_key = process.env.RESEND_API_KEY;

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

                //Working email sender but I'm limited to extreme small amount of api usage.
                (async function () {
                    const res = await fetch('https://api.resend.com/emails', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${resend_api_key}`,
                        },
                        body: JSON.stringify({
                            from: 'Acme <onboarding@resend.dev>',
                            to: [body.email],
                            subject: "BitsBazaar One-Time Reset Token",
                            html: `<strong>${randomCode}</strong>`
                        })
                    })

                    if (res.ok) {
                        console.log("Successfully sent email.");
                    } else {
                        console.log("Failed sending email");
                    }
                })();

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
        await prisma.user.update({
            where: {
                email: email
            },
            data: {
                password: newPassword
            }
        })

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error occurred during password change:", error);
        return NextResponse.error("Error occurred during password change", 500);
    }
}