"use client"

import React, { useState } from 'react';
import Link from 'next/link';

const Cart = () => {
  
    let price1 = 29.99;
    let price2 = 19.99;
    let price3 = 5.99;
  
    const [quantity1, setQuantity1] = useState(0);
    const [quantity2, setQuantity2] = useState(0);
    const [quantity3, setQuantity3] = useState(0);
  
  
    const plus1 = () => {
      setQuantity1(quantity1 + 1);
    }
  
    const minus1 = () => {
      if( quantity1 > 0) {
        setQuantity1(quantity1 - 1);
      }
    }
  
    const plus2 = () => {
      setQuantity2(quantity2 + 1);
    }
  
    const minus2 = () => {
      if( quantity2 > 0) {
        setQuantity2(quantity2 - 1);
      }
    }
  
    const plus3 = () => {
      setQuantity3(quantity3 + 1);
    }
  
    const minus3 = () => {
      if( quantity3 > 0) {
        setQuantity3(quantity3 - 1);
      }
    }
  
    let totalPrice = (price1 * quantity1) + (price2 * quantity2) + (price3 * quantity3);
      
  
    return (
        <main>
            <div className='cart'>
                <div className='shoppingCart'>
                    <h1>Shopping cart</h1>
                    <div className='card'>
                        <img src="/logo.png" alt="test" />
                        <div className='description'>
                            <p>Name of Item</p>
                            <p>Price of item: {price1}</p>
                            <p>Quantity {quantity1}</p>
                            <button className='plus' onClick={plus1}>+</button> <button className='minus' onClick={minus1}>-</button> 
                        </div>
                    </div>

                    <div className='card'>
                        <img src="/logo.png" alt="test" />
                        <div className='description'>
                            <p>Name of Item</p>
                            <p>Price of item: {price2}</p>
                            <p>Quantity {quantity2}</p> 
                            <button className='plus' onClick={plus2}>+</button> <button className='minus' onClick={minus2}>-</button>
                        </div>
                    </div>

                    <div className='card'>
                        <img src="/logo.png" alt="test" />
                        <div className='description'>
                            <p>Name of Item</p>
                            <p>Price of item: {price3}</p>
                            <p>Quantity {quantity3}</p>
                            <button className='plus' onClick={plus3}>+</button> <button className='minus' onClick={minus3}>-</button> 
                        </div>
                    </div>

                    <div className='moreItems'>
                        <Link href="/">Add more items ?</Link>
                    </div>
                </div>

                <div className='checkout'>
                    <p>total: {totalPrice}</p>
                    <button>Checkout</button>
                </div>

            </div>
          </main>
    )
}

export default Cart