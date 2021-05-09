/**
 * @fileoverview Es la entrada principal al servidor, donde se inicializa
 *  y se redireccionan las diferentes rutas.
 */

//--------------------------------------------------------------------------------
const express = require("express")
const app = express()
const PORT = process.env.PORT || 8080
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

//--------------------------------------------------------------------------------
app.post("/calcular-grafico", (req, res) => {
    /**
     * Realiza el calculo del sistema de ecuaciones mediante el metodo grafico.
     * @param {HTTP request} req - La petición hecha por el usuario
     * @param {HTTP responde} res - La respuesta enviada al usuario
     * @returns {JSON} la respuesta se envía en formato JSON contiene el objeto
     *  para graficar las lineas y el punto solución del sistema
     */
    console.log('Cuerpo de la petición:', req.body)
    let funcionObjetivo = (x1, x2) => (req.body.x1*x1 + req.body.x2*x2)
    let restricciones = organizarRestricciones(req.body)
    console.log('Las restricciones son: ',restricciones)
    let resultados = {}
    // Se define el objetivo del sistema, en función de la desigualdad que haya
    // definido en las restricciones
    let objetivo = 'minimizar'
    if (req.body.op_selector.includes('less')){
        objetivo = 'maximizar'
    }
    resultados.grafica = generarObjetoGrafica(restricciones, objetivo)
    resultados.solucion = generarSolucion(restricciones, objetivo)
    console.log('El resultado es: ', resultados)
    res.json(resultados)
})

function organizarRestricciones(restriccionesJSON){
    /**
     * Organiza las restricciones en formayo Array para resolverlas
     *  por Gauss
     * @param {JSON} restriccionesJSON - Informacion enviada por el usuario
     * @returns {Array} Restricciones organizadas
     */
    let cantidadRestricciones = restriccionesJSON.rx1.length
    let restricciones = []
    for (let i=0; i<cantidadRestricciones; i++){
        let x = parseFloat(restriccionesJSON.rx1[i])
        let y = parseFloat(restriccionesJSON.rx2[i])
        let b = parseFloat(restriccionesJSON.b[i])
        let aux = [x,y,b]
        restricciones.push(aux)
    }
    return restricciones
}

function generarObjetoGrafica(restricciones, objetivo){
    /**
     * Crea los objetos JSON pertinentes para graficar las restricciones
     * @param {Array} restricciones - Las restricciones que se desean graficar
     * @param {String} objetivo - El objetivo del sistema, maximizar o minimizar
     * @returns {Object} Objecto con la información para graficar las 
     *  restricciones
     */
    let puntos = generarPuntos(restricciones)
    let object = {}
    console.log("Creando los objetos para graficar las restricciones...")
    for (let i=0; i<restricciones.length; i++){
        //Datos basicos para la grafica
        let restriccionActual = `restriccion${i+1}` 
        object[restriccionActual] = {
            label: `Restriccion${i+1}`,
            showLine: true, 
            fill: 'start',
            data: []
        }
        //Area coloreada según el objetivo
        if(objetivo === 'minimizar'){
            object[restriccionActual].fill = 'end'
        }
        //Color de cada restricción en la grafica
        if (i%2 == 0){
            object[restriccionActual].backgroundColor = 'rgba(67, 176, 114, 0.5)'
            object[restriccionActual].bordercolor = 'rgba(67, 176, 114, 1)'
        }else{
            object[restriccionActual].backgroundColor = 'rgba(176, 149, 102, 0.5)'
            object[restriccionActual].bordercolor = 'rgba(176, 149, 102, 1)'
        }
        //Puntos que permiten graficar la restriccion
        object[restriccionActual].data = organizarPuntos(puntos['X'], puntos[restriccionActual])
    }
    return object
}

function generarPuntos(restricciones){
    /**
     * Recorre las restricciones para obtener todos los puntos (x,y)
     * necesarios para graficar cada una de las restricciones
     * @param {Array} restricciones - Contiene los coeficientes de todas las restricciones
     * @returns {Object} Contiene los puntos en eje X (común para todas las
     *  restricciones) y los valores Y evaluados para cada una de las 
     *  restricciones.
     */
    let puntos = {X: [0]} //El punto x=0 siempre se grafica
    //Obtener puntos en eje X para todas las restricciones
    for (let i=0; i<restricciones.length; i++){
        //restriccion de la forma 'ax + by = c' => [a, b, c]
        //si y=0 entonces x = c/a
        let a = restricciones[i][0]
        let c = restricciones[i][2]
        puntos['X'].push(c/a)
    }
    //Convierte puntos en eje X negativos a positivos
    puntos['X'] = puntos['X'].map(x => {
        if (x<0){
            return(-x)
        }
        return x
    })
    console.log('Puntos en eje X: ', puntos['X'])
    // Calcular para cada restricción el valor Y de los puntos X
    for (let i=0; i<restricciones.length; i++){
        //restriccion de la forma 'ax + by = c' => [a, b, c]
        //despejando y, y = (c-ax)/b
        let a = restricciones[i][0]
        let b = restricciones[i][1]
        let c = restricciones[i][2]
        puntos[`restriccion${i+1}`] = puntos['X'].map(x => ((c-a*x)/b))
        console.log(`Puntos en eje Y para la restriccion${i+1}: `, puntos[`restriccion${i+1}`])
    }
    return puntos
}

function organizarPuntos(X, Y){
    /**
     * Toma los puntos X e Y y los convierte a un array de objects que
     * pueda interpretar la grafica para dibujar la restriccion
     * @param {Array} X - Puntos en eje x, comunes para todas las restricciones
     * @param {Array} Y - Puntos en eje y para una sola restricción
     * @returns {Array} Contiene los objetos que indican cada punto a graficar
     */
    let data = []
    for (let i=0; i<X.length; i++){
        data.push({
            x: X[i],
            y: Y[i]
        })
    }
    return data
}

function generarSolucion (restricciones, objetivo){
    let solucion = gauss(restricciones)
    return solucion
}
//--------------------------------------------------------------------------------
app.listen(PORT, () => (console.log("running server on port", PORT)))