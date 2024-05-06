"use client"

import React, { useState, useEffect } from 'react';

const Product = () => {
    const price1 = 21.99;
    const [i, setQuantity] = useState(0);

    const myPictures = [
        {
            label: "picture 1",
            imgPath: "laptop1.jpeg"
        },
        {
            label: "picture 2",
            imgPath: "laptop2.jpeg"
        },
    ]

    const [isActive1, setIsActive1] = useState(true);
    const [isActive2, setIsActive2] = useState(true);

    const [initialRender, setInitialRender] = useState(true);
    useEffect(() => {
        if (!initialRender) {
            getProduct();
        } else {
            setInitialRender(false);
        }
    })

    function goLeft(e) {
        if(i > 0) {
            setQuantity(i - 1);
            setIsActive1(false);
            setIsActive2(true);
        } else {
            setQuantity(0);
            setIsActive1(true);
            setIsActive2(false);
        }
    }

    function goRight(e) {
        if(i < [...myPictures].length - 1) {
            setQuantity(i + 1);
            setIsActive1(true);
            setIsActive2(false);
        } else {
            setQuantity(0);
            setIsActive1(true);
            setIsActive2(false);
        }
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
                console.log(responseData);
            } else {
                console.log("Acquiring Product Failed");
            }
        } catch (error) {
            console.log("Error occured when acquiring product:", error)
        }
    }

    return (
        <main className='product-page'>
            <div className='product-image'>
                <div id='a'>
                    <button onClick={goLeft}>&lt;</button>
                    <img src={myPictures[i].imgPath} alt={myPictures[i].label}></img>
                    <button onClick={goRight}>&gt;</button>
                </div>
                {/* this is to make the small pictures in the bottom */}
                <div className='image-thumbs'>
                    <img src='laptop1.jpeg' className='image1'></img>
                    <img src='laptop2.jpeg' className='image1'></img>
                </div>
            </div>

            <div className='product-detail'>
                <h1 id="name">Name of Product</h1>
                <p id='detail'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                <p id="product-price">${price1}</p>
                <label>Qty: </label> <input type='number' min={0}></input>
                <button>Add to Cart</button>
            </div>
        </main>
    )
}

export default Product