"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShop } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

import { getCookie, setCookie } from '@/app/utils/cookies';

const Product = ({ params }) => {
    const router = useRouter();
    const productId = params.id;

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

    const getProduct = async () => {
        try {
            const url = `/api/products/${productId}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (!response.ok) {
                throw new Error("No product acquisition response.");
            }

            const responseData = await response.json();
            if (responseData.success === true && responseData.product) {
                setProductObj(responseData.product);
            } else {
                router.push("/catalogue?search=all");
            }
        } catch (error) {
            console.log("Error occured when acquiring product:", error);
            router.push("/catalogue?search=all");
        }
    }

    const addToCart = async (event) => {
        event.preventDefault();
        if (!getCookie("userData")) { //If user is not signed in for adding to cart
            window.sessionStorage.setItem("to-add-to-cart", window.location.href.split("/product/")[1]);
            router.push("/signin");
            return;
        }

        try {
            const url = "/api/users/cart";

            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: JSON.parse(getCookie("userData")).id,
                    product: productId,
                    quantity: qty
                })
            })

            if (!response.ok) {
                throw new Error("Adding to cart failed.");
            }

            const responseData = await response.json();
            if (responseData.success === true && responseData.user) {
                setCookie("userData", JSON.stringify(responseData.user), 1);
                router.push("/cart");
            } else {
                router.push("/catalogue?search=all");
            }
        } catch (error) {
            console.log("Error occured when adding to cart:", error)
        }
    }

    //Mount product info on page render
    useEffect(() => {
        getProduct();
    }, []);

    return (
        <main>
            <div className="product-page">
                <Link id="back-link" href="" onClick={() => { window.history.back() }}><FontAwesomeIcon icon={faShop} />Return back to catalogue</Link>
                <div className="product-page-container">
                    <div className='product-image'>
                        <div id='a'>
                            <button id="imgSwitchBtn" onClick={() => { imgIndex <= 0 ? setImgIndex(1) : setImgIndex(0) }}>&lt;</button>
                            {productObj["images"][imgIndex] ? (
                                <Image
                                    src={productObj["images"][imgIndex]}
                                    width={300}
                                    height={300}
                                    style={{
                                        maxWidth: "666px",
                                        maxHeight: "437px",
                                        width: "100%",
                                        height: "auto",
                                        objectFit: "contain"
                                    }}
                                    alt={`Image of ${productObj["name"]}`}
                                />
                            ) : (
                                <div>Loading...</div> //Placeholder content while the image src is not available
                            )}

                            <button id="imgSwitchBtn" onClick={() => { imgIndex >= 1 ? setImgIndex(0) : setImgIndex(1) }}>&gt;</button>
                        </div>
                        {/* this is to make the small pictures in the bottom */}
                        <div className='image-thumbs'>
                            {productObj["images"][0] ? (
                                <Image src={productObj["images"][0]} width={300} height={300} className='image1' alt={`Image of ${productObj["name"]} 1`} onClick={() => setImgIndex(0)}></Image>
                            ) : (
                                <div>Loading...</div> //Placeholder content while the image src is not available
                            )}

                            {productObj["images"][1] ? (
                                <Image src={productObj["images"][1]} width={300} height={300} className='image1' alt={`Image of ${productObj["name"]} 2`} onClick={() => setImgIndex(1)}></Image>
                            ) : (
                                <div>Loading...</div> //Placeholder content while the image src is not available
                            )}
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