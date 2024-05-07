"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShop } from '@fortawesome/free-solid-svg-icons';

const Product = () => {
    const [qty, setQty] = useState(0);
    const [imgIndex, setImgIndex] = useState(0);
    const [productObj, setProductObj] = useState({
        id: "",
        name: "",
        price: "",
        detail: "",
        tags: [],
        images: [],
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

    const getProduct = async() => {
        try {
            const productId = window.location.href.split("?id=")[1].toString();
            const url = `/api?type=getproductbyid&productId=${productId}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response.ok) {
                const responseData = await response.json();
                setProductObj(responseData);
            } else {
                console.log("Acquiring Product Failed");
                window.location.href = "/catalogue?search=all"
            }
        } catch (error) {
            console.log("Error occured when acquiring product:", error);
            window.location.href = "/catalogue?search=all";
        }
    }

    const addToCart = async(event) => {
        event.preventDefault();
        if (!getCookie("userData")) { //If user is not signed in for adding to cart
            window.sessionStorage.setItem("to-add-to-cart", window.location.search.split("?id=")[1]);
            window.location.href = "/signin";
            return;
        }

        try {
            const url = "/api?type=addtocart";

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: JSON.parse(getCookie("userData")).id,
                    product: window.location.search.split("?id=")[1],
                    quantity: qty
                })
            })

            if (response.ok) {
                const responseData = await response.json();
                setCookie("userData", JSON.stringify(responseData), 1);
                window.location.href = "/cart";         
            } else {
                console.log("Add To Cart Failed");
            }
        } catch (error) {
            console.log("Error occured when adding to cart:", error)
        }
    }

    const [initialRender, setInitialRender] = useState(true);
    useEffect(() => {
        if (!initialRender) { //prevent double callback
            getProduct();
        } else {
            setInitialRender(false);
        }
    }, [initialRender]);


    return (
        <main>
            <div className="product-page">
                <Link id="back-link" href="" onClick={() => {window.history.back()}}><FontAwesomeIcon icon={faShop} />Return back to catalogue</Link>
                <div className="product-page-container">
                    <div className='product-image'>
                        <div id='a'>
                            <button id="imgSwitchBtn" onClick={() => {imgIndex <= 0 ? setImgIndex(1) : setImgIndex(0)}}>&lt;</button>
                                <img src={productObj["images"][imgIndex]} alt={`Image of ${productObj["name"]}`}></img>
                            <button id="imgSwitchBtn" onClick={() => {imgIndex >= 1 ? setImgIndex(0) : setImgIndex(1)}}>&gt;</button>
                        </div>
                        {/* this is to make the small pictures in the bottom */}
                        <div className='image-thumbs'>
                            <img src={productObj["images"][0]} className='image1'></img>
                            <img src={productObj["images"][1]} className='image1'></img>
                        </div>
                    </div>

                    <div className='product-detail'>
                        <h1 id="name">{productObj["name"]}</h1>
                        <p id='detail'>{productObj["detail"]}</p>
                        <p id="product-price">{"$" + productObj["price"]}</p>
                        <form action="/profile" method="POST" onSubmit={addToCart}>
                            <label >Quantity: </label> <input className="qtyInput" type='number' min={1} onChange={(e) => setQty(e.target.value)} required></input>
                            <button>Add to Cart</button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Product