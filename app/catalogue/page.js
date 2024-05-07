"use client"

import React, { useState, useEffect } from 'react';

const Catalogue = (query) => {

    function createProductCard(info) {
        //Create a new product card element
        const productCard = document.createElement("div");
        productCard.classList.add("items-card");

        //Create image
        const productImg = document.createElement("img");
        productImg.src = info.images[0];
        productImg.sizes = "100vw";
        productImg.width = "0";
        productImg.height = "0";
        productImg.style = "max-width: 95%; max-height: 224px;"
        productCard.appendChild(productImg);

        //Create text-content div
        const textContent = document.createElement("div");
        textContent.classList.add("items-card-text-content");

        //Create name link to product detail
        const nameLink = document.createElement("a");
        nameLink.href = "/product?id=" + info.id;
        nameLink.textContent = info.name;
        textContent.appendChild(nameLink);

        //Create price <p>
        const priceP = document.createElement("p");
        priceP.classList.add("price-item");
        priceP.textContent = "$" + info.price;
        textContent.appendChild(priceP);

        //Create detail <p>
        const detailP = document.createElement("p");
        detailP.classList.add("detail-item");
        textContent.appendChild(detailP);
        detailP.textContent = info.detail;
        productCard.appendChild(textContent);

        //Create view product button
        const viewBtn = document.createElement("button");
        viewBtn.textContent = "View Details";

        viewBtn.addEventListener("click", function() {
            window.location.href = "/product?id=" + info.id;
        })

        productCard.appendChild(viewBtn);

        return productCard;
    }

    const [initialRender, setInitialRender] = useState(true);

    useEffect(() => {
        if (window.location.href.split("/").pop() === "catalogue") { //Redirect to appropriate query
            window.location.href = '/catalogue?search=all';
        }
        if (!initialRender) {
            getProducts();
        } else {
            setInitialRender(false);
        }
    })

    const getProducts = async() => {
        try {
            let searchParam = "";
            if (query.searchParams.search) {
                searchParam = query.searchParams.search.toLowerCase();
            }

            const url = `/api?type=getproducts&search=${searchParam}&filter=${window.location.href.split("&filter=")[1]}`;
            
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response.ok) {
                const responseData = await response.json();
                responseData.products.forEach(product => {
                    document.querySelector(".items").appendChild(createProductCard(product));
                })
            } else {
                console.log("Acquiring Products Failed");
            }
        } catch (error) {
            console.log("Error occured when acquiring products:", error);
        }
    }

    function filterApplied(filter, checked) {
        const filterCards = document.querySelectorAll('.filter-card');

        if (checked) {
            filterCards.forEach((filterCard, index) => {
                if (index < filterCards.length - 1) {
                    filterCard.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                        if (checkbox.nextElementSibling.textContent.trim() !== filter) {
                            checkbox.setAttribute("disabled", "disabled");
                        }
                    })
                }
            })
            //Handle URL change
            const searchParams = new URLSearchParams(window.location.search);
            const existingFilter = searchParams.get('filter');

            if (existingFilter) {
                const updatedFilter = filter + existingFilter;
                searchParams.set("filter", updatedFilter);
            } else {
                searchParams.set("filter", filter);
            }

            history.pushState(null, '', '?' + searchParams.toString());

            //Update product cards
            const itemsContainer = document.querySelector('.items');
            while (document.querySelector('.items').firstChild) {
                itemsContainer.removeChild(itemsContainer.firstChild);
            }
            getProducts();
        } else {
            filterCards.forEach((filterCard, index) => {
                if (index < filterCards.length - 1) {
                    filterCard.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                        if (checkbox.nextElementSibling.textContent.trim() !== filter) {
                            checkbox.removeAttribute("disabled");
                        }
                    })
                }
            })
            //Handle URL change
            const searchParams = new URLSearchParams(window.location.search);
            const existingFilter = searchParams.get('filter');

            if (existingFilter) {
                const filterParts = existingFilter.split(',');
                if (filterParts.length > 1) { //Remove the left-hand side of the comma
                    filterParts.shift();
                    const updatedFilter = "," + filterParts.join(',');
                    searchParams.set('filter', updatedFilter);

                    history.pushState(null, '', '?' + searchParams.toString());
                } else { //If there's only one part (no content on the left-hand side of the comma), just remove the 'filter' parameter
                    searchParams.delete('filter');
                    history.pushState(null, '', '?' + searchParams.toString());
                }
            }

            history.pushState(null, '', '?' + searchParams.toString());

            //Update product cards
            const itemsContainer = document.querySelector('.items');
            while (document.querySelector('.items').firstChild) {
                itemsContainer.removeChild(itemsContainer.firstChild);
            }
            getProducts();
        }
    }

    function priceFilterApplied(filter, checked, value) {
        const filterCards = document.querySelectorAll('.filter-card');

        if (checked) {
            filterCards.forEach((filterCard, index) => {
                if (index == filterCards.length - 1) {
                    filterCard.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                        if (checkbox.nextElementSibling.textContent.trim() !== filter) {
                            checkbox.setAttribute("disabled", "disabled");
                        }
                    })
                }
            })
            const searchParams = new URLSearchParams(window.location.search);
            const existingFilter = searchParams.get('filter');
            if (existingFilter) {
                searchParams.set('filter', existingFilter + ',' + value);
            } else {
                searchParams.set('filter', "," + value);
            }
            history.pushState(null, '', '?' + searchParams.toString());
            const itemsContainer = document.querySelector('.items');
            while (document.querySelector('.items').firstChild) {
                itemsContainer.removeChild(itemsContainer.firstChild);
            }
            getProducts();
        } else {
            filterCards.forEach((filterCard, index) => {
                if (index == filterCards.length - 1) {
                    filterCard.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                        if (checkbox.nextElementSibling.textContent.trim() !== filter) {
                            checkbox.removeAttribute("disabled");
                        }
                    })
                }
            })
            const searchParams = new URLSearchParams(window.location.search);
            const existingFilter = searchParams.get('filter');
            if (existingFilter) {
                const filterParts = existingFilter.split(',');
                const updatedFilter = filterParts[0];
                searchParams.set('filter', updatedFilter);
                history.pushState(null, '', '?' + searchParams.toString());
            }
            const itemsContainer = document.querySelector('.items');
            while (document.querySelector('.items').firstChild) {
                itemsContainer.removeChild(itemsContainer.firstChild);
            }
            getProducts();
        }
    }

    return (
        <main>
            <div className='catalogue-screen'>
                <div className="filterTopBar">
                    <h1>Filters</h1>
                    <p>Showing results for &apos;{!query.searchParams.search ? "all" : query.searchParams.search}&apos;</p>
                </div>
                <div className="main-catalogue-page">
                    <div className='filter'>
                        <div className='filter-card'>
                            <p>PC & Laptop</p>
                            <input type='checkbox' onChange={(e) => { filterApplied("PC", e.target.checked) }}></input> <label>PC</label> <br></br>
                            <input type='checkbox' onChange={(e) => { filterApplied("Laptop", e.target.checked) }}></input> <label>Laptop</label> <br></br>
                        </div>

                        <div className='filter-card'>
                            <p>PC Parts</p>
                            <input type='checkbox' onChange={(e) => { filterApplied("Motherboard", e.target.checked) }}></input> <label>Motherboard</label> <br></br>
                            <input type='checkbox' onChange={(e) => { filterApplied("CPU", e.target.checked) }}></input> <label>CPU</label> <br></br>
                            <input type='checkbox' onChange={(e) => { filterApplied("RAM", e.target.checked) }}></input> <label>RAM</label> <br></br>
                            <input type='checkbox' onChange={(e) => { filterApplied("Graphics Card", e.target.checked) }}></input> <label>Graphics Card</label> <br></br>
                            <input type='checkbox' onChange={(e) => { filterApplied("Hard Drive", e.target.checked) }}></input> <label>Hard Drive</label> <br></br>
                            <input type='checkbox'  onChange={(e) => { filterApplied("Power Supply", e.target.checked) }}></input> <label>Power Supply</label> <br></br>
                        </div>

                        <div className='filter-card'>
                            <p>Accessories</p>
                            <input type='checkbox' onChange={(e) => { filterApplied("Monitor", e.target.checked) }}></input> <label>Monitor</label> <br></br>
                            <input type='checkbox' onChange={(e) => { filterApplied("Mouse", e.target.checked) }}></input> <label>Mouse</label> <br></br>
                            <input type='checkbox' onChange={(e) => { filterApplied("Keyboard", e.target.checked) }}></input> <label>Keyboard</label> <br></br>
                            <input type='checkbox' onChange={(e) => { filterApplied("Audio Gear", e.target.checked) }}></input> <label>Audio Gear</label> <br></br>
                        </div>

                        <div className='filter-card'>
                            <p>Price filter</p>
                            <input type='checkbox' onChange={(e) => { priceFilterApplied("Less than $100", e.target.checked, 0) }}></input> <label>Less than $100</label> <br></br>
                            <input type='checkbox' onChange={(e) => { priceFilterApplied("$100 - $200", e.target.checked, 100) }}></input> <label>$100 - $200</label> <br></br>
                            <input type='checkbox' onChange={(e) => { priceFilterApplied("$201 - $300", e.target.checked, 201) }}></input> <label>$201 - $300</label> <br></br>
                            <input type='checkbox' onChange={(e) => { priceFilterApplied("$301 - $400", e.target.checked, 301) }}></input> <label>$301 - $400</label> <br></br>
                            <input type='checkbox' onChange={(e) => { priceFilterApplied("$401 - $500", e.target.checked, 401) }}></input> <label>$401 - $500</label> <br></br>
                            <input type='checkbox' onChange={(e) => { priceFilterApplied("More than $500", e.target.checked, 501) }}></input> <label>More than $500</label> <br></br>
                        </div>
                    </div>

                    <div className='items'>
                        {/* <div className='items-card'>
                            <Image src="/rtx3060gpu.jpg" sizes="100vw" width={0} height={0} style={{width: "auto", height: "auto", maxWidth: "95%", maxHeight: "224px"}} alt="RTX 3060 GPU"></Image>
                            <div className="items-card-text-content">
                                <Link href="/catalogue">Name of Item</Link>
                                <p className='price-item'>${price1}</p>
                                <p className='detail-item'>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
                            </div>
                            <button>View Details</button>
                        </div> */}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Catalogue