"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faCircleHalfStroke, faCartShopping, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {
    const { toggleTheme } = useTheme();

    //Handle Drop Down Buttons
    const [isUserDropOpen, setIsUserDropOpen] = useState("none");
    const [isCartDropOpen, setIsCartDropOpen] = useState("none");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchVal, setSearchVal] = useState("");

    //Cookie Handler:
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

    function deleteCookie(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    //Initial DOM Loaded data acquisition
    useEffect(() => {
        const userDataString = getCookie("userData");
        if (userDataString) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleUserDropDown = () => {
        setIsCartDropOpen("none");
        setIsUserDropOpen(`${isUserDropOpen === "none" ? "block" : "none"}`);
    }

    const handleCartDropDown = () => {
        setIsUserDropOpen("none");
        setIsCartDropOpen(`${isCartDropOpen === "none" ? "block" : "none"}`);
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            window.location.href = "/catalogue?search=" + searchVal;
        }
    };
    
    return (
        <nav className="navBar">
            <Link href="/"><img src='/logo.png' style={{ height: '34px' }} alt="BitBazaar Logo" /></Link>
            <input className="searchBar" type="text" placeholder="Search" autoComplete="off" value={searchVal} onChange={(e) => setSearchVal(e.target.value)} onKeyDown={handleKeyDown} />
            <Link id="searchIcon" href="/catalogue" onClick={() => {window.location.href = "/catalogue?search=" + searchVal}}><FontAwesomeIcon icon={faMagnifyingGlass} /></Link>
            <button id="themeToggleBtn" onClick={toggleTheme}>
                <FontAwesomeIcon icon={faCircleHalfStroke} />
            </button>
            <div className="userDropDown">
                <button id="userBtn" onClick={handleUserDropDown}>
                    <FontAwesomeIcon icon={faUser} />
                </button>
                <div className="userDropDown-content" style={{display: `${isUserDropOpen}`}}>
                    <div id="userDropDownOpaque" onClick={handleUserDropDown}></div>
                    {!isLoggedIn && (
                        <React.Fragment>
                            <Link id="dropDown-A" href="/register" onClick={handleUserDropDown}>
                                <h5>Create Account</h5>
                                <p>Place orders quickly and easily.</p>
                            </Link>
                            <Link id="dropDown-A" href="/signin" onClick={handleUserDropDown}>
                                <h5>Log in</h5>
                                <p>Already a existing user? Welcome back.</p>
                            </Link>
                        </React.Fragment>
                    )}
                    {isLoggedIn && (
                        <React.Fragment>
                            <Link id="dropDown-A" href="/profile" onClick={() => {window.location.href = '/profile';}}>
                                <h5>Your Profile</h5>
                                <p>Edit your account or see your orders.</p>
                            </Link>
                            <Link id="dropDown-A" href="/signin" onClick={() => {handleUserDropDown(); setIsLoggedIn(false); deleteCookie("userData");}}>
                                <h5>Sign Out</h5>
                                <p>Sign out of current account.</p>
                            </Link>
                        </React.Fragment>
                    )}
                </div>
            </div>
            <div className="cartDropDown">
                <button id="cartBtn" onClick={handleCartDropDown}>
                    <FontAwesomeIcon icon={faCartShopping} />
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
