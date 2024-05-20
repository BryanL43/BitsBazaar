"use client"

import Link from 'next/link';
import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import InfoEditPg from './InfoEditPg';
import ChangeFirstNamePg from './ChangeFirstNamePg';
import ChangeLastNamePg from './ChangeLastNamePg'
import ChangeEmailPg from './ChangeEmailPg';
import CodeVerifyPg from './CodeVerifyPg';
import AddressPg from './AddressPg';
import AddAddressPg from './AddAddressPg';
import EditAddressPg from './EditAddressPg';

import { forgotpwd } from '../utils/user';
import { getCookie } from '../utils/cookies';

const Profile = () => {
    const router = useRouter();

    //Page Render Variables
    const [openStates, setOpenStates] = useState({
        infoEdit: false,
        changeFirstName: false,
        changeLastName: false,
        changeEmail: false,
        codeVerify: false,
        addressPage: false,
        addAddress: false,
        addressEdit: false
    });

    const areAllPagesClosed = Object.values(openStates).every(state => !state);

    //Close all page for returning to /profile
    const closeAllSubPages = () => {
        setOpenStates({
            infoEdit: false,
            changeFirstName: false,
            changeLastName: false,
            changeEmail: false,
            codeVerify: false,
            addressPage: false,
            addAddress: false,
            addressEdit: false
        });
    };

    //Database handler states
    const [iEdit_Add, setIEdit_Add] = useState();
    const [newEmail, setNewEmail] = useState("");

    const [addAddressObj, setAddAddressObj] = useState({
        country_reg: "",
        phone_num: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        default: false
    });

    //Initial DOM Loaded data acquisition
    const [isDataExist, setIsDataExist] = useState(false);
    const [greetFirstName, setGreetFirstName] = useState("");
    const [greetLastName, setGreetLastName] = useState("");
    const [currEmail, setCurrEmail] = useState("");

    useEffect(() => {
        const userDataString = getCookie("userData");
        if (userDataString) {
            const userData = JSON.parse(userDataString);

            if (!userData.firstName) { //Edge case handler
                router.push("/signin");
            }

            setGreetFirstName(userData.firstName);
            setGreetLastName(userData.lastName);
            setCurrEmail(userData.email);
            setIsDataExist(true);
            
            if (window.location.search.split("?")[1] === "address") { //Redirect to address subpage if /profile?address
                gotoPage("addressPage");
                history.replaceState(null, null, window.location.pathname);
            }
        } else {
            router.push("/signin");
        }
    }, [router]);

    //Handle Page Module Navigation
    const gotoPage = (pageName) => {
        closeAllSubPages();
        setOpenStates(prevState => ({
            ...prevState,
            [pageName]: true
        }));
    };

    const sendCode = async() => {
        try {
            const responseData = await forgotpwd(JSON.parse(getCookie("userData")).email); //Recycled the same function as it does the exact same thing. (check if email exist then create a reset code)
            if (responseData.success === true) {
                gotoPage('codeVerify');
            } else {
                console.log("Error when reading response");
            }
        } catch (error) {
            console.log("Error occurred when searching for email:", error)
        }
    }

    return (
        <main>
            <div className="profile-screen">
                {areAllPagesClosed && isDataExist && ( //Render main profile page
                    <React.Fragment>
                        <div className="profile-container">
                            <div className="profile-left-side">
                                <h1 id="yourAccText">Your Account</h1>
                                <h2 id="yourAccWelcomeText">Welcome, {greetFirstName} {greetLastName}</h2>
                                <div className="profile-banner-card">
                                    <div className="profile-banner-top-bar">
                                        <h3>Start Browsing</h3>
                                        <Link href="/signin">View catalog</Link>
                                    </div>
                                    <div className="profile-banner-main" onClick={() => router.push('/catalogue?search=all')}>
                                        <Image className="profile-banner-img" src="/profilebanner.png" alt="Start browsing BitsBazaar" width={0} height={0} sizes="100vw" style={{width: "100%", height: "100%"}}/>
                                        <p className="banner-text-1">Find the technology you need</p>
                                        <p className="banner-text-2">Shop BitsBazaar</p>
                                    </div>
                                </div>
                                <div className="profile-quick-browse-card">
                                    <div className="quick-browse-top-bar">
                                        <h3>Quick Browse</h3>
                                    </div>
                                    <div className="quick-browse-container">
                                        <div className="quick-browse-content" onClick={() => router.push('/catalogue?search=all&filter=Laptop')}>
                                            <Image src="/profilelaptopimg.png" alt="Browse Laptop Catagory" width={0} height={0} sizes="100vw" style={{width: "33%", height: "100%"}}/>
                                            <h3>High-Quality Laptops</h3>
                                        </div>
                                        <div className="quick-browse-content" onClick={() => router.push('/catalogue?search=all&filter=PC')}>
                                            <Image src="/profilepcimg.png" alt="Browse Gaming PC Catagory" width={0} height={0} sizes="100vw" style={{width: "33%", height: "100%"}}/>
                                            <h3>Gaming PC</h3>
                                        </div>
                                        <div className="quick-browse-content" onClick={() => router.push('/catalogue?search=all&filter=Audio Gear')}>
                                            <Image src="/profileheadsetimg.png" alt="Browse Accessories Catagory" width={0} height={0} sizes="100vw" style={{width: "33%", height: "100%"}}/>
                                            <h3>Accessories</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="profile-right-side">
                                <div className="profile-setting-content" onClick={() => gotoPage("infoEdit")}>
                                    <Image src="/profileEdit.png" alt="Edit login, name, email, and password" width={0} height={0} sizes="100vw" style={{width: "66px", height: "66px"}}/>
                                    <div className="profile-setting-content-inner">
                                        <h2>Personal Information</h2>
                                        <p>Edit login credentials, name, and email address</p>
                                    </div>
                                </div>
                                {/* <div className="profile-setting-content" onClick={() => window.location.href = "/orders"}>
                                    <Image src="/profileOrder.png" alt="See your order history" width={0} height={0} sizes="100vw" style={{width: "66px", height: "66px"}}/>
                                    <div className="profile-setting-content-inner">
                                        <h2>Your Orders</h2>
                                        <p>See purchase history, track, or cancel an order</p>
                                    </div>
                                </div> */}
                                <div className="profile-setting-content" onClick={() => gotoPage("addressPage")}>
                                    <Image src="/profileAddress.png" alt="Edit your addresses" width={0} height={0} sizes="100vw" style={{width: "66px", height: "66px"}}/>
                                    <div className="profile-setting-content-inner">
                                        <h2>Your Addresses</h2>
                                        <p>Edit, remove, or set default address</p>
                                    </div>
                                </div>
                                <div className="profile-setting-content" onClick={() => router.push("/cart")}>
                                    <Image src="/profileCart.png" alt="Your Cart" width={0} height={0} sizes="100vw" style={{width: "66px", height: "66px"}}/>
                                    <div className="profile-setting-content-inner">
                                        <h2>Your Cart</h2>
                                        <p>View items in your cart</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                )}
                {openStates['infoEdit'] && ( //Render edit personal information subpage
                    <React.Fragment><InfoEditPg closePages={closeAllSubPages} pageChange={gotoPage} /></React.Fragment>
                )}
                {openStates['changeFirstName'] && ( //Render edit change first name subpage
                    <React.Fragment><ChangeFirstNamePg closePages={closeAllSubPages} pageChange={gotoPage} /></React.Fragment>
                )}
                {openStates['changeLastName'] && ( //Render edit change last name subpage
                    <React.Fragment><ChangeLastNamePg closePages={closeAllSubPages} pageChange={gotoPage} /></React.Fragment>
                )}
                {openStates['changeEmail'] && !openStates['codeVerify'] && ( //Render change email page
                    <React.Fragment><ChangeEmailPg currEmail={currEmail} sendCode={sendCode} newEmail={newEmail} setNewEmail={setNewEmail} /></React.Fragment>
                )}
                {openStates['codeVerify'] && ( //Open code verification page
                    <React.Fragment><CodeVerifyPg oldEmail={currEmail} newEmail={newEmail} sendCode={sendCode} /></React.Fragment>
                )}
                {openStates['addressPage'] && ( //Render address subpage
                    <React.Fragment><AddressPg closePages={closeAllSubPages} pageChange={gotoPage} setAddAddressObj={setAddAddressObj} setIEdit_Add={setIEdit_Add} /></React.Fragment>
                )}
                {openStates['addAddress'] && ( //Render add address subpage
                    <React.Fragment><AddAddressPg closePages={closeAllSubPages} pageChange={gotoPage} setAddAddressObj={setAddAddressObj} addAddressObj={addAddressObj} /></React.Fragment>
                )}
                {openStates['addressEdit'] && ( //Render edit address subpage
                    <React.Fragment><EditAddressPg closePages={closeAllSubPages} pageChange={gotoPage} setAddAddressObj={setAddAddressObj} addAddressObj={addAddressObj} iEdit_Add={iEdit_Add} /></React.Fragment>
                )}
            </div>
        </main>
    )
}

export default Profile
