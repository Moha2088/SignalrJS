import * as SignalR from "@microsoft/signalr"



let token
const email = "mo@ucl.com"
const password = "Mohac123"

async function AuthenticateUser() {
    try {
        const response = await fetch("http://localhost:5225/api/authentication/login", {
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        
        if (!response.ok) {
            const errorText = await response.text(); // Capture body as text
            throw new Error("Failed to post data: " + errorText);
        } else {
            token = await response.text(); // Capture body as JSON when successful
            console.log(token);
        }

    } catch (error) {
        console.error("An error occurred:", error.message);
    }
}

let connection = new SignalR.HubConnectionBuilder()
    .withUrl("https://localhost:5225/event", {
        accessTokenFactory: () => "", 
            headers: {
                "token": token
            }
        })
    .build();

async function JoinGroup(){
    connection.invoke("JoinGroup")
}

AuthenticateUser()

connection.on("send", data => {
    console.log("Data received:", data);
});
