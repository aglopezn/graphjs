/**
 * @fileoverview Contiene la logica para resolver el sistema de ecuaciones
 *  mediante el metodo grafico.
 */

const submitMetodoGrafico = document.getElementById("calcularGrafico")
submitMetodoGrafico.addEventListener("click", calcularMetodoGrafico)


function calcularMetodoGrafico() {
    /**
     * Es la función que llama al servicio para resolver el sistema.
     */
    let xhr = new XMLHttpRequest()
    let json = crearJSON()
    xhr.onreadystatechange = () =>{
        if (xhr.readyState == 4 && xhr.status == 200){
            let resultado = JSON.parse(xhr.responseText)
            mostrarGrafica()
            crearGrafica(resultado.grafica)
        }
    }
    xhr.open(formMetodoGrafico.method, formMetodoGrafico.action, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(json)
}

function crearJSON() {
    /**
     * Crea el JSON con los datos del formulario que serán enviados al servicio.
     * @returns {JSON} Contiene los datos del formulario.
     */
    const formMetodoGrafico = document.getElementById("formMetodoGrafico")
    let formData = new FormData(formMetodoGrafico)
    let object = {};
    formData.forEach((value, key) => {
        if(!Reflect.has(object, key)){
            object[key] = value;
            return;
        }
        if(!Array.isArray(object[key])){
            object[key] = [object[key]];    
        }
        object[key].push(value);
    });
    let json = JSON.stringify(object);
    return json
}

function mostrarGrafica() {
    /**
     * Permite visibilizar el div donde se grafica el sistema.
     */
    const chartContainer = document.getElementById("chartContainer")
    chartContainer.classList.remove("invisible")
}

function crearGrafica (resultado) {
    /**
     * Usa la libreria ChartJS para graficar las restricciones.
     * @param {JSON} resultado - Contiene los datasets para graficar cada restriccion.
     */
    var chart = document.getElementById("chart")
    var ctx = chart.getContext('2d')
    let datasets = new Array()
    Object.keys(resultado).forEach( key => {datasets.push(resultado[key])})
    console.log(datasets)
    var lineChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets
        }
    })
}