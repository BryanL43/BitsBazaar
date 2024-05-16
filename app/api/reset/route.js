import prisma from "@/prisma/Client";
import { NextResponse } from "next/server";
import { Resend } from 'resend';

const resend = new Resend("re_GMWC3jMX_92c9tR4ex1ZYY8Prmbu22bre");

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

                return NextResponse.json({success: true, email: body.email});
            } catch (error) {
                console.error("Error occurred during reset code creation:", error);
                return NextResponse.error("Error occurred during reset code creation", 500);
            }
            
            /* Working email but I'm limited to extreme small amount of api usage.
            (async function () {
                const { data, error } = await resend.emails.send({
                    from: 'Acme <onboarding@resend.dev>',
                    // from: 'Acme <no-reply@bitsbazaar.com>', This will be added once I verify the vercel domain
                    to: [email],
                    subject: "This is a Test",
                    html: "<strong>Assume this is your reset token.</strong>"
                });
              
                if (error) {
                  return console.error({ error });
                }
              
                console.log({ data });
              })();*/
        } else {
            return NextResponse.json({success: false, error: "Not Found"});
        }
    } catch (error) {
        console.error("Error occurred during finding email:", error);
        return NextResponse.error("Error occurred when finding email", 500);
    }
}

//Reset Password Handler
export async function PUT(req) {
    try {
        const {email, newPassword } = await req.json();

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

        return NextResponse.json({success: true});
    } catch (error) {
        console.error("Error occurred during password change:", error);
        return NextResponse.error("Error occurred during password change", 500);
    }
}