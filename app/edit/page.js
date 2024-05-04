"use client"

import Link from 'next/link';
import React, { useState } from 'react'

const Edit = () => {


    return (
        <main>
            <div className="profile-screen">
                <div className="edit-address-container">
                    <ol className="custom-list">
                        <li>
                            <Link href="/profile" id="backToProfile">Your Account</Link>
                        </li>
                        <li>
                            <p>Your Addresses</p>
                        </li>
                    </ol>
                    <h1>Your Addresses</h1>
                    <div className="address-grid-container">
                        <div className="address-card">
                            <div className="address-top-bar">
                                <p><strong>Default Address</strong></p>
                            </div>
                            <ul>
                                <li><p><strong>Bryan Lee</strong></p></li>
                                <li><p>451 GREEN ST APT B</p></li>
                                <li><p>SAN FRANCISCO, CA 94133-4001</p></li>
                                <li><p>United States</p></li>
                                <li><p>Phone number: 4156238183</p></li>
                            </ul>
                            <div className="address-bottom-bar">
                                <Link href="/address" id="address-first-link">Edit</Link>
                                <Link href="/address">Remove</Link>
                            </div>
                        </div>
                        <div className="address-card">
                            <ul>
                                <li><p><strong>Bryan Lee</strong></p></li>
                                <li><p>451 GREEN ST APT B</p></li>
                                <li><p>SAN FRANCISCO, CA 94133-4001</p></li>
                                <li><p>United States</p></li>
                                <li><p>Phone number: 4156238183</p></li>
                            </ul>
                            <div className="address-bottom-bar">
                                <Link href="/address" id="address-first-link">Edit</Link>
                                <Link href="/address">Remove</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Edit