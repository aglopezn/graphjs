const submitMetodoGrafico = document.getElementById("calcularGrafico")
submitMetodoGrafico.addEventListener("click", calcularMetodoGrafico)


function calcularMetodoGrafico() {
    let xhr = new XMLHttpRequest()
    let json = crearJSON()
    xhr.onreadystatechange = () =>{
        if (xhr.readyState == 4 && xhr.status == 200){
            let resultado = JSON.parse(xhr.responseText)
            mostrarGrafica()
            crearGrafica(resultado)

        }
    }
    xhr.open(formMetodoGrafico.method, formMetodoGrafico.action, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(json)
}

function crearJSON() {
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
    const chartContainer = document.getElementById("chartContainer")
    chartContainer.classList.remove("invisible")
}

function crearGrafica (resultado) {
    var chart = document.getElementById("chart")
    var ctx = chart.getContext('2d')
    let datasets = new Array()
    Object.keys(resultado).forEach( key => {datasets.push(resultado[key])})
    datasets.pop()
    console.log(datasets)
    var lineChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets
        }
    })
}