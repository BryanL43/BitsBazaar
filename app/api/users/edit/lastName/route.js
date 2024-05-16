import { NextResponse } from "next/server";
import prisma from "@/prisma/Client";

export async function PUT(req) {
    try {
        const body = await req.json();

        let user = await prisma.user.findUnique({
            where: {
                id: body.id
            }
        });

        if (!user) {
            return NextResponse.json({ success: false, error: "User is not found." });
        }

        //Update first name
        await prisma.user.update({
            where: {
                id: body.id
            },
            data: {
                lastName: body.newLastName
            }
        })

        //Return new updated data [trigger new user acquisition to refresh the data returned]
        user = await prisma.user.findUnique({
            where: {
                id: body.id
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
    } catch (error) {
        console.error("Error occurred during last name change:", error);
        return NextResponse.error("Error occurred during last name change", 500);
    }
}