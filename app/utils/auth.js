export async function signIn(email, password) {
    try {
        const response = await fetch('/api/auth', {
            method: 'POST', //Intentional POST to send body data
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Sign-in failed');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error during sign-in req:', error);
        throw error;
    }
}

export async function register(firstName, lastName, email, password) {
    try {
        const response = await fetch("/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            })
        })

        if (!response.ok) {
            throw new Error("Register failed");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error occured during registeration req:", error)
    }
}