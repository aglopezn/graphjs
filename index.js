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
    let resultados = generarObjectoCharts(restricciones)
    resultados.puntoSolucion = gauss(restricciones)
    console.log(restricciones)
    console.log(resultados.restriccion1.data)
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

function generarObjectoCharts(restricciones){
    let cantidadRestricciones = restricciones.length
    let object = {}
    for (let i=0; i<cantidadRestricciones; i++){
        let cantidadVariables = restricciones[i].length - 1 
        object[`restriccion${i+1}`] = {
            label: `Restriccion${i+1}`,
            showLine: true,
            data: []
        }
        if (i%2 == 0){
            object[`restriccion${i+1}`].backgroundColor = 'rgba(67, 176, 114, 0.5)'
            object[`restriccion${i+1}`].bordercolor = 'rgba(67, 176, 114, 1)'
        }else{
            object[`restriccion${i+1}`].backgroundColor = 'rgba(176, 149, 102, 0.5)'
            object[`restriccion${i+1}`].bordercolor = 'rgba(176, 149, 102, 1)'
        }
        object[`restriccion${i+1}`].data = generarPuntos(cantidadVariables, restricciones[i])
    }
    return object
}

function generarPuntos(cantidadVariables, restriccion){
    let x = true
    let puntos = new Array()
    for (let i=0; i<cantidadVariables; i++){
        let aux_variable = restriccion[cantidadVariables] / restriccion[i]
        if (x){
            aux_objeto = {x: aux_variable, y: 0}
            x = false;
        }else{
            aux_objeto = {x: 0, y: aux_variable}
        }
        puntos.push(aux_objeto)
    }
    return puntos
}

//--------------------------------------------------------------------------------
app.listen(PORT, () => (console.log("running server on port", PORT)))