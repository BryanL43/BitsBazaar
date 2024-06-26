"use client"

import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useRef, useEffect, useReducer } from 'react'
import { useRouter } from 'next/navigation';

import { getCookie } from '../utils/cookies';
import CartCard from '../components/CartCard';

const Cart = () => {
    const router = useRouter();
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0); //Force re-render due to some state undesired behavior

    const [cartData, setCartData] = useState([]);

    useEffect(() => { //Prevent cart from opening when not signed in
        const userDataString = JSON.parse(getCookie("userData"))
        if (!userDataString) {
            router.push("/signin");
        }
    }, [router]);

    const [subtotal, setSubtotal] = useState(0.0);
    const [itemCount, setItemCount] = useState(0);

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

    const handleRemoveFromCart = (productId, deletedQuantity) => {
        forceUpdate();

        let found = false;
        let updated = [];

        cartData.forEach(item => {
            if (!found && item.id === productId && parseInt(item.quantity) === deletedQuantity) { //Deleted a cart item where there are multiple same item and quantity check
                found = true; 
            } else {
                updated.push(item);
            }
        });

        setCartData(updated);
    }

    const handleCheckOut = () => {
        if (cartData.length > 0) {
            router.push("/checkout");
        } else {
            alert("No items in cart. Start browsing and add items.");
        }
    }

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
                                    key={Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) + 1} //To resolve silent error, but serves no purpose to functionality.
                                    id={product.id}
                                    name={product.name}
                                    price={product.price}
                                    qty={product.quantity}
                                    images={product.images}
                                    setSubtotal={setSubtotal}
                                    setItemCount={setItemCount}
                                    removeFromCart={handleRemoveFromCart}
                                />
                            ))}

                        </div>
                        <div className="checkout-info">
                            <p>Subtotal ({itemCount} item): <strong>${subtotal.toFixed(2)}</strong></p>
                            <button onClick={handleCheckOut}>Proceed to checkout</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Cart