"use client"

import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
    const [openInfoEdit, setOpenInfoEdit] = useState(false);
    const [openChangeFirstName, setOpenChangeFirstName] = useState(false);
    const [openChangeLastName, setOpenChangeLastName] = useState(false);
    const [openChangeEmail, setOpenChangeEmail] = useState(false);
    const [openCodeVerify, setOpenCodeVerify] = useState(false);
    const codeInputs = useRef([]);
    const [verificationCode, setVerificationCode] = useState("");
    const [isCodeNotFound, setIsCodeNotFound] = useState(false);

    const [newFirstName, setNewFirstName] = useState("");
    const [newLastName, setNewLastName] = useState("");
    const [newEmail, setNewEmail] = useState("");

    //Initial profile load greeting handler
    const [greetFirstName, setGreetFirstName] = useState("");
    const [greetLastName, setGreetLastName] = useState("");

    useEffect(() => {
        const userDataString = window.sessionStorage.getItem("userData");
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            setGreetFirstName(userData.firstName);
            setGreetLastName(userData.lastName);
        }
    }, []);

    //Handle Page Module Navigation
    const bannerRedirect = () => {
        window.location.href = '/signin';
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

    const gotoProfilePg = () => {
        setOpenInfoEdit(false);
        setOpenChangeFirstName(false);
        setOpenChangeLastName(false);
        setOpenChangeEmail(false);
        setOpenCodeVerify(false);
    }

    const gotoInfoEditPg = () => {
        setOpenInfoEdit(true);
        setOpenChangeFirstName(false);
        setOpenChangeLastName(false);
        setOpenChangeEmail(false);
        setOpenCodeVerify(false);
    }

    const gotoChangeFirstNamePg = () => {
        setOpenInfoEdit(false);
        setOpenChangeFirstName(true);
        setOpenChangeLastName(false);
        setOpenChangeEmail(false);
        setOpenCodeVerify(false);
    }

    const gotoChangeLastNamePg = () => {
        setOpenInfoEdit(false);
        setOpenChangeFirstName(false);
        setOpenChangeLastName(true);
        setOpenChangeEmail(false);
        setOpenCodeVerify(false);
    }

    const gotoChangeEmailPg = () => {
        setOpenInfoEdit(false);
        setOpenChangeFirstName(false);
        setOpenChangeLastName(false);
        setOpenChangeEmail(true);
        setOpenCodeVerify(false);
    }

    const gotoCodeVerPg = () => {
        setOpenInfoEdit(false);
        setOpenChangeFirstName(false);
        setOpenChangeLastName(false);
        setOpenChangeEmail(false);
        setOpenCodeVerify(true);
    }

    //Verify Change email code
    const verifyFormSubmission = async(event) => {
        event.preventDefault(); // Prevent default form submission
        try {
            const userData = JSON.parse(window.sessionStorage.getItem("userData"));
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
                    console.log("Code Found")
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
                gotoCodeVerPg();
            } else {
                console.log("Error when reading response");
            }
        } catch (error) {
            console.log("Error occurred when searching for email:", error)
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
                    id: JSON.parse(window.sessionStorage.getItem("userData")).id,
                    firstName: newFirstName
                })
            })

            if (response.ok) {
                const responseData = await response.json();

                window.sessionStorage.setItem("userData", JSON.stringify(responseData));
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
                    id: JSON.parse(window.sessionStorage.getItem("userData")).id,
                    lastName: newLastName
                })
            })

            if (response.ok) {
                const responseData = await response.json();

                window.sessionStorage.setItem("userData", JSON.stringify(responseData));
                console.log("Change Last Name Successful!");
                window.location.href = '/profile';
            } else {
                console.log("Change Last Name Failed");
            }
        } catch (error) {
            console.log("Error occured when changing last name:", error)
        }
    }


    return (
        <main>
            <div className="profile-screen">
                {!openInfoEdit && !openChangeFirstName && !openChangeLastName && !openChangeEmail && !openCodeVerify && ( //Main Profile Page
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
                                <div className="profile-setting-content" onClick={gotoInfoEditPg}>
                                    <Image src="/profileEdit.png" alt="Edit login, name, email, and password" width={0} height={0} sizes="100vw" style={{width: "66px", height: "66px"}}/>
                                    <div className="profile-setting-content-inner">
                                        <h2>Personal Information</h2>
                                        <p>Edit login credentials, name, and email address</p>
                                    </div>
                                </div>
                                <div className="profile-setting-content">
                                    <Image src="/profileOrder.png" alt="Edit login, name, email, and password" width={0} height={0} sizes="100vw" style={{width: "66px", height: "66px"}}/>
                                    <div className="profile-setting-content-inner">
                                        <h2>Your Orders</h2>
                                        <p>See purchase history, track, or cancel an order</p>
                                    </div>
                                </div>
                                <div className="profile-setting-content">
                                    <Image src="/profileAddress.png" alt="Edit login, name, email, and password" width={0} height={0} sizes="100vw" style={{width: "66px", height: "66px"}}/>
                                    <div className="profile-setting-content-inner">
                                        <h2>Your Addresses</h2>
                                        <p>Edit, remove, or set default address</p>
                                    </div>
                                </div>
                                <div className="profile-setting-content">
                                    <Image src="/profilePayment.png" alt="Edit login, name, email, and password" width={0} height={0} sizes="100vw" style={{width: "66px", height: "66px"}}/>
                                    <div className="profile-setting-content-inner">
                                        <h2>Your Payments</h2>
                                        <p>Edit or add payment method</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                )}
                {openInfoEdit && !openChangeFirstName && !openChangeLastName && !openChangeEmail && !openCodeVerify && ( //Open edit personal information page
                    <React.Fragment>
                        <div className="edit-container">
                            <ol className="custom-list">
                                <li>
                                    <Link href="/profile" id="backToProfile" onClick={gotoProfilePg}>Your Account</Link>
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
                                        <p>{JSON.parse(window.sessionStorage.getItem("userData")).firstName}</p>
                                        <button onClick={gotoChangeFirstNamePg}>Edit</button>
                                    </div>
                                </li>
                                <li>
                                    <div className="info-card-padding">
                                        <h1><strong>Last Name</strong></h1>
                                        <p>{JSON.parse(window.sessionStorage.getItem("userData")).lastName}</p>
                                        <button onClick={gotoChangeLastNamePg}>Edit</button>
                                    </div>
                                </li>
                                <li>
                                    <div className="info-card-padding">
                                        <h1><strong>Email</strong></h1>
                                        <p>{JSON.parse(window.sessionStorage.getItem("userData")).user}</p>
                                        <button onClick={gotoChangeEmailPg}>Edit</button>
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
                {openChangeFirstName && !openInfoEdit && !openChangeLastName && !openChangeEmail && !openCodeVerify && ( //Open change first name page
                    <React.Fragment>
                        <div className="edit-container">
                            <ol className="custom-list">
                                <li>
                                    <Link href="/profile" id="backToProfile" onClick={gotoProfilePg}>Your Account</Link>
                                </li>
                                <li>
                                    <Link href="/profile" id="backToProfile" onClick={gotoInfoEditPg}>Personal Information</Link>
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
                {openChangeLastName && !openInfoEdit && !openChangeFirstName && !openChangeEmail && !openCodeVerify && ( //Open change last name page
                    <React.Fragment>
                        <div className="edit-container">
                            <ol className="custom-list">
                                <li>
                                    <Link href="/profile" id="backToProfile" onClick={gotoProfilePg}>Your Account</Link>
                                </li>
                                <li>
                                    <Link href="/profile" id="backToProfile" onClick={gotoInfoEditPg}>Personal Information</Link>
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
                {openChangeEmail && !openInfoEdit && !openChangeFirstName && !openChangeLastName && !openCodeVerify && ( //Open change email page
                    !openCodeVerify && ( //Render email page
                        <React.Fragment>
                            <div className="forgotpwd-screen">
                                <div className="forgotpwd-container">
                                    <h1>Change Your Email Address</h1>
                                    <form className="signin-form" action="/profile" method="GET" onSubmit={sendCode}>
                                        <p>Current email address: JohnDoe@gmail.com</p>
                                        <p style={{width:"80%"}}>Enter the new email address you would like to associate with your account below. We will send a verification code to that address.</p>
                                        <input id="emailBar" type="email" placeholder="Email Address" autoComplete="off" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
                                        <button id="submitBtn" type="submit">Continue</button>
                                    </form>
                                </div>
                            </div>
                        </React.Fragment>
                    )
                )}
                {openCodeVerify && !openInfoEdit && !openChangeFirstName && !openChangeLastName && !openChangeEmail && ( //Open code verification page
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
            </div>
        </main>
    )
}

export default Profile
