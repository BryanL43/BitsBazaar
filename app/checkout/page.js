"use client"

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link';

const Checkout = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [subtotal, setSubtotal] = useState(0.0);
    const [itemCount, setItemCount] = useState(0);

    const [addAddressObj, setAddAddressObj] = useState({
        country_reg: "",
        phone_num: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        default: false
    });

    function getCookie(name) {
        var nameEQ = name + "=";
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1, cookie.length);
            }
            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length, cookie.length);
            }
        }
        return null;
    }

    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    const getProduct = async(prodId, qnt) => {
        try {
            const url = `/api?type=getproductbyid&productId=${prodId}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response.ok) {
                const responseData = await response.json();
                setSubtotal(prevSubtotal => prevSubtotal + parseFloat(responseData.price) * qnt);
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

                const defaultAddress = userData.addresses.find(address => JSON.parse(address).default === "true");
                setAddAddressObj(JSON.parse(defaultAddress))

                JSON.parse(getCookie("userData")).cart.forEach(product => {
                    getProduct(JSON.parse(product).productId, JSON.parse(product).quantity);
                })
            } else {
                window.location.href = "/signin";
            }
        } else {
            setInitialRender(false);
        }
    }, [initialRender]);

    const checkedout = () => {
        const userData = JSON.parse(getCookie("userData"))
        userData.cart.forEach(item => {
            userData.orderlog.push(item);
        })
        userData.cart = [];

        setCookie("userData", JSON.stringify(userData), 1);
    }

    return (
        <main>
            <div className='checkout-page'>
                <div className='checkout-detail'>
                    <h1>Checkout</h1>

                    <div className="address-grid-container">
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