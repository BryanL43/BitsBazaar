import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/Client";
import { parse } from 'url';

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
    } else if (type === "updatecart") {
        try {
            const data = await req.json();

            const user = await prisma.user.findUnique({
                where: {
                    id: data.user.id
                }
            });

            if (!user) {
                return NextResponse.error("User not found", 404);
            }

            await prisma.user.update({
                where: {
                    id: data.user.id
                },
                data: {
                    cart: data.user.cart
                }
            });
            return NextResponse.json({});
        } catch (error) {
            console.error("Error occurred when updating user's cart:", error);
            return NextResponse.error("Error occurred when updating user's cart", 500);
        }
    } else if (type === "checkout") {
        try {
            const data = await req.json();

            const user = await prisma.user.findUnique({
                where: {
                    id: data.user.id
                }
            });

            if (!user) {
                return NextResponse.error("User not found", 404);
            }

            await prisma.user.update({
                where: {
                    id: data.user.id
                },
                data: {
                    cart: data.user.cart,
                    orderlog: data.user.orderlog
                }
            });
            
            return NextResponse.json({}); //Empty response as data is already updated rapidly on cookie
        } catch (error) {
            console.error("Error occurred when checking out:", error);
            return NextResponse.error("Error occurred when checking out", 500);
        }
    }
}