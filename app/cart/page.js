"use client"

import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation';

import { getCookie, setCookie } from '../utils/cookies';
import CartCard from '../components/CartCard';

const Cart = () => {
    const router = useRouter();

    const [cartData, setCartData] = useState([]);

    useEffect(() => { //Prevent cart from opening when not signed in
        const userDataString = JSON.parse(getCookie("userData"))
        if (!userDataString) {
            router.push("/signin");
        }
    }, []);

    const [subtotal, setSubtotal] = useState(0.0);
    const [itemCount, setItemCount] = useState(0);

    // const updateCart = async () => {
    //     try {
    //         const url = "/api?type=updatecart";

    //         const response = await fetch(url, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify({
    //                 user: JSON.parse(getCookie("userData")),
    //             })
    //         })

    //         if (response.ok) {
    //             const responseData = await response.json();
    //             return true;
    //         } else {
    //             console.log("Add To Cart Failed");
    //         }
    //     } catch (error) {
    //         console.log("Error occured when updating user's cart:", error);
    //     }
    //     return false;
    // }

    // function createCartCard(info, quantity) {
    //     //Create a new product card element
    //     const cartCard = document.createElement("div");
    //     cartCard.classList.add("cart-card-main");

    //     //Create LHS of card
    //     const cardLHS = document.createElement("div");
    //     cardLHS.classList.add("cart-card-main-left");

    //     //Create Image
    //     const cartImg = document.createElement("img");
    //     cartImg.src = info.images[0];
    //     cartImg.sizes = "100vw";
    //     cartImg.width = "0";
    //     cartImg.height = "0";
    //     cartImg.style = "width: 90px; height: 90px;"
    //     cartImg.alt = info.name;
    //     cardLHS.appendChild(cartImg);

    //     cartCard.appendChild(cardLHS);

    //     //Create Middle of card
    //     const cardMiddle = document.createElement("div");
    //     cardMiddle.classList.add("cart-card-main-middle");

    //     //Create link
    //     const nameLink = document.createElement("a");
    //     nameLink.href = "/product?id=" + info.id;
    //     nameLink.textContent = info.name;
    //     cardMiddle.appendChild(nameLink);

    //     //Create cartQty
    //     const cartQrtDiv = document.createElement("div");
    //     cartQrtDiv.classList.add("cartQty");

    //     //Create Label
    //     const qtyLabel = document.createElement("label");
    //     qtyLabel.textContent = "Quantity: ";
    //     cartQrtDiv.appendChild(qtyLabel);

    //     cardMiddle.appendChild(cartQrtDiv);

    //     //Create Input
    //     const qtyInputEl = document.createElement("input");
    //     qtyInputEl.classList.add("qtyInput");
    //     qtyInputEl.type = "number";
    //     qtyInputEl.min = 1;
    //     qtyInputEl.value = quantity;
    //     qtyInputEl.required = true;

    //     qtyInputEl.addEventListener('change', (event) => {
    //         qtyInputEl.disabled = true;
    //         const newQuantity = parseInt(event.target.value);
    //         const userData = JSON.parse(getCookie("userData"));
    //         const cartData = userData.cart.map(JSON.parse);
    //         const productId = info.id;

    //         //Find the product in the cart
    //         const productIndex = cartData.findIndex(product => product.productId === productId);
    //         if (productIndex !== -1) {
    //             //Get the previous quantity
    //             const previousQuantity = parseInt(cartData[productIndex].quantity);

    //             //Update the quantity of the product
    //             cartData[productIndex].quantity = newQuantity;

    //             //Recalculate subtotal
    //             const quantityChange = newQuantity - previousQuantity;
    //             setSubtotal(prevSubtotal => parseFloat((prevSubtotal + (parseFloat(info.price) * quantityChange)).toFixed(2)));

    //             //Update the cookie with the new cart data
    //             userData.cart = cartData.map(JSON.stringify);
    //             setCookie("userData", JSON.stringify(userData), 1);

    //             setItemCount(prevItemCount => prevItemCount + quantityChange);

    //             if (updateCart()) {
    //                 setTimeout(() => {
    //                     qtyInputEl.disabled = false;
    //                 }, 1000);
    //             }
    //         }
    //     });

    //     cartQrtDiv.appendChild(qtyInputEl);

    //     //Create p
    //     const priceP = document.createElement("p");
    //     const pricePStrong = document.createElement("strong");
    //     pricePStrong.textContent = "$" + info.price;
    //     priceP.appendChild(pricePStrong);
    //     cartQrtDiv.appendChild(priceP);

    //     cartCard.appendChild(cardMiddle);

    //     //Create RHS of card
    //     const RHSDiv = document.createElement("div");
    //     RHSDiv.classList.add("cart-card-main-right");

    //     //Create button
    //     const deleteBtn = document.createElement("button");
    //     deleteBtn.textContent = "Delete";

    //     deleteBtn.addEventListener("click", () => {
    //         const productId = info.id;
    //         const userData = JSON.parse(getCookie("userData"));
    //         const cartData = userData.cart.map(JSON.parse);

    //         //Find the index of the product in the cart
    //         const productIndex = cartData.findIndex(product => product.productId === productId);
    //         if (productIndex !== -1) {
    //             const deletedQuantity = parseInt(cartData[productIndex].quantity);

    //             //Remove the product from the cart
    //             cartData.splice(productIndex, 1);

    //             // Update the subtotal
    //             setSubtotal(prevSubtotal => parseFloat((prevSubtotal - (parseFloat(info.price) * deletedQuantity)).toFixed(2)));

    //             //Update the cookie with the new cart data
    //             userData.cart = cartData.map(JSON.stringify);
    //             setCookie("userData", JSON.stringify(userData), 1);

    //             cartCard.remove();

    //             setItemCount(prevItemCount => prevItemCount - deletedQuantity);

    //             updateCart();
    //         }
    //     })

    //     RHSDiv.appendChild(deleteBtn);

    //     cartCard.appendChild(RHSDiv);

    //     return cartCard;
    // }

    const getProduct = async(prodId, qnt) => {
        try {
            const url = `/api/products/${prodId}`;

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
                const productWithQuantity = { ...responseData.product, quantity: qnt };
                setCartData(prevCartData => [...prevCartData, productWithQuantity]);
                setSubtotal(prevSubtotal => prevSubtotal + parseFloat(responseData.product.price) * qnt);
                setItemCount(prevItemCount => prevItemCount + parseInt(qnt));
            }
        } catch (error) {
            console.log("Error occured when acquiring product:", error);
        }
    }

    const [initialRender, setInitialRender] = useState(true);
    useEffect(() => {
        if (!initialRender) { //prevent double callback
            const userData = JSON.parse(getCookie("userData"));
            if (userData && userData.cart) {
                userData.cart.forEach(product => {
                    const parsedProduct = JSON.parse(product);
                    getProduct(parsedProduct.productId, parsedProduct.quantity);
                });
            }
        } else {
            setInitialRender(false);
        }
    }, [initialRender]);

    return (
        <main>
            <div className="cart-screen">
                <div className="cart-container">
                    <ol className="custom-list">
                        <li>
                            <Link href="/profile" id="backToProfile">Your Account</Link>
                        </li>
                        <li>
                            <p>Shopping Cart</p>
                        </li>
                    </ol>
                    <h1>Shopping Cart</h1>
                    <div className="cart-flex">
                        <div className="cart-cards" style={{ opacity: itemCount === 0 ? 0 : 1 }}>

                            {cartData.map(product => (
                                <CartCard
                                    key={product.productId}
                                    id={product.id}
                                    name={product.name}
                                    price={product.price}
                                    qty={product.quantity}
                                    images={product.images}
                                />
                            ))}

                        </div>
                        <div className="checkout-info">
                            <p>Subtotal ({itemCount} item): <strong>${subtotal.toFixed(2)}</strong></p>
                            <button onClick={() => window.location.href = "/checkout"}>Proceed to checkout</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Cart