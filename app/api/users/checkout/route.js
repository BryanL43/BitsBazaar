import { NextResponse } from "next/server";
import prisma from "@/prisma/Client";

//Checkout API Handler
export async function PUT(req) {
    try {
        const body = await req.json();

        let user = await prisma.user.findUnique({
            where: {
                id: body.user.id
            }
        });

        if (!user) {
            return NextResponse.json({ success: false, error: "User is not found." });
        }

        await prisma.user.update({
            where: {
                id: body.user.id
            },
            data: {
                cart: body.user.cart,
                orderlog: body.user.orderlog
            }
        });
        
        return NextResponse.json({}); //Empty response as data is already updated rapidly on cookie
    } catch (error) {
        console.error("Error occurred when checking out:", error);
        return NextResponse.error("Error occurred when checking out", 500);
    }
}