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

        //Helper function to reformat address fields
        const reformatField = (field) => {
            return capitalizeWords(body.address[field]);
        };

        //Reformat each field
        const formatted_coun = reformatField('country_reg');
        const formatted_add = reformatField('address');
        const formatted_city = reformatField('city');
        const formatted_state = body.address.state.toUpperCase();

        //Create the reformatted address object
        const reformatAddress = {
            country_reg: formatted_coun,
            phone_num: body.address.phone_num,
            address: formatted_add,
            city: formatted_city,
            state: formatted_state,
            zip_code: body.address.zip_code,
            default: body.address.default.toString()
        };

        //Update existing addresses if any, else create a new array with the new address
        const addressesData = user.addresses && user.addresses.length > 0 ? user.addresses.map(address => JSON.parse(address)) : [];

        if (addressesData.length === 0) {
            reformatAddress.default = "true"
        }

        const newAddressesData = addressesData.map(addressData => {
            if (reformatAddress.default === "true") {
                addressData.default = "false";
            }
            return addressData;
        });

        const combinedAddressesData = [...newAddressesData, reformatAddress];

        //Update user with the new addresses
        await prisma.user.update({
            where: {
                id: body.id
            },
            data: {
                addresses: {
                    set: combinedAddressesData.map(address => JSON.stringify(address))
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
        console.error("Error occurred when adding address:", error);
        return NextResponse.error("Error occurred when adding address", 500);
    }
}