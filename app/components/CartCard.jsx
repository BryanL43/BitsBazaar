"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const CartCard = ({ id, name, price, qty, images }) => {

    //Switch to PATCH, DELETE
    const updateCart = async() => {
        try {
            const url = "/api?type=updatecart";
            const response = await fetch(url, {
                method: "POST",
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
                console.log("Add To Cart Failed");
            }
        } catch(error) {
            console.log("Error occured when updating user's cart:", error);
        }
        return false;
    }

    const deleteHandler = () => {
        const productId = info.id;
        const userData = JSON.parse(getCookie("userData"));
        const cartData = userData.cart.map(JSON.parse);

        //Find the index of the product in the cart
        const productIndex = cartData.findIndex(product => product.productId === productId);
        if (productIndex !== -1) {
            const deletedQuantity = parseInt(cartData[productIndex].quantity);

            //Remove the product from the cart
            cartData.splice(productIndex, 1);

            // Update the subtotal
            setSubtotal(prevSubtotal => parseFloat((prevSubtotal - (parseFloat(info.price) * deletedQuantity)).toFixed(2)));

            //Update the cookie with the new cart data
            userData.cart = cartData.map(JSON.stringify);
            setCookie("userData", JSON.stringify(userData), 1);

            cartCard.remove();

            setItemCount(prevItemCount => prevItemCount - deletedQuantity);

            updateCart();
        }
    }

    return (
        <div className="cart-card-main">
            <div className="cart-card-main-left">
                <Image src={images[0]} sizes="100vw" width={0} height={0} style={{width: "90px", height: "90px"}} alt={name}></Image>
            </div>
            <div className="cart-card-main-middle">
                <Link href="/signin">{name}</Link>
                <div className="cartQty">
                    <label>Quantity: </label>
                    <input className="qtyInput" type='number' min={1} value={qty} required></input><p><strong>${price}</strong></p>
                </div>
            </div>
            <div className="cart-card-main-right">
                <button onClick={deleteHandler}>Delete</button>
            </div>
        </div>
    )
}

export default CartCard