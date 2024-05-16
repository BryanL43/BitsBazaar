
import React from 'react';
import prisma from '@/prisma/Client';
import { redirect } from 'next/navigation'

import SideBar from './SideBar';
import Product from '../components/Product';

const Catalogue = async({searchParams}) => {
    if (!searchParams.search) { //Redirect to appropriate query server-sided support for prisma
        redirect("/catalogue?search=all");
    }

    let searchKey = !searchParams.search || searchParams.search === "undefined" ? "all" : searchParams.search;
    let filterKey = !searchParams.filter || searchParams.filter === "undefined" ? "none" : searchParams.filter.toLowerCase();
    const minPrice = searchParams.price ? parseFloat(searchParams.price.split("-")[0]) : 0;
    const maxPrice = searchParams.price ? parseFloat(searchParams.price.split("-")[1]) : 99999;
    
    let initProducts;
    if (filterKey !== "none" && searchParams.search === "all") { //Case with filter key and no search keyword(s)
        initProducts = await prisma.product.findMany({
            where: {
                tags: {
                    has: filterKey
                }
            }
        });
    } else if (filterKey === "none" && searchParams.search !== "all") { //Case no filter key and there exist search keyword(s)
        initProducts = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: searchKey, mode: 'insensitive' } },
                    { detail: { contains: searchKey, mode: 'insensitive' } }
                ],
            }
        });
    } else if (filterKey !== "none" && searchParams.search !== "all") { //Case with filter key and there exist search keyword(s)
        initProducts = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: searchKey, mode: 'insensitive' } },
                    { detail: { contains: searchKey, mode: 'insensitive' } }
                ],
                tags: {
                    has: filterKey
                }
            }
        });
    } else { //Case no filter and no search keyword(s)
        initProducts = await prisma.product.findMany();
    }
    
    //Apply price filter override due to some string -> number conversion (requires entire proj tinkering) I don't have time to fix
    const filteredProducts = initProducts.filter(product => {
        const price = parseFloat(product.price);
        return price >= minPrice && price <= maxPrice;
    });

    return (
        <main>
            <div className='catalogue-screen'>
                <div className="filterTopBar">
                    <h1>Filters</h1>
                    <p>Showing results for &apos;{!searchParams.search ? "all" : searchParams.search}&apos;</p>
                </div>
                <div className="main-catalogue-page">
                    <SideBar searchParams={searchParams} />

                    <div className='items'>
                        {filteredProducts.map(product => (
                            <Product key={product.id} {...product} />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Catalogue