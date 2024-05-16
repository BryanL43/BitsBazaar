export async function verifycode(code) {
    try {
        const response = await fetch(`/api/verifycode/${code}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (!response.ok) {
            throw new Error("Acquiring code failed");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error during code acquisition:', error);
        throw error;
    }
}