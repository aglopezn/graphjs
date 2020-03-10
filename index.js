const express = require("express")
const app = express()
const PORT = process.env.PORT || 80
const clientPath = __dirname + "/public/"

app.use(express.static(clientPath))

app.get("/", (req, res) => {
    res.sendFile(clientPath + "index.html")
})

app.get("/metodo-grafico", (req, res) => {
    res.sendFile(clientPath + "metodo-grafico.html")
})

app.listen(PORT, () => (console.log("running server on port", PORT)))