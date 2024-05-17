import { NextResponse } from "next/server";
import prisma from "@/prisma/Client";

//Add to cart API Handler
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

        //Create product obj
        const prod_To_Add = {
            productId: body.product,
            quantity: body.quantity
        }

        //Add product to cart
        const updatedCartData = user.cart && user.cart.length > 0 ?
            [...user.cart.map(products => JSON.parse(products)), prod_To_Add] :
            [prod_To_Add];

        await prisma.user.update({
            where: {
                id: body.id
            },
            data: {
                cart: {
                    set: updatedCartData.map(products => JSON.stringify(products))
                }
            }
        });

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
        console.error("Error occurred when adding to cart:", error);
        return NextResponse.error("Error occurred when adding to cart", 500);
    }
}

//Update cart API Handler
export async function PATCH(req) {
    try {
        const body = await req.json();

        const user = await prisma.user.findUnique({
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
                cart: body.user.cart
            }
        });
        return NextResponse.json({});
    } catch (error) {
        console.error("Error occurred when updating user's cart:", error);
        return NextResponse.error("Error occurred when updating user's cart", 500);
    }
}