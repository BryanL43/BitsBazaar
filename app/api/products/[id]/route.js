import { NextResponse } from "next/server";
import prisma from "@/prisma/Client";

export async function GET(req, {params}) {
    try {
        const product = await prisma.product.findUnique({
            where: {
                id: params.id
            }
        });

        if (!product) {
            return NextResponse.json({ success: false, error: "Product not found" });
        }

        return NextResponse.json({ success: true, product });
    } catch(error) {
        return NextResponse.json({ success: false, error: error.message });
    }
}