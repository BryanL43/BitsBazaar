"use client"

import Link from 'next/link';
import React, { useState } from 'react'
import Image from 'next/image';

const Profile = () => {

    const bannerRedirect = () => {
        window.location.href = '/signin';
    }

    const laptopRedirect = () => {
        window.location.href = '/signin';
    }

    const pcRedirect = () => {
        window.location.href = '/signin';
    }

    const accessoriesRedirect = () => {
        window.location.href = '/signin';
    }

    return (
        <main>
            <div className="profile-screen">
                <div className="profile-container">
                    <div className="profile-left-side">
                        <h1 id="yourAccText">Your Account</h1>
                        <h2 id="yourAccWelcomeText">Welcome, Bryan Lee</h2>
                        <div className="profile-banner-card">
                            <div className="profile-banner-top-bar">
                                <h3>Start Browsing</h3>
                                <Link href="/signin">View catalog</Link>
                            </div>
                            <div className="profile-banner-main" onClick={bannerRedirect}>
                                <Image className="profile-banner-img" src="/profilebanner.png" alt="Start browsing BitsBazaar" width={0} height={0} sizes="100vw" style={{width: "100%", height: "100%"}}/>
                                <p className="banner-text-1">Find the technology you need</p>
                                <p className="banner-text-2">Shop BitsBazaar</p>
                            </div>
                        </div>
                        <div className="profile-quick-browse-card">
                            <div className="quick-browse-top-bar">
                                <h3>Quick Browse</h3>
                            </div>
                            <div className="quick-browse-container" onClick={laptopRedirect}>
                                <div className="quick-browse-content">
                                    <Image src="/profilelaptopimg.png" alt="Browse Laptop Catagory" width={0} height={0} sizes="100vw" style={{width: "33%", height: "100%"}}/>
                                    <h3>High-Quality Laptops</h3>
                                </div>
                                <div className="quick-browse-content" onClick={pcRedirect}>
                                    <Image src="/profilepcimg.png" alt="Browse Gaming PC Catagory" width={0} height={0} sizes="100vw" style={{width: "33%", height: "100%"}}/>
                                    <h3>Gaming PC</h3>
                                </div>
                                <div className="quick-browse-content" onClick={accessoriesRedirect}>
                                    <Image src="/profileheadsetimg.png" alt="Browse Accessories Catagory" width={0} height={0} sizes="100vw" style={{width: "33%", height: "100%"}}/>
                                    <h3>Accessories</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="profile-right-side">
                        <div className="profile-setting-content">
                            <Image src="/profileEdit.png" alt="Edit login, name, email, and password" width={0} height={0} sizes="100vw" style={{width: "66px", height: "66px"}}/>
                            <div className="profile-setting-content-inner">
                                <h2>Personal Information</h2>
                                <p>Edit login credentials, name, and email address</p>
                            </div>
                        </div>
                        <div className="profile-setting-content">
                            <Image src="/profileOrder.png" alt="Edit login, name, email, and password" width={0} height={0} sizes="100vw" style={{width: "66px", height: "66px"}}/>
                            <div className="profile-setting-content-inner">
                                <h2>Your Orders</h2>
                                <p>See purchase history, track, or cancel an order</p>
                            </div>
                        </div>
                        <div className="profile-setting-content">
                            <Image src="/profileAddress.png" alt="Edit login, name, email, and password" width={0} height={0} sizes="100vw" style={{width: "66px", height: "66px"}}/>
                            <div className="profile-setting-content-inner">
                                <h2>Your Addresses</h2>
                                <p>Edit, remove, or set default address</p>
                            </div>
                        </div>
                        <div className="profile-setting-content">
                            <Image src="/profilePayment.png" alt="Edit login, name, email, and password" width={0} height={0} sizes="100vw" style={{width: "66px", height: "66px"}}/>
                            <div className="profile-setting-content-inner">
                                <h2>Your Payments</h2>
                                <p>Edit or add payment method</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Profile