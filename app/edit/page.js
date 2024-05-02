"use client"

import Link from 'next/link';
import React, { useState } from 'react'

const Edit = () => {


    return (
        <main>
            <div className="profile-screen">
                <div className="edit-container">
                    <ol className="custom-list">
                        <li>
                            <Link href="/profile" id="backToProfile">Your Account</Link>
                        </li>
                        <li>
                            <p>Personal Information</p>
                        </li>
                    </ol>
                    <h1>Personal Information</h1>
                    <ul className="info-card-container">
                        <li>
                            <div className="info-card-padding">
                                <h1><strong>First Name</strong></h1>
                                <p>Bryan</p>
                                <button>Edit</button>
                            </div>
                        </li>
                        <li>
                            <div className="info-card-padding">
                                <h1><strong>Last Name</strong></h1>
                                <p>Lee</p>
                                <button>Edit</button>
                            </div>
                        </li>
                        <li>
                            <div className="info-card-padding">
                                <h1><strong>Email</strong></h1>
                                <p>bryanlee56098@gmail.com</p>
                                <button>Edit</button>
                            </div>
                        </li>
                        <li>
                            <div className="info-card-padding">
                                <h1><strong>Password</strong></h1>
                                <p>**********</p>
                                <button>Edit</button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </main>
    )
}

export default Edit