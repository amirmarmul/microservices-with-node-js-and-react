const express = require("express")
const axios = require("axios")

const app = express()
app.use(express.json())

app.post("/events", async (req, res) => {
    console.log("Event Received:", req.body.type)
    
    const { type, data } = req.body

    if (type === "CommentCreated") {
        const status = data.content.includes("banana") ? "rejected" : "approved"

        await axios.post("http://event-bus-srv:3000/events", {
            type: "CommentModerated",
            data: {
                id: data.id,
                content: data.content,
                postId: data.postId,
                status,
            }
        })
    }

    res.end()
})

app.listen(3000, () => console.log("App Listening @ 3000"))