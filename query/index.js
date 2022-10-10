const express = require("express")
const cors = require("cors")
const axios = require("axios")

const app = express()
app.use(express.json())
app.use(cors())

const posts = {}

const handleEvent = (type, data) => {
    if (type === "PostCreated") {
        const { id, title } = data 

        posts[id] = { id, title, comments: [] }
    }

    if (type === "CommentCreated") {
        const { id, content, postId, status } = data
        
        const post = posts[postId]
        post.comments.push({ id, content, status })
    }

    if (type === "CommentUpdated") {
        const { id, content, postId, status } = data

        const post = posts[postId];
        const comment = post.comments.find((comment) => comment.id === id)

        comment.status = status
        comment.content = content
    }
}

app.get("/posts", (req, res) => {
    res.json(posts)
})

app.post("/events", (req, res) => {
    console.log("Event Received:", req.body.type)

    const { type, data } = req.body

    handleEvent(type, data)

    res.end()
})

app.listen(3000, async () =>{
    console.log("App Listening @ 3000")

    try {
        const res = await axios.get("http://event-bus-srv:3000/events")

        for (let event of res.data) {
            console.log("Processing Event:", event.type)

            handleEvent(event.type, event.data)
        }
    } catch (error) {
        console.log(error.message)
    }
})