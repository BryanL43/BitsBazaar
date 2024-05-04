"use client"

import Link from 'next/link';
import React, { useState } from 'react'

const Edit2 = () => {


    return (
        <main>
            <div className="profile-screen">
                <div className="edit-address-comp-container">
                    <ol className="custom-list">
                        <li>
                            <Link href="/profile" id="backToProfile">Your Account</Link>
                        </li>
                        <li>
                            <Link href="/profile" id="backToProfile">Your Addresses</Link>
                        </li>
                        <li>
                            <p>Edit Address</p>
                        </li>
                    </ol>
                    <h1>Edit Your Address</h1>
                    <form className="edit-address-container-2" action="/edit2" method="GET">
                        <div className="component-address-edit">
                            <label><strong>Country/Region</strong></label>
                            <input type="text" className="address-edit-input" required />
                        </div>
                        <div className="component-address-edit">
                            <label><strong>Full Name (First and Last name)</strong></label>
                            <input type="text" className="address-edit-input" required />
                        </div>
                        <div className="component-address-edit">
                            <label><strong>Phone number</strong></label>
                            <input type="text" className="address-edit-input" required />
                        </div>
                        <div className="component-address-edit">
                            <label><strong>Address</strong></label>
                            <input type="text" className="address-edit-input" required />
                        </div>
                        <div className="component-address-edit component-address-edit-type2">
                            <div>
                                <label><strong>City</strong></label>
                                <input type="text" className="address-edit-input address-edit-input-override" required />
                            </div>
                            <div>
                                <label><strong>State</strong></label>
                                <input type="text" className="address-edit-input address-edit-input-override" required />
                            </div>
                            <div>
                                <label><strong>ZIP Code</strong></label>
                                <input type="text" className="address-edit-input address-edit-input-override" required />
                            </div>
                        </div>
                        <div className="address-edit-checkbox">
                            <input type='checkbox' className="setAsDefaultCheck"></input>
                            <label id="setAsDefaultLabel">Make this my default address</label>
                        </div>
                        <button>Add Address</button>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default Edit2