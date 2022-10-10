const express = require("express")
const { randomBytes } = require("crypto")
const cors = require("cors")
const axios = require("axios")

const app = express()
app.use(express.json())
app.use(cors())

const commentsByPostId = {}

app.get("/posts/:id/comments", (req, res) => {
    const comments = commentsByPostId[req.params.id] || []
    
    res.json(comments)
})

app.post("/posts/:id/comments", async (req, res) => {
    const id = randomBytes(4).toString("hex")
    const { content } = req.body 

    const comments = commentsByPostId[req.params.id] || []

    comments.push({ id, content, status: "pending" })

    commentsByPostId[req.params.id] = comments

    await axios.post("http://event-bus-srv:3000/events", {
        type: "CommentCreated",
        data: {
            id,
            content, 
            postId: req.params.id,
            status: "pending",
        }
    })

    res.json(comments)
})

app.post("/events", async (req, res) => {
    console.log("Event Received:", req.body.type)

    const { type, data } = req.body

    if (type === "CommentModerated") {
        const { id, content, postId, status } = data
        const comments = commentsByPostId[postId]

        const comment = comments.find((comment) => comment.id === id)
        comment.status = status

        await axios.post("http://event-bus-srv:3000/events", {
            type: "CommentUpdated",
            data: {
                id, 
                content,
                postId, 
                status,
            }
        })
    }

    res.end()
})

app.listen(3000, () => console.log("App Listening @ 3000"))