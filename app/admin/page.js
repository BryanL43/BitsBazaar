"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { text } from '@fortawesome/fontawesome-svg-core';

const Admin = () => {

    /*
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

    const addProduct = async() => {
        try {
            const url = "/api?type=addproduct";

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: JSON.parse(getCookie("userData")).id,
                    product: newProduct
                })
            })

            if (response.ok) {
                console.log("Adding Product API Invoked!");
            } else {
                console.log("Adding product API failed");
            }
        } catch (error) {
            console.log("Error occured adding product:", error)
        }
    }

    addProduct();*/

    return (
        <div>Admin Page</div>
    )
}

export default Admin