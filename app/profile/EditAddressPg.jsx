"use client"

import React from 'react'
import Link from 'next/link';

import { getCookie, setCookie } from '../utils/cookies';
import { editAddress } from '../utils/user';

const EditAddressPg = ({ closePages, pageChange, setAddAddressObj, addAddressObj, iEdit_Add }) => {

    //Intermediate handler with main page.jsx for React
    const handlePageChange = (page) => {
        pageChange(page);
    };

    const handleClosePages = () => {
        closePages();
    }

    const handleSetAddAddressObj = (obj) => {
        setAddAddressObj(obj);
    }

    //Edit Address Handler
    const editAddressFormHandler = async(event) => {
        event.preventDefault(); // Prevent default form submission

        try {
            const responseData = await editAddress(JSON.parse(getCookie("userData")).id, addAddressObj, iEdit_Add);
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
                handlePageChange("addressPage");
            } else {
                console.log("Edit Address Failed");
            }
        } catch (error) {
            console.log("Error occured when editing address:", error)
        }
    }

    return (
        <div className="edit-address-comp-container">
            <ol className="custom-list">
                <li>
                    <Link href="/profile" id="backToProfile" onClick={handleClosePages}>Your Account</Link>
                </li>
                <li>
                    <Link href="/profile" id="backToProfile" onClick={() => handlePageChange("addressPage")}>Your Addresses</Link>
                </li>
                <li>
                    <p>Edit Address</p>
                </li>
            </ol>
            <h1>Edit Your Address</h1>
            <form className="edit-address-container-2" onSubmit={editAddressFormHandler}>
                <div className="component-address-edit">
                    <label><strong>Country/Region</strong></label>
                    <input type="text" className="address-edit-input" value={addAddressObj["country_reg"]} onChange={(e) => handleSetAddAddressObj(prevState => ({ ...prevState, country_reg: e.target.value }))} required />
                </div>
                <div className="component-address-edit">
                    <label><strong>Full Name (First and Last name)</strong></label>
                    <input type="text" className="address-edit-input" value={JSON.parse(getCookie("userData")).firstName + " " + JSON.parse(getCookie("userData")).lastName} readOnly />
                </div>
                <div className="component-address-edit">
                    <label><strong>Phone number</strong></label>
                    <input type="text" className="address-edit-input" value={addAddressObj["phone_num"]} onChange={(e) => handleSetAddAddressObj(prevState => ({ ...prevState, phone_num: e.target.value }))} onKeyPress={(e) => { const charCode = e.charCode; if (!(charCode >= 48 && charCode <= 57) && charCode !== 8) { e.preventDefault(); } }} required />
                </div>
                <div className="component-address-edit">
                    <label><strong>Address</strong></label>
                    <input type="text" className="address-edit-input" value={addAddressObj["address"]} onChange={(e) => handleSetAddAddressObj(prevState => ({ ...prevState, address: e.target.value }))} required />
                </div>
                <div className="component-address-edit component-address-edit-type2">
                    <div>
                        <label><strong>City</strong></label>
                        <input type="text" className="address-edit-input address-edit-input-override" value={addAddressObj["city"]} onChange={(e) => handleSetAddAddressObj(prevState => ({ ...prevState, city: e.target.value }))} required />
                    </div>
                    <div>
                        <label><strong>State</strong></label>
                        <input type="text" className="address-edit-input address-edit-input-override" value={addAddressObj["state"]} maxLength={2} onChange={(e) => handleSetAddAddressObj(prevState => ({ ...prevState, state: e.target.value }))} onKeyPress={(e) => { const charCode = e.charCode; if (!(charCode >= 65 && charCode <= 90) && !(charCode >= 97 && charCode <= 122) && charCode !== 8 && charCode !== 32) { e.preventDefault(); } }} required />
                    </div>
                    <div>
                        <label><strong>ZIP Code</strong></label>
                        <input type="text" className="address-edit-input address-edit-input-override" value={addAddressObj["zip_code"]} onChange={(e) => handleSetAddAddressObj(prevState => ({ ...prevState, zip_code: e.target.value }))} onKeyPress={(e) => { const charCode = e.charCode; if (!((charCode >= 48 && charCode <= 57) || charCode === 45) && charCode !== 8 && charCode !== 32) { e.preventDefault(); } }} required />
                    </div>
                </div>
                <div className="address-edit-checkbox">
                    <input type='checkbox' className="setAsDefaultCheck" {...(addAddressObj["default"] === "true" ? { checked: true } : {})} onChange={(e) => handleSetAddAddressObj(prevState => ({ ...prevState, default: e.target.checked }))}></input>
                    <label id="setAsDefaultLabel">Make this my default address</label>
                </div>
                <button>Save Address</button>
            </form>
        </div>
    )
}

export default EditAddressPg