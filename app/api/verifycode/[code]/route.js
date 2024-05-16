import prisma from "@/prisma/Client";
import { NextResponse } from "next/server";

export async function GET(req, {params}) {
    try {
        const foundCode = await prisma.ResetCode.findUnique({
            where: {
                code: params.code
            }
        })

        if (foundCode) {
            //Delete consumed reset code
            await prisma.ResetCode.delete({
                where: {
                    code: params.code
                }
            });

            return NextResponse.json({success: true});
        } else {
            return NextResponse.json({success: false});
        }
    } catch (error) {
        console.error("Error occurred during verifying code:", error);
        return NextResponse.error("Error occurred when verifying code", 500);
    }
}

//Update email on code verified
export async function PUT(req, {params}) {
    try {
        const body = await req.json();

        const foundCode = await prisma.ResetCode.findUnique({
            where: {
                code: params.code
            }
        })

        if (foundCode) {
            //Delete consumed reset code
            await prisma.ResetCode.delete({
                where: {
                    code: params.code
                }
            });

            //Check if user exist
            let user = await prisma.user.findUnique({
                where: {
                    email: body.oldEmail
                }
            });
    
            if (!user) {
                return NextResponse.json({ success: false, error: "User is not found." });
            }
            
            //Update the user's email
            await prisma.user.update({
                where: {
                    email: body.oldEmail
                },
                data: {
                    email: body.newEmail
                }
            });

            return NextResponse.json({success: true});
        } else {
            return NextResponse.json({success: false});
        }
    } catch (error) {
        console.error("Error occurred during verifying email change code:", error);
        return NextResponse.error("Error occurred when verifying email change code", 500);
    }
}