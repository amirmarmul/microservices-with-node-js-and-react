const express = require("express")
const { randomBytes } = require("crypto")
const cors = require("cors")
const axios = require("axios")

const app = express()
app.use(express.json())
app.use(cors())

const posts = {}

app.get("/posts", (req, res) => {
    res.json(posts)
})

app.post("/posts/create", async (req, res) => {
    const id = randomBytes(4).toString("hex")
    const { title } = req.body 

    posts[id] = { id, title }

    await axios.post("http://event-bus-srv:3000/events", {
        type: "PostCreated",
        data: {
            id,
            title,
        }
    })

    res.json(posts[id])
})

app.post("/events", (req, res) => {
    console.log("Event Received:", req.body.type)

    res.end()
})

app.listen(3000, () => {
    console.log("App Listening @ 3000")
})