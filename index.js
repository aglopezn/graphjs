const express = require("express")
const app = express()
const PORT = process.env.PORT || 80

app.use(express.static("./public"))

app.get("/", (req, res) => {
    res.sendFile(__dir + "/public/index.html")
})

app.listen(PORT, () => (console.log("running server on port", PORT)))