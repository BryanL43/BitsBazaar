"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const SideBar = ({ searchParams }) => {
    const router = useRouter();

    const [filt, setFilt] = useState({
        "PC": false,
        "Laptop": false,
        "Motherboard": false,
        "CPU": false,
        "RAM": false,
        "Graphics Card": false,
        "Hard Drive": false,
        "Power Supply": false,
        "Monitor": false,
        "Mouse": false,
        "Keyboard": false,
        "Audio Gear": false
    });

    const [price, setPrice] = useState({
        "Less than $100": false,
        "$100 - $200": false,
        "$201 - $300": false,
        "$301 - $400": false,
        "$401 - $500": false,
        "More than $500": false,
    })

    //Initial load for states
    useEffect(() => {
        setFilt(prevFilt => {
            const newFilt = { ...prevFilt };
            Object.keys(newFilt).forEach(key => {
                newFilt[key] = searchParams.filter === key;
            });
            return newFilt;
        });
    
        const priceMap = {
            "0-99": "Less than $100",
            "100-200": "$100 - $200",
            "201-300": "$201 - $300",
            "301-400": "$301 - $400",
            "401-500": "$401 - $500",
            "500-99999": "More than $500"
        };
    
        setPrice(prevPrice => {
            const newPrice = { ...prevPrice };
            Object.keys(newPrice).forEach(key => {
                newPrice[key] = priceMap[searchParams.price] === key;
            });
            return newPrice;
        });
    }, [searchParams]);

    const filterApplied = (sub, checked) => {
        setFilt(prevState => ({
            ...prevState,
            [sub]: checked
        }));

        searchParams = {
            search: searchParams.search,
            filter: checked ? sub : "",
            price: searchParams.price ? searchParams.price : ""
        };

        const priceMap = {
            "Less than $100": [0, 99],
            "$100 - $200": [100, 200],
            "$201 - $300": [201, 300],
            "$301 - $400": [301, 400],
            "$401 - $500": [401, 500],
            "More than $500": [500, 99999]
        };
        
        const [minPrice, maxPrice] = priceMap[searchParams.price] || [0, 99999];

        let newURL = "/catalogue?search=" + searchParams.search;

        if (searchParams.filter) {
            newURL += "&filter=" + searchParams.filter;
        }
        if (searchParams.price) {
            newURL += "&price=" + minPrice + "-" + maxPrice;
        }

        router.push(newURL);
    };

    const priceApplied = (sub, checked) => {
        setPrice(prevState => ({
            ...prevState,
            [sub]: checked
        }));

        searchParams = {
            search: searchParams.search,
            filter: searchParams.filter ? searchParams.filter : "",
            price: checked ? sub : ""
        };

        let minPrice;
        let maxPrice;
        if (searchParams.price === "Less than $100") {
            minPrice = 0;
            maxPrice = 99;
        } else if (searchParams.price == "$100 - $200") {
            minPrice = 100;
            maxPrice = 200;
        } else if (searchParams.price == "$201 - $300") {
            minPrice = 201;
            maxPrice = 300;
        } else if (searchParams.price == "$301 - $400") {
            minPrice = 301;
            maxPrice = 400;
        } else if (searchParams.price == "$401 - $500") {
            minPrice = 401;
            maxPrice = 500;
        } else if (searchParams.price == "More than $500") {
            minPrice = 500;
            maxPrice = 99999;
        } else {
            minPrice = 0;
            maxPrice = 99999;
        }

        let newURL = "/catalogue?search=" + searchParams.search;

        if (searchParams.filter) {
            newURL += "&filter=" + searchParams.filter;
        }
        if (searchParams.price) {
            newURL += "&price=" + minPrice + "-" + maxPrice;
        }

        router.push(newURL);
    };

    const filters = [
        {
            name: "PC & Laptop",
            sub: [
                "PC",
                "Laptop"
            ]
        },
        {
            name: "PC Parts",
            sub: [
                "Motherboard",
                "CPU",
                "RAM",
                "Graphics Card",
                "Hard Drive",
                "Power Supply"
            ]
        },
        {
            name: "Accessories",
            sub: [
                "Monitor",
                "Mouse",
                "Keyboard",
                "Audio Gear"
            ]
        },
    ]

    const prices = {
        name: "Price filter",
        sub: [
            "Less than $100",
            "$100 - $200",
            "$201 - $300",
            "$301 - $400",
            "$401 - $500",
            "More than $500"
        ]
    }

    return (
        <div className='filter'>
            {filters.map(category => (
                <div key={category.name} className='filter-card'>
                    <p>{category.name}</p>
                    {category.sub.map(sub => (
                        <div key={category.name + sub}>
                            <input
                                type='checkbox'
                                onChange={(e) => { filterApplied(sub, e.target.checked) }}
                                checked={filt[sub]}
                                {...(Object.values(filt).some(value => value === true) && filt[sub] !== true ? { disabled: "disabled" } : {})}
                            ></input> {" "}
                            <label>{sub}</label> <br></br>
                        </div>
                    ))}
                </div>
            ))}

            <div className='filter-card'>
                <p>{prices.name}</p>
                {prices.sub.map(sub => (
                    <div key={sub}>
                        <input
                            type='checkbox'
                            onChange={(e) => { priceApplied(sub, e.target.checked) }}
                            checked={price[sub]}
                            {...(Object.values(price).some(value => value === true) && price[sub] !== true ? { disabled: "disabled" } : {})}
                        ></input> {" "}
                        <label>{sub}</label> <br></br>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SideBar