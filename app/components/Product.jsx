"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

const Product = ({id, name, price, detail, images}) => {
    const router = useRouter()

    const redirect = (path) => {
        router.push(path)
    }

    return (
        <div key={id} className='items-card'>
            <Image src={images[0]} sizes="100vw" width={0} height={0} style={{ maxWidth: "95%", maxHeight: "224px" }} alt={name} onClick={() => redirect(`/product/${id}`)}></Image>
            <div className="items-card-text-content">
                <Link href="/catalogue">{name}</Link>
                
                <p className='price-item'>${price}</p>
                <p className='detail-item'>{detail}</p>
            </div>
            <button onClick={() => redirect(`/product/${id}`)}>View Details</button>
        </div>
    )
}

export default Product