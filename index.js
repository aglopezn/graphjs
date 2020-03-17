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
    let resultados = generarPuntos(restricciones)
    resultados.puntoSolucion = gauss(restricciones)
    console.log(restricciones)
    console.log(resultados)
    console.log(resultados.puntoSolucion)
    res.json(resultados)
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

function generarPuntos(restricciones){
    let cantidadRestricciones = restricciones.length
    let object = {}
    for (let i=0; i<cantidadRestricciones; i++){
        object[`restriccion${i+1}`] = new Array()
        let x = 1
        for (let j=0; j<restricciones[i].length-1; j++){
            aux_variable = restricciones[i][2] / restricciones[i][j]
            if (x===1){
                aux_objeto = {x: aux_variable, y: 0}
                x = 0;
            }else{
                aux_objeto = {x: 0, y: aux_variable}
            }
            object[`restriccion${i+1}`].push(aux_objeto)
        }
    }
    return object
}
//--------------------------------------------------------------------------------
app.listen(PORT, () => (console.log("running server on port", PORT)))