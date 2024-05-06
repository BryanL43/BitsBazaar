import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/Client";
import { parse } from 'url';
import { Resend } from 'resend';

const resend = new Resend("re_GMWC3jMX_92c9tR4ex1ZYY8Prmbu22bre");

export async function GET(req) {
    const { query } = parse(req.url, true);
    const { type, email, password, code, oldemail, search, filter } = query;

    if (type === "signin") {
        try {
            const findUser = await prisma.user.findUnique({
                where: {
                    email: email,
                    password: password
                }
            })
    
            if (findUser) {
                const userData = {
                    id: findUser.id,
                    firstName: findUser.firstName,
                    lastName: findUser.lastName,
                    user: findUser.email,
                    addresses: findUser.addresses
                }

                return NextResponse.json(userData);
            } else {
                return NextResponse.json({user: "Not found"});
            }
        } catch (error) {
            console.error("Error occurred during sign in:", error);
            return NextResponse.error("Error occurred when signing in", 500);
        }
    } else if (type === "forgotpassword") {
        try {
            const foundEmail = await prisma.user.findUnique({
                where: {
                    email: email
                }
            })
    
            if (foundEmail) {

                try {
                    const randomCode = String(Math.floor(Math.random() * 900000) + 100000);
                    const expirationTime = new Date();
                    expirationTime.setMinutes(expirationTime.getMinutes() + 5);
                    const newCode = await prisma.ResetCode.create({
                        data: {
                            code: randomCode,
                            expiresAt: expirationTime
                        }
                    });
                    await newCode;

                    return NextResponse.json({email: email});
                } catch (error) {
                    console.error("Error occurred during reset code creation:", error);
                    return NextResponse.error("Error occurred during reset code creation", 500);
                }
                
                /*
                (async function () {
                    const { data, error } = await resend.emails.send({
                        from: 'Acme <onboarding@resend.dev>',
                        // from: 'Acme <no-reply@bitsbazaar.com>', This will be added once I verify the vercel domain
                        to: [email],
                        subject: "This is a Test",
                        html: "<strong>Assume this is your reset token.</strong>"
                    });
                  
                    if (error) {
                      return console.error({ error });
                    }
                  
                    console.log({ data });
                  })();*/
            } else {
                return NextResponse.json({email: "Not found"});
            }
        } catch (error) {
            console.error("Error occurred during finding email:", error);
            return NextResponse.error("Error occurred when finding email", 500);
        }
    } else if (type === "verifycode") {
        try {
            const foundCode = await prisma.ResetCode.findUnique({
                where: {
                    code: code
                }
            })

            if (foundCode) {
                //Delete consumed reset code
                await prisma.ResetCode.delete({
                    where: {
                        code: code
                    }
                });

                return NextResponse.json({code: code});
            } else {
                return NextResponse.json({code: "Not found"});
            }

        } catch (error) {
            console.error("Error occurred during verifying code:", error);
            return NextResponse.error("Error occurred when verifying code", 500);
        }
    } else if (type === "changeemailcode") {
        try {
            const randomCode = String(Math.floor(Math.random() * 900000) + 100000);
            const expirationTime = new Date();
            expirationTime.setMinutes(expirationTime.getMinutes() + 5);
            const newCode = await prisma.ResetCode.create({
                data: {
                    code: randomCode,
                    expiresAt: expirationTime
                }
            });
            await newCode;

            return NextResponse.json({code_sent: "Successful"});
        } catch (error) {
            console.error("Error occurred during reset code creation:", error);
            return NextResponse.error("Error occurred during reset code creation", 500);
        }
    } else if (type === "newemailverifycode") {
        try {
            const foundCode = await prisma.ResetCode.findUnique({
                where: {
                    code: code
                }
            })

            if (foundCode) {
                //Delete consumed reset code
                await prisma.ResetCode.delete({
                    where: {
                        code: code
                    }
                });
                
                //Update the user's email
                const updatedUser = await prisma.User.update({
                    where: {
                        email: oldemail
                    },
                    data: {
                        email: email
                    }
                });

                return NextResponse.json({code: code});
            } else {
                return NextResponse.json({code: "Not found"});
            }

        } catch (error) {
            console.error("Error occurred during verifying code:", error);
            return NextResponse.error("Error occurred when verifying code", 500);
        }
    } else if (type === "getproducts") {
        let searchKey = !search || search === "undefined" ? "all" : search;
        let filterKey = !filter || filter === "undefined" ? "none" : filter;

        if (filterKey !== "none" && searchKey !== "all") { //With search and filter key
            const filteredProducts = await prisma.product.findMany({
                where: {
                    tags: {
                        hasSome: filterKey.split(",")
                    }
                }
            });

            // Filter products based on search keywords
            const searchedProducts = filteredProducts.filter(product => {
                const productName = product.name.toLowerCase();
                const productDetail = product.detail.toLowerCase();
                const searchKeyLower = searchKey.toLowerCase();

                //Check if product name or detail contains search keywords
                return productName.includes(searchKeyLower) || productDetail.includes(searchKeyLower);
            });

            return NextResponse.json({ products: searchedProducts })
        } else if (filterKey !== "none") { //filter case
            const filteredProducts = await prisma.product.findMany({
                where: {
                    tags: {
                        hasSome: filterKey.split(",")
                    }
                }
            });
            return NextResponse.json({ products: filteredProducts });
        } else if (searchKey !== "all") { // Search case
            const allProducts = await prisma.product.findMany();

            // Filter products based on search keywords
            const searchedProducts = allProducts.filter(product => {
                const productName = product.name.toLowerCase();
                const productDetail = product.detail.toLowerCase();
                const searchKeyLower = searchKey.toLowerCase();

                //Check if product name or detail contains search keywords
                return productName.includes(searchKeyLower) || productDetail.includes(searchKeyLower);
            });

            return NextResponse.json({ products: searchedProducts });
        } else if (searchKey === "all") { //Retrieve all products from the database
            const allProducts = await prisma.product.findMany();
            return NextResponse.json({ products: allProducts });
        } else { //Error case
            return NextResponse.json({});
        }
    }
}

export async function POST(req) {
    const { query } = parse(req.url, true);
    const { type } = query;

    if (type === "register") {
        try {
            const data = await req.json();
            const newUser = await prisma.user.create({ data });

            return NextResponse.json(newUser);
        } catch (error) {
            console.error("Error occurred during user creation:", error);
            return NextResponse.error("Error occurred during user creation", 500);
        }
    } else if (type === "changepwd") {
        try {
            const {email, newPassword } = await req.json();
            
            //Find user by email
            const user = await prisma.user.findUnique({
                where: {
                    email: email
                }
            });

            if (!user) {
                return NextResponse.error("User not found", 404);
            }

            //Update password
            await prisma.user.update({
                where: {
                    email: email
                },
                data: {
                    password: newPassword
                }
            })

            return NextResponse.json({changed: "True"});
        } catch (error) {
            console.error("Error occurred during password change:", error);
            return NextResponse.error("Error occurred during password change", 500);
        }
    } else if (type === "changefirstname") {
        try {
            const data = await req.json();

            const user = await prisma.user.findUnique({
                where: {
                    id: data.id
                }
            });

            if (!user) {
                return NextResponse.error("User not found", 404);
            }

            //Update first name
            await prisma.user.update({
                where: {
                    id: data.id
                },
                data: {
                    firstName: data.firstName
                }
            })

            //Return new updated data
            const findUser = await prisma.user.findUnique({
                where: {
                    id: data.id
                }
            });

            const userData = {
                id: findUser.id,
                firstName: findUser.firstName,
                lastName: findUser.lastName,
                user: findUser.email,
                addresses: findUser.addresses
            }

            return NextResponse.json(userData);
        } catch (error) {
            console.error("Error occurred during first name change:", error);
            return NextResponse.error("Error occurred during first name change", 500);
        }
    } else if (type === "changelastname") {
        try {
            const data = await req.json();

            const user = await prisma.user.findUnique({
                where: {
                    id: data.id
                }
            });

            if (!user) {
                return NextResponse.error("User not found", 404);
            }

            //Update first name
            await prisma.user.update({
                where: {
                    id: data.id
                },
                data: {
                    lastName: data.lastName
                }
            })

            //Return new updated data
            const findUser = await prisma.user.findUnique({
                where: {
                    id: data.id
                }
            });

            const userData = {
                id: findUser.id,
                firstName: findUser.firstName,
                lastName: findUser.lastName,
                user: findUser.email,
                addresses: findUser.addresses
            }

            return NextResponse.json(userData);
        } catch (error) {
            console.error("Error occurred during first name change:", error);
            return NextResponse.error("Error occurred during first name change", 500);
        }
    } else if (type === "addaddress") {
        try {
            const data = await req.json();

            const user = await prisma.user.findUnique({
                where: {
                    id: data.id
                }
            });

            if (!user) {
                return NextResponse.error("User not found", 404);
            }

            //Reformat country/region
            let word1 = data.address.country_reg.toLowerCase().split(' ');
            word1 = word1.map(word1 => word1.charAt(0).toUpperCase() + word1.slice(1));
            let formatted_coun = word1.join(' ');

            //Reformat address
            let word2 = data.address.address.toLowerCase().split(' ');
            word2 = word2.map(word2 => word2.charAt(0).toUpperCase() + word2.slice(1));
            let formatted_add = word2.join(' ');

            //Reformat City
            let word3 = data.address.city.toLowerCase().split(' ');
            word3 = word3.map(word3 => word3.charAt(0).toUpperCase() + word3.slice(1));
            let formatted_city = word3.join(' ');

            //Reformat state
            let formatted_state = data.address.state.toUpperCase();

            const reformatAddress = {
                country_reg: formatted_coun,
                phone_num: data.address.phone_num,
                address: formatted_add,
                city: formatted_city,
                state: formatted_state,
                zip_code: data.address.zip_code,
                default: data.address.default.toString()
            }
            
            // Add address
            if (user.addresses && user.addresses.length > 0) {
                //If addresses array already exists, update existing addresses
                const addressesData = user.addresses.map(address => JSON.parse(address));
                
                const newAddressesData = addressesData.map(addressData => {
                    if (reformatAddress.default === "true") {
                        addressData.default = "false";
                    }
                    return addressData;
                });

                const combinedAddressesData = [...newAddressesData, reformatAddress];

                // Update user with the new addresses
                await prisma.user.update({
                    where: {
                        id: data.id
                    },
                    data: {
                        addresses: {
                            set: combinedAddressesData.map(address => JSON.stringify(address))
                        }
                    }
                });
            } else { //If no existing array, create a new addresses array with the new address
                reformatAddress.default = "true"; //override
                await prisma.user.update({
                    where: {
                        id: data.id
                    },
                    data: {
                        addresses: {
                            push: JSON.stringify(reformatAddress)
                        } 
                    }
                });
            }

            //Return new updated data
            const findUser = await prisma.user.findUnique({
                where: {
                    id: data.id
                }
            });

            const userData = {
                id: findUser.id,
                firstName: findUser.firstName,
                lastName: findUser.lastName,
                user: findUser.email,
                addresses: findUser.addresses
            }

            return NextResponse.json(userData);
        } catch (error) {
            console.error("Error occurred during adding address:", error);
            return NextResponse.error("Error occurred during adding address", 500);
        }
    } else if (type === "editaddress") {
        try {
            const data = await req.json();

            const user = await prisma.user.findUnique({
                where: {
                    id: data.id
                }
            });

            if (!user) {
                return NextResponse.error("User not found", 404);
            }

            const addresses = user.addresses.map(addressString => JSON.parse(addressString));

            //Check if the edited address has default set to true
            if (data.address.default === true) {
                //Update all other addresses of the user to have default set to false
                addresses.forEach(address => {
                    address.default = false;
                });
            }

            //Reformat country/region
            let word1 = data.address.country_reg.toLowerCase().split(' ');
            word1 = word1.map(word1 => word1.charAt(0).toUpperCase() + word1.slice(1));
            let formatted_coun = word1.join(' ');

            //Reformat address
            let word2 = data.address.address.toLowerCase().split(' ');
            word2 = word2.map(word2 => word2.charAt(0).toUpperCase() + word2.slice(1));
            let formatted_add = word2.join(' ');

            //Reformat City
            let word3 = data.address.city.toLowerCase().split(' ');
            word3 = word3.map(word3 => word3.charAt(0).toUpperCase() + word3.slice(1));
            let formatted_city = word3.join(' ');

            //Reformat state
            let formatted_state = data.address.state.toUpperCase();

            const reformatAddress = {
                country_reg: formatted_coun,
                phone_num: data.address.phone_num,
                address: formatted_add,
                city: formatted_city,
                state: formatted_state,
                zip_code: data.address.zip_code,
                default: data.address.default.toString()
            }

            //update the indexed one
            addresses[data.index] = reformatAddress;

            //Update the user with the modified addresses
            await prisma.user.update({
                where: {
                    id: data.id
                },
                data: {
                    addresses: addresses.map(address => JSON.stringify(address))
                }
            });

            //Return new updated data
            const findUser = await prisma.user.findUnique({
                where: {
                    id: data.id
                }
            });

            const userData = {
                id: findUser.id,
                firstName: findUser.firstName,
                lastName: findUser.lastName,
                user: findUser.email,
                addresses: findUser.addresses
            }

            return NextResponse.json(userData);
        } catch (error) {
            console.error("Error occurred during editing address:", error);
            return NextResponse.error("Error occurred during editing address", 500);
        }
    } else if (type === "removeaddress") {
        try {
            const data = await req.json();

            const user = await prisma.user.findUnique({
                where: {
                    id: data.id
                }
            });

            if (!user) {
                return NextResponse.error("User not found", 404);
            }

            const addresses = user.addresses.map(addressString => JSON.parse(addressString));

            //Remove the address at the specified index
            addresses.splice(data.index, 1)[0];

            //If the removed address is the default, set all addresses' default to false
            if (data.address.default === "true") {
                addresses.forEach(address => {
                    address.default = false;
                });
            }

            //If the removed address was the default or the list is empty, set the first address as the new default
            if (data.address.default === "true" || addresses.length === 0) {
                if (addresses.length > 0) {
                    addresses[0].default = "true";
                }
            }

            //Update the user with the modified addresses
            await prisma.user.update({
                where: {
                    id: data.id
                },
                data: {
                    addresses: addresses.map(address => JSON.stringify(address))
                }
            });

            //Return new updated data
            const findUser = await prisma.user.findUnique({
                where: {
                    id: data.id
                }
            });

            const userData = {
                id: findUser.id,
                firstName: findUser.firstName,
                lastName: findUser.lastName,
                user: findUser.email,
                addresses: findUser.addresses
            }

            return NextResponse.json(userData);
        } catch (error) {
            console.error("Error occurred during editing address:", error);
            return NextResponse.error("Error occurred during editing address", 500);
        }
    } else if (type === "newdefaultaddress") {
        try {
            const data = await req.json();

            const user = await prisma.user.findUnique({
                where: {
                    id: data.id
                }
            });

            if (!user) {
                return NextResponse.error("User not found", 404);
            }

            const addresses = user.addresses.map(addressString => JSON.parse(addressString));

            //Set all default to false first
            addresses.forEach(address => {
                address.default = false;
            });

            //Set the new default
            addresses[data.index].default = "true";

            //Update the user with the modified addresses
            await prisma.user.update({
                where: {
                    id: data.id
                },
                data: {
                    addresses: addresses.map(address => JSON.stringify(address))
                }
            });

            //Return new updated data
            const findUser = await prisma.user.findUnique({
                where: {
                    id: data.id
                }
            });

            const userData = {
                id: findUser.id,
                firstName: findUser.firstName,
                lastName: findUser.lastName,
                user: findUser.email,
                addresses: findUser.addresses
            }

            return NextResponse.json(userData);
        } catch (error) {
            console.error("Error occurred during editing address:", error);
            return NextResponse.error("Error occurred during editing address", 500);
        }
    } else if (type === "addproduct") {
        try {
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
