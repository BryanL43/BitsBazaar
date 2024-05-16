"use client"

import React, { useState } from 'react'
import Link from 'next/link';

import { getCookie, setCookie } from '../utils/cookies';
import { deleteAddress, defaultAddress } from '../utils/user';

const AddressCard = ({ rawAddress, isDefault, index, setIEdit_Add, pageChange, setAddAddressObj, setChangeTriggered }) => { //Index in database as I prefer not to look for exact match of address

    //Intermediate handler with main page.jsx for React
    const handleSetAddAddressObj = (obj) => {
        setAddAddressObj(obj);
    }

    const handleSetChangeTriggered = (bool) => {
        setChangeTriggered(bool)
    }

    //Edit Btn handler
    const handleEditBtn = (event) => {
        event.preventDefault();
        setIEdit_Add(index);
        handleSetAddAddressObj(rawAddress);
        pageChange("addressEdit");
    }

    const removeAddressHandler = async(adObj, i) => {
        try {
            const responseData = await deleteAddress(JSON.parse(getCookie("userData")).id, adObj, i);
            if (responseData.success === true) {
                setCookie("userData", JSON.stringify(responseData.user), 1);
                handleSetAddAddressObj({
                    country_reg: "",
                    phone_num: "",
                    address: "",
                    city: "",
                    state: "",
                    zip_code: "",
                    default: false
                });
                handleSetChangeTriggered(true);
            } else {
                console.log("Removing Address Failed");
            }
        } catch (error) {
            console.log("Error occured when removing address:", error)
        }
    }

    const newDefaultAddress = async(adObj, i) => {
        try {
            const responseData = await defaultAddress(JSON.parse(getCookie("userData")).id, adObj, i);
            if (responseData.success === true) {
                setCookie("userData", JSON.stringify(responseData.user), 1);
                handleSetAddAddressObj({
                    country_reg: "",
                    phone_num: "",
                    address: "",
                    city: "",
                    state: "",
                    zip_code: "",
                    default: false
                });
                handleSetChangeTriggered(true);
            } else {
                console.log("Setting New Default Address Failed");
            }
        } catch (error) {
            console.log("Error occured when setting new default address:", error)
        }
    }

    //Render top bar
    const renderDefaultAddressTopBar = () => {
        if (isDefault) {
            return (
                <div className="address-top-bar">
                    <p><strong>Default Address</strong></p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="address-card">
            {renderDefaultAddressTopBar()}
            <ul>
                <li>
                    <p><strong>{JSON.parse(getCookie("userData")).firstName} {JSON.parse(getCookie("userData")).lastName}</strong></p>
                </li>
                <li>
                    <p>{rawAddress.address}</p>
                </li>
                <li>
                    <p>{rawAddress.city}, {rawAddress.state} {rawAddress.zip_code}</p>
                </li>
                <li>
                    <p>{rawAddress.country_reg}</p>
                </li>
                <li>
                    <p>Phone number: {rawAddress.phone_num}</p>
                </li>
            </ul>
            <div className="address-bottom-bar">
                <Link href="" onClick={handleEditBtn}>Edit</Link>
                <Link href="" onClick={() => {handleSetAddAddressObj(rawAddress); removeAddressHandler(rawAddress, index);}}>Remove</Link>
                {!isDefault && <Link href="" onClick={() => {handleSetAddAddressObj(rawAddress); newDefaultAddress(rawAddress, index);}}>Set as Default</Link>}
            </div>
        </div>
    );
}

export default AddressCard;
