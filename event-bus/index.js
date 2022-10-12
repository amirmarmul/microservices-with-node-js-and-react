const express = require("express")
const axios = require("axios")

const app = express()
app.use(express.json())

const events = []

app.get("/events", (req, res) => {
  res.json(events)
})

app.post("/events", async (req, res) => {
  const event = req.body

  events.push(event)

  axios.post("http://posts-srv:3000/events", event).catch(console.log)
  axios.post("http://comments-srv:3000/events", event).catch(console.log)
  axios.post("http://query-srv:3000/events", event).catch(console.log)
  axios.post("http://moderation-srv:3000/events", event).catch(console.log)

  res.end()
})

app.listen(3000, () => console.log("App Listening @ 3000"))