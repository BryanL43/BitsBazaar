"use client"

import React, { useState, useEffect, useRef, useReducer } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faCircleHalfStroke, faCartShopping, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import Image from 'next/image';

import { useTheme } from './ThemeProvider';
import { getCookie, deleteCookie } from '../utils/cookies';

const Navbar = () => {
    const router = useRouter()
    const { toggleTheme } = useTheme();
    const [itemCount, setItemCount] = useState(0)
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0); //Force re-render due to some state undesired behavior

    //Handle Drop Down Buttons
    const [isUserDropOpen, setIsUserDropOpen] = useState("none");
    const [isCartDropOpen, setIsCartDropOpen] = useState("none");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchVal, setSearchVal] = useState("");


    //Independent cookie handler so not seperated. Operates under cart dropdown to not have repeated looped updates.
    const previousCookieValue = useRef(null);

    function checkCookieChange() {
        const userDataString = getCookie("userData");
        if (userDataString && userDataString !== previousCookieValue.current) {
            //Render user drop down
            setIsLoggedIn(true);
            forceUpdate();

            //Render cart drop down
            const userData = JSON.parse(userDataString);
            setItemCount(0);
            userData.cart.forEach(item => {
                setItemCount(prevItemCount => prevItemCount + parseInt(JSON.parse(item).quantity));
            });
            previousCookieValue.current = userDataString;
        }
    }

    //Initial DOM Loaded data acquisition
    useEffect(() => {
        setItemCount(0); //Prevent double render logic error
        const userDataString = getCookie("userData");
        if (userDataString) {
            setIsLoggedIn(true);
            const userData = JSON.parse(userDataString);
            userData.cart.forEach(item => {
                setItemCount(prevItemCount => prevItemCount + parseInt(JSON.parse(item).quantity));
            });
        } else {
            setIsLoggedIn(false);
            previousCookieValue.current = null;
        }
    }, []);

    //Drop down handlers
    const handleUserDropDown = () => {
        setIsCartDropOpen("none");
        checkCookieChange();
        setIsUserDropOpen(`${isUserDropOpen === "none" ? "block" : "none"}`);
    }

    const handleCartDropDown = () => {
        setIsUserDropOpen("none");
        checkCookieChange();
        setIsCartDropOpen(`${isCartDropOpen === "none" ? "block" : "none"}`);
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            router.push("/catalogue?search=" + searchVal)
        }
    };

    return (
        <nav className="navBar">
            <Link href="/"><Image src="/logo.png" width={132} height={34} alt="BitBazaar Logo"></Image></Link>
            <input className="searchBar" type="text" placeholder="Search" autoComplete="off" value={searchVal} onChange={(e) => setSearchVal(e.target.value)} onKeyDown={handleKeyDown} />
            <Link id="searchIcon" href="/catalogue" onClick={() => { router.push("/catalogue?search=" + searchVal) }}><FontAwesomeIcon icon={faMagnifyingGlass} /></Link>
            <button id="themeToggleBtn" onClick={toggleTheme}>
                <FontAwesomeIcon icon={faCircleHalfStroke} />
            </button>
            <div className="userDropDown">
                <button id="userBtn" onClick={handleUserDropDown}>
                    <FontAwesomeIcon icon={faUser} />
                </button>
                <div className="userDropDown-content" style={{ display: `${isUserDropOpen}` }}>
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
                            <Link id="dropDown-A" href="/profile">
                                <h5>Your Profile</h5>
                                <p>Edit your account or see your orders.</p>
                            </Link>
                            <Link id="dropDown-A" href="/signin" onClick={() => {
                                handleUserDropDown();
                                setIsLoggedIn(false);
                                setItemCount(0);
                                deleteCookie("userData");
                                window.sessionStorage.removeItem("to-add-to-cart");
                                window.sessionStorage.removeItem("quantity")
                                previousCookieValue.current = null;
                            }}>
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
                <div className="cartDropDown-content" style={{ display: `${isCartDropOpen}` }}>
                    <div id="cartDropDownOpaque" onClick={handleCartDropDown}></div>
                    <Link id="dropDown-B" href="/cart">
                        <h5>Your BitsBazaar Carts</h5>
                    </Link>
                    <Link id="dropDown-B" href="/cart">
                        <h5>Cart ({itemCount} items)</h5>
                        <p>Click here to see your subtotal.</p>
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
