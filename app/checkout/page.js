"use client"

import React, { useState } from 'react';
import Link from 'next/link';

const Checkout = () => {
    let quantity = 0;
    let totalOrder = 0;
    
    return (
        <main>
            <div className='checkout-page'>
                <div className='checkout-detail'>
                    <h1>Checkout</h1>
                    <div className='mailing-address'>
                        <p>Mailing Address</p>
                        <p className='name'>Full Name</p>
                        <p className='address'>Address line1</p>
                        <p className='area'>City, State, ZIPCODE</p>
                        <p className='country'>Country</p>
                        <Link href='/'>change address</Link>
                    </div>

                    <div className='payment-method'>
                        <p>Payment Method</p>
                        <label>Card Number:</label> <br></br>
                        <input type='text' className='cardHolder'></input><br></br> 
                        <label>Card Holder Name:</label> <br></br>
                        <input type='text' className='cardHolder'></input><br></br> 
                        <label>Card Expiration Date:</label><br></br> 
                        <input type='text' placeholder="month" className='exp'></input>
                        <input type='text' placeholder="year" className='exp'></input>
                        <input type='text' placeholder="3-digit CVV" className='exp'></input>
                    </div>

                    <button>Finish Checkout</button>

                </div>

                <div className="order-summary">
                    <p>Order Summary</p>
                    <p>Quantity: {quantity}</p>
                    <p>Order Total: {totalOrder}</p>
                </div>

            </div>
        </main>                  
    )
}

export default Checkout