"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Catalogue = () => {

    const price1 = 19.99;

    return (
        <main className='catalogue-page'>
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
                    <img src='laptop1.jpeg' alt='image of item'></img>
                    <p className='title-item'>Name of Item</p>
                    <p className='price-item'>${price1}</p>
                    <p className='detail=item'>Detail: This is the detail of this particular item</p>
                    <button>View Details</button>
                </div>

                <div className='items-card'>
                    <img src='laptop1.jpeg' alt='image of item'></img>
                    <p className='title-item'>Name of Item</p>
                    <p className='price-item'>${price1}</p>
                    <p className='detail=item'>Detail: This is the detail of this particular item</p>
                    <button>View Details</button>
                </div>

                <div className='items-card'>
                    <img src='laptop1.jpeg' alt='image of item'></img>
                    <p className='title-item'>Name of Item</p>
                    <p className='price-item'>${price1}</p>
                    <p className='detail=item'>Detail: This is the detail of this particular item</p>
                    <button>View Details</button>
                </div>

                <div className='items-card'>
                    <img src='laptop1.jpeg' alt='image of item'></img>
                    <p className='title-item'>Name of Item</p>
                    <p className='price-item'>${price1}</p>
                    <p className='detail=item'>Detail: This is the detail of this particular item</p>
                    <button>View Details</button>
                </div>

                <div className='items-card'>
                    <img src='laptop1.jpeg' alt='image of item'></img>
                    <p className='title-item'>Name of Item</p>
                    <p className='price-item'>${price1}</p>
                    <p className='detail=item'>Detail: This is the detail of this particular item</p>
                    <button>View Details</button>
                </div>

                <div className='items-card'>
                    <img src='laptop1.jpeg' alt='image of item'></img>
                    <p className='title-item'>Name of Item</p>
                    <p className='price-item'>${price1}</p>
                    <p className='detail=item'>Detail: This is the detail of this particular item</p>
                    <button>View Details</button>
                </div>

                <div className='items-card'>
                    <img src='laptop1.jpeg' alt='image of item'></img>
                    <p className='title-item'>Name of Item</p>
                    <p className='price-item'>${price1}</p>
                    <p className='detail=item'>Detail: This is the detail of this particular item</p>
                    <button>View Details</button>
                </div>

                <div className='items-card'>
                    <img src='laptop1.jpeg' alt='image of item'></img>
                    <p className='title-item'>Name of Item</p>
                    <p className='price-item'>${price1}</p>
                    <p className='detail=item'>Detail: This is the detail of this particular item</p>
                    <button>View Details</button>
                </div>

                <div className='items-card'>
                    <img src='laptop1.jpeg' alt='image of item'></img>
                    <p className='title-item'>Name of Item</p>
                    <p className='price-item'>${price1}</p>
                    <p className='detail=item'>Detail: This is the detail of this particular item</p>
                    <button>View Details</button>
                </div>

                <div className='items-card'>
                    <img src='laptop1.jpeg' alt='image of item'></img>
                    <p className='title-item'>Name of Item</p>
                    <p className='price-item'>${price1}</p>
                    <p className='detail=item'>Detail: This is the detail of this particular item</p>
                    <button>View Details</button>
                </div>
            
            </div>
        </main>
    )
}

export default Catalogue