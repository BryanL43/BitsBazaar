"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Product = () => {
    const price1 = 21.99;
    const [i, setQuantity] = useState(0);

    if(i == 0) {

    }

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

    function goLeft(e) {
        if(i > 0) {
            setQuantity(i - 1);
            setIsActive1(false);
            setIsActive2(true);
        }
    }

    function goRight(e) {
        if(i < [...myPictures].length - 1) {
            setQuantity(i + 1);
            setIsActive1(true);
            setIsActive2(false);
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
                <p id='name'>Name of Product</p>
                <p id='detail'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                <p>${price1}</p>
                <label>Qty: </label> <input type='number' min={0}></input>
                <button>Add to Cart</button>
            </div>
        </main>
    )
}

export default Product