"use client"

import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
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
    const codeInputs = useRef([]);
    const [verificationCode, setVerificationCode] = useState("");
    const [isCodeNotFound, setIsCodeNotFound] = useState(false);
    const [iEdit_Add, setIEdit_Add] = useState();
    const [iRemove_Add, setIRemove_Add] = useState();
    const [iNewDefault_Add, setINewDefault_Add] = useState();

    const [newFirstName, setNewFirstName] = useState("");
    const [newLastName, setNewLastName] = useState("");
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

    //Cookie Handler:
    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

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

    function deleteCookie(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

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
                window.location.href = '/signin';
            }

            setGreetFirstName(userData.firstName);
            setGreetLastName(userData.lastName);
            setCurrEmail(userData.user);
            setIsDataExist(true);
        } else {
            window.location.href = '/signin';
        }
    }, []);

    //Handle Page Module Navigation
    const bannerRedirect = () => {
        window.location.href = '/catalogue';
    }

    const laptopRedirect = () => {
        window.location.href = '/signin';
    }

    const pcRedirect = () => {
        window.location.href = '/signin';
    }

    const accessoriesRedirect = () => {
        window.location.href = '/signin';
    }

    const gotoPage = (pageName) => {
        closeAllSubPages();
        setOpenStates(prevState => ({
            ...prevState,
            [pageName]: true
        }));
    };

    function createAddressCard(rawAddress, isDefault, index) {
        //Create a new address card element
        const addressCard = document.createElement("div");
        addressCard.classList.add("address-card");

        //Check if the address is the default address for top bar
        if (isDefault) {
            //Create the address-top-bar for default address
            const addressTopBar = document.createElement("div");
            addressTopBar.classList.add("address-top-bar");
            const strongTag = document.createElement("strong");
            strongTag.textContent = "Default Address";
            const paragraphTag = document.createElement("p");
            paragraphTag.appendChild(strongTag);
            addressTopBar.appendChild(paragraphTag);
            addressCard.appendChild(addressTopBar);
        }

        //Create the ul element for address details
        const ulElement = document.createElement("ul");

        //Name creation
        const name_liElement = document.createElement("li");
        const name_pElement = document.createElement("p");
        const name_strongTag = document.createElement("strong");
        name_strongTag.textContent = greetFirstName + " " + greetLastName;
        name_pElement.appendChild(name_strongTag);
        name_liElement.appendChild(name_pElement);
        ulElement.appendChild(name_liElement);

        //Address creation
        const adr_liElement = document.createElement("li");
        const adr_pElement = document.createElement("p");
        adr_pElement.textContent = rawAddress.address
        adr_liElement.appendChild(adr_pElement);
        ulElement.appendChild(adr_liElement);

        //Address extended creation
        const adrEx_liElement = document.createElement("li");
        const adrEx_pElement = document.createElement("p");
        adrEx_pElement.textContent = rawAddress.city + ", " + rawAddress.state + " " + rawAddress.zip_code
        adrEx_liElement.appendChild(adrEx_pElement);
        ulElement.appendChild(adrEx_liElement);

        //Country/Region creation
        const coun_liElement = document.createElement("li");
        const coun_pElement = document.createElement("p");
        coun_pElement.textContent = rawAddress.country_reg
        coun_liElement.appendChild(coun_pElement);
        ulElement.appendChild(coun_liElement);

        //Phone number creation
        const phone_liElement = document.createElement("li");
        const phone_pElement = document.createElement("p");
        phone_pElement.textContent = "Phone number: " + rawAddress.phone_num
        phone_liElement.appendChild(phone_pElement);
        ulElement.appendChild(phone_liElement);

        //Create the address-bottom-bar element
        const addressBottomBar = document.createElement("div");
        addressBottomBar.classList.add("address-bottom-bar");
        
        //Create links for edit and remove
        const editLink = document.createElement("a");
        editLink.href = "/profile";
        editLink.textContent = "Edit";

        editLink.addEventListener("click", function(event) {
            event.preventDefault();
            setIEdit_Add(index);
            setAddAddressObj(rawAddress);
            gotoPage("addressEdit");
        })

        const removeLink = document.createElement("a");
        removeLink.href = "/profile";
        removeLink.textContent = "Remove";

        removeLink.addEventListener("click", function(event) {
            event.preventDefault();
            setIRemove_Add(index);
            setAddAddressObj(rawAddress);
            gotoPage("addressPage");
        })

        addressBottomBar.appendChild(editLink);
        addressBottomBar.appendChild(removeLink);

        //If the address is not the default address, add "Set as Default" link
        if (!isDefault) {
            const setDefaultLink = document.createElement("a");
            setDefaultLink.href = "/profile";
            setDefaultLink.textContent = "Set as Default";

            setDefaultLink.addEventListener("click", function(event) {
                event.preventDefault();
                setINewDefault_Add(index);
                setAddAddressObj(rawAddress);
                gotoPage("addressPage");
            })

            addressBottomBar.appendChild(setDefaultLink);
        }

        //Append ul and address-bottom-bar to address card
        addressCard.appendChild(ulElement);
        addressCard.appendChild(addressBottomBar);

        return addressCard;
    }

    const [initialRender, setInitialRender] = useState(true);

    useEffect(() => {
        if (!initialRender) {
            //Call removeAddress when iRemove_Add changes
            removeAddress();
        } else {
            //Set initial render flag to false after the initial render to enable
            setInitialRender(false);
        }
    }, [iRemove_Add]);

    useEffect(() => {
        if (!initialRender) {
            //Call newDefaultAddress when iNewDefault_Add changes
            newDefaultAddress();
        } else {
            //Set initial render flag to false after the initial render to enable
            setInitialRender(false);
        }
    }, [iNewDefault_Add]);

    useEffect(() => {
        if (openStates['addressPage']) {
            const userDataString = getCookie("userData");

            //Parse the JSON string into a JavaScript object
            const userData = JSON.parse(userDataString);

            //Container
            const addressGridContainer = document.querySelector(".address-grid-container");

            //Delete all children excluding firstchild so it doesn't duplicate clone
            let child = addressGridContainer.firstElementChild; // Get the second child
            while (child.nextElementSibling) {
                addressGridContainer.removeChild(child.nextElementSibling);
            }

            //Find and process the default address first
            for (let i = 0; i < userData.addresses.length; i++) {
                if (JSON.parse(userData.addresses[i]).default === "true") {
                    const rawDefaultAddress = JSON.parse(userData.addresses[i]);
                    const addressCard = createAddressCard(rawDefaultAddress, true, i);
                    addressGridContainer.appendChild(addressCard);
                    break;
                }
            }

            //Process the rest of the addresses
            for (let i = 0; i < userData.addresses.length; i++) {
                if (JSON.parse(userData.addresses[i]).default !== "true") {
                    const rawDefaultAddress = JSON.parse(userData.addresses[i]);
                    const addressCard = createAddressCard(rawDefaultAddress, false, i);
                    addressGridContainer.appendChild(addressCard);
                }
            }
        }
    })

    //Code Input Handler
    const handleChange = (i, event) => {
        const { value } = event.target;
        const preventLetter = value.replace(/\D/g, "");
        event.target.value = preventLetter;

        if (!isNaN(parseInt(value, 10)) && value !== "") {
            if (i < codeInputs.current.length - 1) {
                codeInputs.current[i + 1].focus();
            }
        }

        const updatedCode = codeInputs.current.map(input => input.value).join("");
        setVerificationCode(updatedCode);
    };

    const handlePaste = (event) => {
        event.preventDefault();
        const pastedText = event.clipboardData.getData('text/plain');
        const digits = pastedText.replace(/\D/g, "").slice(0, 6);
        
        for (let i = 0; i < digits.length; i++) {
            codeInputs.current[i].value = digits[i];
            if (i < codeInputs.current.length - 1) {
                codeInputs.current[i + 1].focus();
            }
        }
    
        const updatedCode = codeInputs.current.map(input => input.value).join("");
        setVerificationCode(updatedCode);
    };

    const sendCode = async(event) => {
        event.preventDefault(); // Prevent default form submission
        try {
            const url = `/api?type=changeemailcode&email=${newEmail}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response.ok) {
                console.log("Successfully sent verification code");
                gotoPage('codeVerify');
            } else {
                console.log("Error when reading response");
            }
        } catch (error) {
            console.log("Error occurred when searching for email:", error)
        }
    }

    //Verify Change email code
    const verifyFormSubmission = async(event) => {
        event.preventDefault(); // Prevent default form submission
        try {
            const userData = JSON.parse(getCookie("userData"));
            const url = `/api?type=newemailverifycode&code=${verificationCode}&email=${newEmail}&oldemail=${userData.user}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response.ok) {
                const responseData = await response.json();

                if (responseData.code === "Not found") {
                    console.log("Code not Found");
                    setIsCodeNotFound(true);
                } else {
                    console.log("Code Found");
                    deleteCookie("userData");
                    window.location.href = '/signin';
                    setIsCodeNotFound(false);
                }
            } else {
                console.log("Error when reading response");
            }
        } catch (error) {
            console.log("Error occurred when verifying code:", error)
        }
    }

    //Change First Name Handler
    const changeFirstName = async(event) => {
        event.preventDefault(); // Prevent default form submission
        try {
            const url = "/api?type=changefirstname";

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: JSON.parse(getCookie("userData")).id,
                    firstName: newFirstName
                })
            })

            if (response.ok) {
                const responseData = await response.json();
                
                setCookie("userData", JSON.stringify(responseData), 1);
                console.log("Change First Name Successful!");
                window.location.href = '/profile';
            } else {
                console.log("Change First Name Failed");
            }
        } catch (error) {
            console.log("Error occured when changing first name:", error)
        }
    }

    //Change First Name Handler
    const changeLastName = async(event) => {
        event.preventDefault(); // Prevent default form submission
        try {
            const url = "/api?type=changelastname";

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: JSON.parse(getCookie("userData")).id,
                    lastName: newLastName
                })
            })

            if (response.ok) {
                const responseData = await response.json();
                
                setCookie("userData", JSON.stringify(responseData), 1);
                console.log("Change Last Name Successful!");
                window.location.href = '/profile';
            } else {
                console.log("Change Last Name Failed");
            }
        } catch (error) {
            console.log("Error occured when changing last name:", error)
        }
    }

    //Add Address Handler
    const addAddress = async(event) => {
        event.preventDefault(); // Prevent default form submission
        try {
            const url = "/api?type=addaddress";

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: JSON.parse(getCookie("userData")).id,
                    address: addAddressObj
                })
            })

            if (response.ok) {
                const responseData = await response.json();

                setCookie("userData", JSON.stringify(responseData), 1);
                setAddAddressObj({
                    country_reg: "",
                    phone_num: "",
                    address: "",
                    city: "",
                    state: "",
                    zip_code: "",
                    default: false
                });                
                gotoPage("addressPage");
            } else {
                console.log("Add Address Failed");
            }
        } catch (error) {
            console.log("Error occured when adding address:", error)
        }
    }

    //Edit Address Handler
    const editAddress = async(event) => {
        event.preventDefault(); // Prevent default form submission

        try {
            const url = "/api?type=editaddress";

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: JSON.parse(getCookie("userData")).id,
                    address: addAddressObj,
                    index: iEdit_Add
                })
            })

            if (response.ok) {
                const responseData = await response.json();

                setCookie("userData", JSON.stringify(responseData), 1);
                setAddAddressObj({
                    country_reg: "",
                    phone_num: "",
                    address: "",
                    city: "",
                    state: "",
                    zip_code: "",
                    default: false
                });                
                gotoPage("addressPage");
            } else {
                console.log("Edit Address Failed");
            }
        } catch (error) {
            console.log("Error occured when editing address:", error)
        }
    }

    //Hoist Remove Address Handler
    const removeAddress = async() => {
        try {
            const url = "/api?type=removeaddress";

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: JSON.parse(getCookie("userData")).id,
                    address: addAddressObj,
                    index: iRemove_Add
                })
            })

            if (response.ok) {
                const responseData = await response.json();

                setCookie("userData", JSON.stringify(responseData), 1);
                setAddAddressObj({
                    country_reg: "",
                    phone_num: "",
                    address: "",
                    city: "",
                    state: "",
                    zip_code: "",
                    default: false
                });                
                gotoPage("addressPage");
            } else {
                console.log("Remove Address Failed");
            }
        } catch (error) {
            console.log("Error occured when removing address:", error)
        }
    }

    const newDefaultAddress = async() => {
        try {
            const url = "/api?type=newdefaultaddress";

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: JSON.parse(getCookie("userData")).id,
                    address: addAddressObj,
                    index: iNewDefault_Add
                })
            })

            if (response.ok) {
                const responseData = await response.json();

                setCookie("userData", JSON.stringify(responseData), 1);
                setAddAddressObj({
                    country_reg: "",
                    phone_num: "",
                    address: "",
                    city: "",
                    state: "",
                    zip_code: "",
                    default: false
                });                
                gotoPage("addressPage");
            } else {
                console.log("Setting New Default Address Failed");
            }
        } catch (error) {
            console.log("Error occured when setting new default address:", error)
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
                                    <div className="profile-banner-main" onClick={bannerRedirect}>
                                        <Image className="profile-banner-img" src="/profilebanner.png" alt="Start browsing BitsBazaar" width={0} height={0} sizes="100vw" style={{width: "100%", height: "100%"}}/>
                                        <p className="banner-text-1">Find the technology you need</p>
                                        <p className="banner-text-2">Shop BitsBazaar</p>
                                    </div>
                                </div>
                                <div className="profile-quick-browse-card">
                                    <div className="quick-browse-top-bar">
                                        <h3>Quick Browse</h3>
                                    </div>
                                    <div className="quick-browse-container" onClick={laptopRedirect}>
                                        <div className="quick-browse-content">
                                            <Image src="/profilelaptopimg.png" alt="Browse Laptop Catagory" width={0} height={0} sizes="100vw" style={{width: "33%", height: "100%"}}/>
                                            <h3>High-Quality Laptops</h3>
                                        </div>
                                        <div className="quick-browse-content" onClick={pcRedirect}>
                                            <Image src="/profilepcimg.png" alt="Browse Gaming PC Catagory" width={0} height={0} sizes="100vw" style={{width: "33%", height: "100%"}}/>
                                            <h3>Gaming PC</h3>
                                        </div>
                                        <div className="quick-browse-content" onClick={accessoriesRedirect}>
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
                                <div className="profile-setting-content">
                                    <Image src="/profileOrder.png" alt="See your order history" width={0} height={0} sizes="100vw" style={{width: "66px", height: "66px"}}/>
                                    <div className="profile-setting-content-inner">
                                        <h2>Your Orders</h2>
                                        <p>See purchase history, track, or cancel an order</p>
                                    </div>
                                </div>
                                <div className="profile-setting-content" onClick={() => gotoPage("addressPage")}>
                                    <Image src="/profileAddress.png" alt="Edit your addresses" width={0} height={0} sizes="100vw" style={{width: "66px", height: "66px"}}/>
                                    <div className="profile-setting-content-inner">
                                        <h2>Your Addresses</h2>
                                        <p>Edit, remove, or set default address</p>
                                    </div>
                                </div>
                                <div className="profile-setting-content" onClick={() => window.location.href = "/cart"}>
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
                    <React.Fragment>
                        <div className="edit-container">
                            <ol className="custom-list">
                                <li>
                                    <Link href="/profile" id="backToProfile" onClick={closeAllSubPages}>Your Account</Link>
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
                                        <p>{JSON.parse(getCookie("userData")).firstName}</p>
                                        <button onClick={() => gotoPage("changeFirstName")}>Edit</button>
                                    </div>
                                </li>
                                <li>
                                    <div className="info-card-padding">
                                        <h1><strong>Last Name</strong></h1>
                                        <p>{JSON.parse(getCookie("userData")).lastName}</p>
                                        <button onClick={() => gotoPage("changeLastName")}>Edit</button>
                                    </div>
                                </li>
                                <li>
                                    <div className="info-card-padding">
                                        <h1><strong>Email</strong></h1>
                                        <p>{JSON.parse(getCookie("userData")).user}</p>
                                        <button onClick={() => gotoPage("changeEmail")}>Edit</button>
                                    </div>
                                </li>
                                <li>
                                    <div className="info-card-padding">
                                        <h1><strong>Password</strong></h1>
                                        <p>**********</p>
                                        <button onClick={() => {window.location.href = '/forgotpassword';}}>Edit</button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </React.Fragment>
                )}
                {openStates['changeFirstName'] && ( //Render edit change first name subpage
                    <React.Fragment>
                        <div className="edit-container">
                            <ol className="custom-list">
                                <li>
                                    <Link href="/profile" id="backToProfile" onClick={closeAllSubPages}>Your Account</Link>
                                </li>
                                <li>
                                    <Link href="/profile" id="backToProfile" onClick={() => gotoPage("infoEdit")}>Personal Information</Link>
                                </li>
                                <li>
                                    <p>Change your first name</p>
                                </li>
                            </ol>
                            <h1>Change your first name</h1>
                            <ul className="change-name-card-container">
                                <li>
                                    <div className="change-name-card-padding">
                                        <p>If you want to change the first name associated with your BitsBazaar customer account, you may do so below. be sure to click the <strong>Save</strong> button when you are done.</p>
                                        <label><strong>New first name</strong></label>
                                        <input type="text" className="new-name-input" value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)}></input>
                                        <button onClick={changeFirstName}>Save</button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </React.Fragment>
                )}
                {openStates['changeLastName'] && ( //Render edit change last name subpage
                    <React.Fragment>
                        <div className="edit-container">
                            <ol className="custom-list">
                                <li>
                                    <Link href="/profile" id="backToProfile" onClick={closeAllSubPages}>Your Account</Link>
                                </li>
                                <li>
                                    <Link href="/profile" id="backToProfile" onClick={() => gotoPage("infoEdit")}>Personal Information</Link>
                                </li>
                                <li>
                                    <p>Change your last name</p>
                                </li>
                            </ol>
                            <h1>Change your last name</h1>
                            <ul className="change-name-card-container">
                                <li>
                                    <div className="change-name-card-padding">
                                        <p>If you want to change the last name associated with your BitsBazaar customer account, you may do so below. be sure to click the <strong>Save</strong> button when you are done.</p>
                                        <label><strong>New last name</strong></label>
                                        <input type="text" className="new-name-input" value={newLastName} onChange={(e) => setNewLastName(e.target.value)}></input>
                                        <button onClick={changeLastName}>Save</button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </React.Fragment>
                )}
                {openStates['changeEmail'] && ( //Open change email page
                    !openStates['codeVerify'] && ( //Render email page
                        <React.Fragment>
                            <div className="forgotpwd-screen">
                                <div className="forgotpwd-container">
                                    <h1>Change Your Email Address</h1>
                                    <form className="signin-form" action="/profile" method="GET" onSubmit={sendCode}>
                                        <p>Current email address: <strong>{currEmail}</strong></p>
                                        <p style={{width:"80%"}}>Enter the new email address you would like to associate with your account below. We will send a verification code to that address.</p>
                                        <input id="emailBar" type="email" placeholder="Email Address" autoComplete="off" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
                                        <button id="submitBtn" type="submit">Continue</button>
                                    </form>
                                </div>
                            </div>
                        </React.Fragment>
                    )
                )}
                {openStates['codeVerify'] && ( //Open code verification page
                    <React.Fragment>
                        <div className="verify-screen">
                            <div className="verify-container">
                                <h1>Verify One-Time Code</h1>
                                <form className="verify-form" action="/profile" method="GET" onSubmit={verifyFormSubmission}>
                                    <p>Enter the one-time code we sent to <br></br><strong>{newEmail}</strong></p>
                                    {isCodeNotFound && (
                                        <div className="emailNotFound">
                                            <FontAwesomeIcon icon={faCircleExclamation} id="emailNotFoundIcons" />
                                            <p>Invalid Code</p>
                                            <FontAwesomeIcon icon={faXmark} id="emailNotFoundIconsClose" onClick={() => setIsCodeNotFound(false)} />
                                        </div>
                                    )}
                                    <div className="code-input-container">
                                        {[...Array(6)].map((_, i) => (
                                            <input
                                                ref={el => codeInputs.current[i] = el}
                                                key={i}
                                                className="code-input"
                                                type="text"
                                                maxLength="1"
                                                onChange={(e) => handleChange(i, e)}
                                                onPaste={handlePaste}
                                            />
                                        ))}
                                    </div>
                                    <p><br></br>Didn&apos;t receive a one-time code? <Link href="#" onClick={sendCode}>Resend now</Link></p>
                                    <button id="submitBtn" type="submit">Verify</button>
                                </form>
                            </div>
                        </div>
                    </React.Fragment>
                )}
                {openStates['addressPage'] && ( //Render address subpage
                    <React.Fragment>
                        <div className="edit-address-container">
                            <ol className="custom-list">
                                <li>
                                    <Link href="/profile" id="backToProfile" onClick={closeAllSubPages}>Your Account</Link>
                                </li>
                                <li>
                                    <p>Your Addresses</p>
                                </li>
                            </ol>
                            <h1>Your Addresses</h1>
                            <div className="address-grid-container">
                                <div className="address-card add-address-card" onClick={() => {setAddAddressObj({country_reg: "", phone_num: "", address: "", city: "", state: "", zip_code: "", default: false}); gotoPage('addAddress');}}>
                                    <h1>+</h1>
                                    <h2>Add Address</h2>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                )}
                {openStates['addAddress'] && ( //Render add address subpage
                    <React.Fragment>
                        <div className="edit-address-comp-container">
                            <ol className="custom-list">
                                <li>
                                    <Link href="/profile" id="backToProfile" onClick={closeAllSubPages}>Your Account</Link>
                                </li>
                                <li>
                                    <Link href="/profile" id="backToProfile" onClick={() => gotoPage("addressPage")}>Your Addresses</Link>
                                </li>
                                <li>
                                    <p>New Address</p>
                                </li>
                            </ol>
                            <h1>Add A New Address</h1>
                            <form className="edit-address-container-2" action="/profile" method="POST" onSubmit={addAddress}>
                                <div className="component-address-edit">
                                    <label><strong>Country/Region</strong></label>
                                    <input type="text" className="address-edit-input" value={addAddressObj["country_reg"]} onChange={(e) => setAddAddressObj(prevState => ({...prevState, country_reg: e.target.value}))} required />
                                </div>
                                <div className="component-address-edit">
                                    <label><strong>Full Name (First and Last name)</strong></label>
                                    <input type="text" className="address-edit-input" value={greetFirstName + " " + greetLastName} readOnly />
                                </div>
                                <div className="component-address-edit">
                                    <label><strong>Phone number</strong></label>
                                    <input type="text" className="address-edit-input" value={addAddressObj["phone_num"]} onChange={(e) => setAddAddressObj(prevState => ({...prevState, phone_num: e.target.value}))} onKeyPress={(e) => {const charCode = e.charCode; if (!(charCode >= 48 && charCode <= 57) && charCode !== 8) {e.preventDefault();}}} required />
                                </div>
                                <div className="component-address-edit">
                                    <label><strong>Address</strong></label>
                                    <input type="text" className="address-edit-input" value={addAddressObj["address"]} onChange={(e) => setAddAddressObj(prevState => ({...prevState, address: e.target.value}))} required />
                                </div>
                                <div className="component-address-edit component-address-edit-type2">
                                    <div>
                                        <label><strong>City</strong></label>
                                        <input type="text" className="address-edit-input address-edit-input-override" value={addAddressObj["city"]} onChange={(e) => setAddAddressObj(prevState => ({...prevState, city: e.target.value}))} required />
                                    </div>
                                    <div>
                                        <label><strong>State</strong></label>
                                        <input type="text" className="address-edit-input address-edit-input-override" value={addAddressObj["state"]} maxLength={2} onChange={(e) => setAddAddressObj(prevState => ({...prevState, state: e.target.value}))} onKeyPress={(e) => {const charCode = e.charCode; if (!(charCode >= 65 && charCode <= 90) && !(charCode >= 97 && charCode <= 122) && charCode !== 8 && charCode !== 32) { e.preventDefault();}}} required />
                                    </div>
                                    <div>
                                        <label><strong>ZIP Code</strong></label>
                                        <input type="text" className="address-edit-input address-edit-input-override" value={addAddressObj["zip_code"]} onChange={(e) => setAddAddressObj(prevState => ({...prevState, zip_code: e.target.value}))} onKeyPress={(e) => {const charCode = e.charCode; if (!((charCode >= 48 && charCode <= 57) || charCode === 45) && charCode !== 8 && charCode !== 32) {e.preventDefault();}}} required />
                                    </div>
                                </div>
                                <div className="address-edit-checkbox">
                                    <input type='checkbox' className="setAsDefaultCheck" onChange={(e) => setAddAddressObj(prevState => ({...prevState, default: e.target.checked}))}></input>
                                    <label id="setAsDefaultLabel">Make this my default address</label>
                                </div>
                                <button>Add Address</button>
                            </form>
                        </div>
                    </React.Fragment>
                )}
                {openStates['addressEdit'] && ( //Render edit address subpage (I didn't want to create too many fragment so I just duplicated it)
                    <React.Fragment>
                        <div className="edit-address-comp-container">
                            <ol className="custom-list">
                                <li>
                                    <Link href="/profile" id="backToProfile" onClick={closeAllSubPages}>Your Account</Link>
                                </li>
                                <li>
                                    <Link href="/profile" id="backToProfile" onClick={() => gotoPage("addressPage")}>Your Addresses</Link>
                                </li>
                                <li>
                                    <p>Edit Address</p>
                                </li>
                            </ol>
                            <h1>Edit Your Address</h1>
                            <form className="edit-address-container-2" action="/profile" method="POST" onSubmit={editAddress}>
                                <div className="component-address-edit">
                                    <label><strong>Country/Region</strong></label>
                                    <input type="text" className="address-edit-input" value={addAddressObj["country_reg"]} onChange={(e) => setAddAddressObj(prevState => ({...prevState, country_reg: e.target.value}))} required />
                                </div>
                                <div className="component-address-edit">
                                    <label><strong>Full Name (First and Last name)</strong></label>
                                    <input type="text" className="address-edit-input" value={greetFirstName + " " + greetLastName} readOnly />
                                </div>
                                <div className="component-address-edit">
                                    <label><strong>Phone number</strong></label>
                                    <input type="text" className="address-edit-input" value={addAddressObj["phone_num"]} onChange={(e) => setAddAddressObj(prevState => ({...prevState, phone_num: e.target.value}))} onKeyPress={(e) => {const charCode = e.charCode; if (!(charCode >= 48 && charCode <= 57) && charCode !== 8) {e.preventDefault();}}} required />
                                </div>
                                <div className="component-address-edit">
                                    <label><strong>Address</strong></label>
                                    <input type="text" className="address-edit-input" value={addAddressObj["address"]} onChange={(e) => setAddAddressObj(prevState => ({...prevState, address: e.target.value}))} required />
                                </div>
                                <div className="component-address-edit component-address-edit-type2">
                                    <div>
                                        <label><strong>City</strong></label>
                                        <input type="text" className="address-edit-input address-edit-input-override" value={addAddressObj["city"]} onChange={(e) => setAddAddressObj(prevState => ({...prevState, city: e.target.value}))} required />
                                    </div>
                                    <div>
                                        <label><strong>State</strong></label>
                                        <input type="text" className="address-edit-input address-edit-input-override" value={addAddressObj["state"]} maxLength={2} onChange={(e) => setAddAddressObj(prevState => ({...prevState, state: e.target.value}))} onKeyPress={(e) => {const charCode = e.charCode; if (!(charCode >= 65 && charCode <= 90) && !(charCode >= 97 && charCode <= 122) && charCode !== 8 && charCode !== 32) { e.preventDefault();}}} required />
                                    </div>
                                    <div>
                                        <label><strong>ZIP Code</strong></label>
                                        <input type="text" className="address-edit-input address-edit-input-override" value={addAddressObj["zip_code"]} onChange={(e) => setAddAddressObj(prevState => ({...prevState, zip_code: e.target.value}))} onKeyPress={(e) => {const charCode = e.charCode; if (!((charCode >= 48 && charCode <= 57) || charCode === 45) && charCode !== 8 && charCode !== 32) {e.preventDefault();}}} required />
                                    </div>
                                </div>
                                <div className="address-edit-checkbox">
                                    <input type='checkbox' className="setAsDefaultCheck" {...(addAddressObj["default"] === "true" ? {checked: true} : {})} onChange={(e) => setAddAddressObj(prevState => ({...prevState, default: e.target.checked}))}></input>
                                    <label id="setAsDefaultLabel">Make this my default address</label>
                                </div>
                                <button>Save Address</button>
                            </form>
                        </div>
                    </React.Fragment>
                )}
            </div>
        </main>
    )
}

export default Profile
