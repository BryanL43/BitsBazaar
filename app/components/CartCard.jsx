"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { getCookie, setCookie } from '../utils/cookies'

const CartCard = ({ id, name, price, qty, images, setSubtotal, setItemCount, removeFromCart }) => {
    const [cardQty, setCardQty] = useState(qty);

    //React required handler for pass-by-reference
    const handleSetSubtotal = (val) => {
        setSubtotal(val);
    }

    const handleSetItemCount = (val) => {
        setItemCount(val);
    }

    const updateCart = async () => {
        try {
            const url = "/api/users/cart";
            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user: JSON.parse(getCookie("userData")),
                })
            })

            if (response.ok) {
                const responseData = await response.json();
                return true;
            } else {
                console.log("Updating Cart Failed");
            }
        } catch (error) {
            console.log("Error occured when updating user's cart:", error);
        }
        return false;
    }

    const deleteHandler = () => {
        const userData = JSON.parse(getCookie("userData"));
        const cartData = userData.cart.map(JSON.parse);

        //Find the index of the product in the cart
        const productIndex = cartData.findIndex(product => product.productId === id);
        if (productIndex !== -1) {
            const deletedQuantity = parseInt(cartData[productIndex].quantity);

            //Remove the product from the cart
            cartData.splice(productIndex, 1);

            // Update the subtotal
            handleSetSubtotal(prevSubtotal => parseFloat((prevSubtotal - (parseFloat(price) * deletedQuantity)).toFixed(2)));

            //Update the cookie with the new cart data
            userData.cart = cartData.map(JSON.stringify);
            setCookie("userData", JSON.stringify(userData), 1);

            removeFromCart(id, deletedQuantity);

            handleSetItemCount(prevItemCount => prevItemCount - deletedQuantity);

            updateCart();
        }
    }

    const qtyHandler = () => {
        if (cardQty < 1) {
            setCardQty(1);
        } else {
            setCardQty(cardQty);
            const userData = JSON.parse(getCookie("userData"));
            const cartData = userData.cart.map(JSON.parse);

            //Find the product in the cart
            const productIndex = cartData.findIndex(product => product.productId === id);
            if (productIndex !== -1) {
                //Get the previous quantity
                const previousQuantity = parseInt(cartData[productIndex].quantity);

                //Update the quantity of the product
                cartData[productIndex].quantity = cardQty;

                //Recalculate subtotal
                const quantityChange = cardQty - previousQuantity;
                setSubtotal(prevSubtotal => parseFloat((prevSubtotal + (parseFloat(price) * quantityChange)).toFixed(2)));

                //Update the cookie with the new cart data
                userData.cart = cartData.map(JSON.stringify);
                setCookie("userData", JSON.stringify(userData), 1);

                setItemCount(prevItemCount => prevItemCount + quantityChange);

                updateCart();

                //Cooldown for updating
                const qtyInputEl = document.querySelector('.qtyInput');
                qtyInputEl.disabled = true;
                setTimeout(() => {
                    qtyInputEl.disabled = false;
                }, 750);
            }
        }
    }

    return (
        <div className="cart-card-main">
            <div className="cart-card-main-left">
                <Image src={images[0]} sizes="100vw" width={0} height={0} style={{ width: "90px", height: "90px" }} alt={name}></Image>
            </div>
            <div className="cart-card-main-middle">
                <Link href={"/product/" + id}>{name}</Link>
                <div className="cartQty">
                    <label>Quantity: </label>
                    <input className="qtyInput" type='number' min={1} value={cardQty} onChange={(e) => { setCardQty(e.target.value) }} onBlur={(e) => { qtyHandler() }} required></input><p><strong>${price}</strong></p>
                </div>
            </div>
            <div className="cart-card-main-right">
                <button onClick={deleteHandler}>Delete</button>
            </div>
        </div>
    )
}

export default CartCard