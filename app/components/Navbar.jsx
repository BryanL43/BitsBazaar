"use client"

import React, { useState } from 'react';
import Link from 'next/link';
// import { useTheme } from './ThemeProvider';

const Navbar = () => {
    //const { toggleTheme } = useTheme();

    //Handle Drop Down Buttons
    const [isUserDropOpen, setIsUserDropOpen] = useState("none");
    const [isCartDropOpen, setIsCartDropOpen] = useState("none");

    const handleUserDropDown = () => {
        setIsCartDropOpen("none");
        setIsUserDropOpen(`${isUserDropOpen === "none" ? "block" : "none"}`);
    }

    const handleCartDropDown = () => {
        setIsUserDropOpen("none");
        setIsCartDropOpen(`${isCartDropOpen === "none" ? "block" : "none"}`);
    }
    
    return (
        <nav className="navBar">
            <Link href="/"><img src='/logo.png' style={{ height: '34px' }} alt="BitBazaar Logo" /></Link>
            <input className="searchBar" type="text" placeholder="Search" autoComplete="off" />
            <Link id="searchIcon" href="/"><i className="glyphicon glyphicon-search"></i></Link>
            {/* <button id="themeToggleBtn" onClick={toggleTheme}> */}
            <button id="themeToggleBtn">
                <i className="glyphicon glyphicon-blackboard"></i>
            </button>
            <div className="userDropDown">
                <button id="userBtn" onClick={handleUserDropDown}>
                    <i className="glyphicon glyphicon-user"></i>
                </button>
                <div className="userDropDown-content" style={{display: `${isUserDropOpen}`}}>
                    <div id="userDropDownOpaque" onClick={handleUserDropDown}></div>
                    <Link id="dropDown-A" href="/register">
                        <h5>Create Account</h5>
                        <p>Place orders quickly and easily.</p>
                    </Link>
                    <Link id="dropDown-A" href="/signin">
                        <h5>Log in</h5>
                        <p>Already a existing user? Welcome back.</p>
                    </Link>
                </div>
            </div>
            <div className="cartDropDown">
                <button id="cartBtn" onClick={handleCartDropDown}>
                    <i className="glyphicon glyphicon-shopping-cart"></i>
                </button>
                <div className="cartDropDown-content" style={{display: `${isCartDropOpen}`}}>
                    <div id="cartDropDownOpaque" onClick={handleCartDropDown}></div>
                    <Link id="dropDown-B" href="/">
                        <h5>Your BitsBazaar Carts</h5>
                    </Link>
                    <Link id="dropDown-B" href="/">
                        <h5>Cart (0 items)</h5>
                        <p>Subtotal: <span className="subtotal-amount">$0.00</span></p>
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
