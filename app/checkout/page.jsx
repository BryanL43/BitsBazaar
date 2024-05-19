"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

import { getCookie, setCookie } from '../utils/cookies';

const Checkout = () => {
    const router = useRouter();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [subtotal, setSubtotal] = useState(0.0);
    const [itemCount, setItemCount] = useState(0);

    const [foundAddress, setFoundAddress] = useState(false);
    const [addAddressObj, setAddAddressObj] = useState({
        country_reg: "",
        phone_num: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        default: false
    });

    const getProduct = async (prodId, qnt) => {
        try {
            const url = `/api/products/` + prodId;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response.ok) {
                const responseData = await response.json();
                setSubtotal(prevSubtotal => prevSubtotal + parseFloat(responseData.product.price) * qnt);
                setItemCount(prevItemCount => prevItemCount + parseInt(qnt));
            } else {
                console.log("Acquiring Product Failed");
            }
        } catch (error) {
            console.log("Error occured when acquiring product:", error);
        }
    }

    const [initialRender, setInitialRender] = useState(true);
    useEffect(() => {
        if (!initialRender) { // Prevent double callback
            const userDataString = getCookie("userData");
            if (userDataString) {
                const userData = JSON.parse(userDataString);
                setFirstName(userData.firstName);
                setLastName(userData.lastName);
                if (JSON.parse(userDataString).addresses[0]) {
                    setFoundAddress(true);
                    const defaultAddress = userData.addresses.find(address => JSON.parse(address).default === "true");
                    setAddAddressObj(JSON.parse(defaultAddress))
                } else {
                    setFoundAddress(false);
                }

                JSON.parse(userDataString).cart.forEach(product => {
                    getProduct(JSON.parse(product).productId, JSON.parse(product).quantity);
                })

                if (JSON.parse(userDataString).cart.length <= 0) { //No cart item then redirect back to cart
                    router.push("/cart");
                }
            } else {
                router.push("/signin");
            }
        } else {
            setInitialRender(false);
        }
    }, [initialRender]);

    const checkoutapi = async () => {
        try {
            const url = "/api/users/checkout";

            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user: JSON.parse(getCookie("userData")),
                })
            })

            if (response.ok) {
                await response.json();
                router.push("/profile");
            } else {
                console.log("Check Out Failed");
            }
        } catch (error) {
            console.log("Error occured when checking out:", error);
        }
    }

    const checkedout = () => {
        if (foundAddress) {
            const userData = JSON.parse(getCookie("userData"))
            userData.cart.forEach(item => {
                userData.orderlog.push(JSON.stringify({ item, date: new Date() }));
            })
            userData.cart = [];

            setCookie("userData", JSON.stringify(userData), 1);
            checkoutapi();
        } else {
            alert("Please add a delivery address to checkout!");
        }
    }

    return (
        <main>
            <div className='checkout-page'>
                <div className='checkout-detail'>
                    <h1>Checkout</h1>

                    <div className="address-grid-container">
                        {foundAddress ? (
                            <div className="address-card">
                                <ul>
                                    <li><p><strong>{firstName + " " + lastName}</strong></p></li>
                                    <li><p>{addAddressObj["address"]}</p></li>
                                    <li><p>{addAddressObj["city"] + ", " + addAddressObj["state"] + " " + addAddressObj["zip_code"]}</p></li>
                                    <li><p>{addAddressObj["country_reg"]}</p></li>
                                    <li><p>Phone number: {addAddressObj["phone_num"]}</p></li>
                                </ul>
                                <div className="address-bottom-bar"><Link href='/profile?address'>Change address</Link></div>
                            </div>
                        ) : (
                            <div className="address-card">
                                <FontAwesomeIcon icon={faCircleExclamation} id="noAddressIcon" />
                                <div className="address-bottom-bar"><Link href='/profile?address'>Add delivery address</Link></div>
                            </div>
                        )}

                    </div>

                    <div className='payment-method'>
                        <p>Payment Method</p>
                        <label>Card Number:</label> <br></br>
                        <input type='text' className='cardHolder'></input><br></br>
                        <label>Card Holder Name:</label> <br></br>
                        <input type='text' className='cardHolder'></input><br></br>
                        <label>Card Expiration Date:</label><br></br>
                        <input type='text' placeholder="month" className='exp'></input>
                        <input type='text' placeholder="year" className='exp'></input>
                        <input type='text' placeholder="3-digit CVV" className='exp'></input>
                    </div>

                    <button onClick={checkedout}>Finish Checkout</button>

                </div>

                <div className="checkout-info order-summary">
                    <p>Order Summary:</p>
                    <p>Quantity of items: {itemCount}</p>
                    <p>Order total: <strong>${subtotal.toFixed(2)}</strong></p>
                </div>

            </div>
        </main>
    )
}

export default Checkout