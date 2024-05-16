import React, { useEffect, useState } from 'react'
import Link from 'next/link';

import AddressCard from '../components/AddressCard';
import { getCookie } from '../utils/cookies';

const AddressPg = ({ closePages, pageChange, setAddAddressObj, setIEdit_Add }) => {
    const [loadAddressData, setLoadAddressData] = useState([]);
    const [changedTriggered, setChangeTriggered] = useState(true) //true for initial load address cards

    useEffect(() => {
        setChangeTriggered(false);

        const userDataString = getCookie("userData");
        const userData = JSON.parse(userDataString);

        const updatedLoadAddressData = [];

        //Process the default address first
        for (let i = 0; i < userData.addresses.length; i++) {
            if (JSON.parse(userData.addresses[i]).default === "true") {
                updatedLoadAddressData.push({ rawAddress: JSON.parse(userData.addresses[i]), isDefault: true, index: i });
                break;
            }
        }

        // Process the rest of the addresses
        for (let i = 0; i < userData.addresses.length; i++) {
            if (JSON.parse(userData.addresses[i]).default !== "true") {
                updatedLoadAddressData.push({ rawAddress: JSON.parse(userData.addresses[i]), isDefault: false, index: i });
            }
        }

        setLoadAddressData(updatedLoadAddressData);
    }, [changedTriggered]);

    //React cannot read on DOM level from fragmented files
    const handlePageChange = (page) => {
        pageChange(page);
    };

    const handleClosePages = () => {
        closePages();
    }

    const handleSetAddAddressObj = (obj) => {
        setAddAddressObj(obj);
    }

    return (
        <div className="edit-address-container">
            <ol className="custom-list">
                <li>
                    <Link href="/profile" id="backToProfile" onClick={handleClosePages}>Your Account</Link>
                </li>
                <li>
                    <p>Your Addresses</p>
                </li>
            </ol>
            <h1>Your Addresses</h1>
            <div className="address-grid-container">
                <div className="address-card add-address-card" onClick={() => { handleSetAddAddressObj({ country_reg: "", phone_num: "", address: "", city: "", state: "", zip_code: "", default: false }); handlePageChange('addAddress'); }}>
                    <h1>+</h1>
                    <h2>Add Address</h2>
                </div>

                {loadAddressData.map((addressData, index) => (
                    <AddressCard
                        key={index}
                        rawAddress={addressData.rawAddress}
                        isDefault={addressData.isDefault}
                        index={addressData.index}
                        setIEdit_Add={setIEdit_Add}
                        pageChange={pageChange}
                        setAddAddressObj={setAddAddressObj}
                        setChangeTriggered={setChangeTriggered}
                    />
                ))}

            </div>
        </div>
    )
}

export default AddressPg