//--------------------------------------------------------------------------------
const express = require("express")
const app = express()
const PORT = process.env.PORT || 80
const clientPath = __dirname + "/public/"
//--------------------------------------------------------------------------------
const gauss = require("gaussian-elimination")
//--------------------------------------------------------------------------------
app.use(express.static(clientPath))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
//--------------------------------------------------------------------------------
app.get("/", (req, res) => {
    res.sendFile(clientPath + "index.html")
})

app.get("/metodo-grafico", (req, res) => {
    res.sendFile(clientPath + "metodo-grafico.html")
})

app.post("/calcular-grafico", (req, res) => {
    console.log(req.body)
    let restricciones = organizarRestricciones(req.body)
    let sol = gauss(restricciones)
    console.log(sol)
    res.json(sol)
})

//--------------------------------------------------------------------------------
function organizarRestricciones(restriccionesJSON){
    let cantidadRestricciones = restriccionesJSON.rx1.length
    let restricciones = []
    for (let i=0; i<cantidadRestricciones; i++){
        let x = parseInt(restriccionesJSON.rx1[i])
        let y = parseInt(restriccionesJSON.rx2[i])
        let b = parseInt(restriccionesJSON.b[i])
        let aux = [x,y,b]
        restricciones.push(aux)
    }
    return restricciones
}
//--------------------------------------------------------------------------------
app.listen(PORT, () => (console.log("running server on port", PORT)))