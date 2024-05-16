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

        //Helper function to capitalize the first letter of each word
        const capitalizeWords = (str) => {
            return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
                return a.toUpperCase();
            });
        };

        //Reformat function for address fields
        const reformatField = (field) => {
            return capitalizeWords(body.address[field]);
        };

        //Convert address strings to objects
        const addresses = user.addresses.map(addressString => JSON.parse(addressString));

        //Check if the edited address has default set to true
        const isDefaultTrue = body.address.default === true;

        //Update all other addresses of the user to have default set to false if necessary
        if (isDefaultTrue) {
            addresses.forEach(address => {
                address.default = false;
            });
        }

        //Reformat fields
        const formatted_coun = reformatField('country_reg');
        const formatted_add = reformatField('address');
        const formatted_city = reformatField('city');
        const formatted_state = body.address.state.toUpperCase();

        // Create the reformatted address object
        const reformatAddress = {
            country_reg: formatted_coun,
            phone_num: body.address.phone_num,
            address: formatted_add,
            city: formatted_city,
            state: formatted_state,
            zip_code: body.address.zip_code,
            default: body.address.default.toString()
        };

        // Update the indexed address
        addresses[body.index] = reformatAddress;

        //Check if there exist an existing default address, else set the first index to true
        let thereExistDefault = false;
        addresses.forEach(address => {
            if (address.default === true) {
                thereExistDefault = true;
                return;
            }
        })
        
        //If no existing default address then set the first one to true. There should exist a address to change else there is a significant logic error.
        if (!thereExistDefault) {
            addresses[0].default = "true";
        }

        // Update the user with the modified addresses
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