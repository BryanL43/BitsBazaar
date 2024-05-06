"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Catalogue = (query) => {
    const price1 = 19.99;
    
    //console.log(query.searchParams.search); //get the search
    //console.log(query.searchParams.filter); //get the filter keys

    /*
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

    const newProduct = {
        name: "Test Product",
        price: "10.99",
        detail: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
        tags: ["Graphics Card"],
        images: ["/rtx3060gpu.jpg", "/laptop1.jpeg"]
    };

    const addProduct = async() => {
        try {
            const url = "/api?type=addproduct";

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: JSON.parse(getCookie("userData")).id,
                    product: newProduct
                })
            })

            if (response.ok) {
                console.log("Adding Product API Invoked!");
            } else {
                console.log("Adding product API failed");
            }
        } catch (error) {
            console.log("Error occured adding product:", error)
        }
    }*/

    return (
        <main>
            <div className='catalogue-screen'>
                <div className="filterTopBar">
                    <h1>Filters</h1>
                    <p>Showing results for &apos;all&apos;</p>
                </div>
                <div className="main-catalogue-page">
                    <div className='filter'>
                        <div className='filter-card'>
                            <p>PC & Laptop</p>
                            <input type='checkbox'></input> <label>PC</label> <br></br>
                            <input type='checkbox'></input> <label>Laptop</label> <br></br>
                        </div>

                        <div className='filter-card'>
                            <p>PC Parts</p>
                            <input type='checkbox'></input> <label>Motherboard</label> <br></br>
                            <input type='checkbox'></input> <label>CPU</label> <br></br>
                            <input type='checkbox'></input> <label>RAM</label> <br></br>
                            <input type='checkbox'></input> <label>Graphics Card</label> <br></br>
                            <input type='checkbox'></input> <label>Hard Drive</label> <br></br>
                            <input type='checkbox'></input> <label>Power Supply</label> <br></br>
                        </div>

                        <div className='filter-card'>
                            <p>Accessories</p>
                            <input type='checkbox'></input> <label>Monitor</label> <br></br>
                            <input type='checkbox'></input> <label>Mouse</label> <br></br>
                            <input type='checkbox'></input> <label>Keyboard</label> <br></br>
                            <input type='checkbox'></input> <label>Audio Gear</label> <br></br>
                        </div>

                        <div className='filter-card'>
                            <p>Price filter</p>
                            <input type='checkbox'></input> <label>Less than $100</label> <br></br>
                            <input type='checkbox'></input> <label>$100 - $200</label> <br></br>
                            <input type='checkbox'></input> <label>$201 - $300</label> <br></br>
                            <input type='checkbox'></input> <label>$301 - $400</label> <br></br>
                            <input type='checkbox'></input> <label>$401 - $500</label> <br></br>
                            <input type='checkbox'></input> <label>more than $500</label> <br></br>
                        </div>
                    </div>

                    <div className='items'>
                        <div className='items-card'>
                            <Image src="/rtx3060gpu.jpg" sizes="100vw" width={0} height={0} style={{width: "auto", height: "auto", maxWidth: "95%", maxHeight: "224px"}} alt="RTX 3060 GPU"></Image>
                            <div className="items-card-text-content">
                                <Link href="/catalogue">Name of Item</Link>
                                <p className='price-item'>${price1}</p>
                                <p className='detail-item'>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Some sort of longer text added.</p>
                            </div>
                            <button>View Details</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Catalogue