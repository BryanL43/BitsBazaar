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

        const addresses = user.addresses.map(addressString => JSON.parse(addressString));

        //Set all default to false first
        addresses.forEach(address => {
            address.default = false;
        });

        //Set the new default
        addresses[body.index].default = "true";

        //Update the user with the modified addresses
        await prisma.user.update({
            where: {
                id: body.id
            },
            data: {
                addresses: addresses.map(address => JSON.stringify(address))
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

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error("Error occurred during editing address:", error);
        return NextResponse.error("Error occurred during editing address", 500);
    }
}