"use client"

import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping } from '@fortawesome/free-solid-svg-icons';

const Orders = () => {
    const [dateRange, setDateRange] = useState("");

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

    function createOrderCard(order) {
        const orderCard = document.createElement("div");
        orderCard.classList.add("your-order-cards");
    
        const orderTopBar = document.createElement("div");
        orderTopBar.classList.add("your-order-card-top-bar");
    
        const topBarCont1 = document.createElement("div")
        topBarCont1.classList.add("your-order-top-bar-cont");
        const topBarCont1p1 = document.createElement("p");
        topBarCont1p1.textContent = "ORDER PLACED";
        topBarCont1.appendChild(topBarCont1p1);
        const topBarCont1p2 = document.createElement("p");
        topBarCont1p2.textContent = "Some Date";
        topBarCont1.appendChild(topBarCont1p2);

        orderTopBar.appendChild(topBarCont1);
    
        const topBarCont2 = document.createElement("div");
        topBarCont2.classList.add("your-order-top-bar-cont2");

        const topBarCont2p1 = document.createElement("p");
        topBarCont2p1.textContent = "TOTAL";
        topBarCont2.appendChild(topBarCont2p1);
        const topBarCont2p2 = document.createElement("p");
        topBarCont2p2.textContent = "$100";
        topBarCont2.appendChild(topBarCont2p2);

        orderTopBar.appendChild(topBarCont2);
    
        const orderMain = document.createElement("div");
        orderMain.classList.add("order-card-main");
    
        const mainLeft = document.createElement("div");
        mainLeft.classList.add("order-card-main-left");
        const image = document.createElement("img");
        image.src = "/profileheadsetimg.png";
        image.sizes = "100vw";
        image.width = "90";
        image.height = "90";
        image.style.width = "90px";
        image.style.height = "90px";
        mainLeft.appendChild(image);
        orderMain.appendChild(mainLeft);
    
        const mainMiddle = document.createElement("div");
        mainMiddle.classList.add("order-card-main-middle");
        const link = document.createElement("a");
        link.href = "/signin";
        link.textContent = "JanSport Right Pack Backpack - Travel, Work, or Laptop Bookbag with Leather Bottom, Black";
        mainMiddle.appendChild(link);
        const button = document.createElement("button");
        button.textContent = "Buy Again";

        mainMiddle.appendChild(button);
        orderMain.appendChild(mainMiddle);
    
        const mainRight = document.createElement("div");
        mainRight.classList.add("order-card-main-right");
        const trackOrderButton = document.createElement("button");
        trackOrderButton.textContent = "Track your order";
        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancel your order";
        mainRight.appendChild(trackOrderButton);
        mainRight.appendChild(cancelButton);
        orderMain.appendChild(mainRight);
    
        orderCard.appendChild(orderTopBar);
        orderCard.appendChild(orderMain);
    
        return orderCard;
    }    

    const handleSelectChange = (event) => {
        setDateRange(event.target.value);
        const userDataString = getCookie("userData");
        const userData = JSON.parse(userDataString);
        const orderLogEntry = userData.orderlog[0];
        const orderDate = orderLogEntry.date;
        console.log(orderDate);
    };

    const [initialRender, setInitialRender] = useState(true);
    useEffect(() => {
        if (!initialRender) { // Prevent double callback
            const userDataString = getCookie("userData");
            if (userDataString) {
                //console.log(JSON.parse(userDataString).orderlog[0]);
                document.querySelector(".your-order-container").appendChild(createOrderCard(JSON.parse(userDataString).orderlog[0]));
            } else {
                window.location.href = "/signin";
            }
        } else {
            setInitialRender(false);
        }
    }, [initialRender]);

    return (
        <main>
            <div className="orders-screen">
                <div className="your-order-container">
                    <ol className="custom-list">
                        <li>
                            <Link href="/profile" id="backToProfile">Your Account</Link>
                        </li>
                        <li>
                            <p>Your Orders</p>
                        </li>
                    </ol>
                    <h1>Your Orders</h1>
                    <div className="your-order-filter">
                        <label>Orders placed in</label>
                        <select className="past-order-drop-down" value={dateRange} onChange={handleSelectChange}>
                            <option value="30 days">last 30 days</option>
                            <option value="3 months">past 3 months</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                        </select>
                    </div>

                    {/* <div className="your-order-cards">
                        <div className="your-order-card-top-bar">
                            <div className="your-order-top-bar-cont">
                                <p>ORDER PLACED</p>
                                <p>May 5, 2023</p>
                            </div>
                            <div className="your-order-top-bar-cont2">
                                <p>TOTAL</p>
                                <p>$70.42</p>
                            </div>
                        </div>
                        <div className="order-card-main">
                            <div className="order-card-main-left">
                                <Image src="/profileheadsetimg.png" sizes="100vw" width={0} height={0} style={{width: "90px", height: "90px"}}></Image>
                            </div>
                            <div className="order-card-main-middle">
                                <Link href="/signin">JanSport Right Pack Backpack - Travel, Work, or Laptop Bookbag with Leather Bottom, Black</Link>
                                <button><FontAwesomeIcon icon={faBagShopping} />Buy Again</button>
                            </div>
                            <div className="order-card-main-right">
                                <button>Track your order</button>
                                <button>Cancel your order</button>
                            </div>
                        </div>
                        <div className="order-card-main">
                            <div className="order-card-main-left">
                                <Image src="/profileheadsetimg.png" sizes="100vw" width={0} height={0} style={{width: "90px", height: "90px"}}></Image>
                            </div>
                            <div className="order-card-main-middle">
                                <Link href="/signin">JanSport Right Pack Backpack - Travel, Work, or Laptop Bookbag with Leather Bottom, Black</Link>
                                <button><FontAwesomeIcon icon={faBagShopping} />Buy Again</button>
                            </div>
                            <div className="order-card-main-right">
                                <button>Track your order</button>
                                <button>Cancel your order</button>
                            </div>
                        </div>
                    </div> */}

                    
                </div>
            </div>
        </main>
    )
}

export default Orders