//Handles all the change first & last name, reset pwd, and addresses. Seperate the form submission and the api invokes.

export async function forgotpwd(email) {
    try {
        const response = await fetch('/api/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            throw new Error("Searching for user's email failed");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error during sign-in req:', error);
        throw error;
    }
}

export async function resetPwd(email, password) {
    try {
        const url = "/api/reset";

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                newPassword: password
            })
        })

        if (!response.ok) {
            throw new Error("Reset password encountered an error.");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error occured during password change:", error)
    }
}

export async function changeFirstName(id, newFirstName) {
    try {
        const url = "/api/users/edit/firstName";

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                newFirstName: newFirstName
            })
        })

        if (!response.ok) {
            throw new Error("Changing first name yielded an error.");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error occured when changing first name:", error)
    }
}

export async function changeLastName(id, newLastName) {
    try {
        const url = "/api/users/edit/lastName";

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                newLastName: newLastName
            })
        })

        if (!response.ok) {
            throw new Error("Changing last name yielded an error.");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error occured when changing last name:", error)
    }
}

export async function changeEmail(code, oldEmail, newEmail) {
    try {
        const url = `/api/verifycode/${code}`;
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                oldEmail: oldEmail,
                newEmail: newEmail
            })
        })

        if (!response.ok) {
            throw new Error("Changing email address yielded an error.");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error occured when changing email address:", error)
    }
}

export async function addAddress(id, addressObj) {
    try {
        const url = `/api/users/address/add`;
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                address: addressObj
            })
        })

        if (!response.ok) {
            throw new Error("Adding address yielded an error.");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error occured when adding address:", error)
    }
}

export async function editAddress(id, addressObj, index) {
    try {
        const url = `/api/users/address/edit`;
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                address: addressObj,
                index: index
            })
        })

        if (!response.ok) {
            throw new Error("Editing address yielded an error.");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error occured when editing address:", error)
    }
}

export async function deleteAddress(id, addressObj, index) {
    try {
        const url = `/api/users/address/delete`;
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                address: addressObj,
                index: index
            })
        })

        if (!response.ok) {
            throw new Error("Deleting address yielded an error.");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error occured when deleting address:", error)
    }
}

export async function defaultAddress(id, addressObj, index) {
    try {
        const url = `/api/users/address/default`;
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                address: addressObj,
                index: index
            })
        })

        if (!response.ok) {
            throw new Error("Setting new default address yielded an error.");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error occured when setting new default address:", error)
    }
}