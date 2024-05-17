import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/Client";
import { parse } from 'url';

//Compromises made. Little time to add admin page so add items through postman api calls.
export async function POST(req) {
    const { query } = parse(req.url, true);
    const { type } = query;

    if (type === "addproduct") {
        try {
            console.log("RAN");
            const data = await req.json();

            const user = await prisma.user.findUnique({
                where: {
                    id: data.id
                }
            });

            if (!user || user.id !== "662c8a917069d646e0af7982") {
                return NextResponse.json({Access: "Denied"})
            }

            await prisma.product.create({data: data.product});          

            return NextResponse.json({Access: "Success"});
        } catch (error) {
            console.error("Error occurred when adding product:", error);
            return NextResponse.error("Error occurred when adding product", 500);
        }
    }
}