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
    var lineChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Restricción 1',
                backgroundColor: 'rgba(67, 176, 114, 0.5)',
                bordercolor: 'rgba(67, 176, 114, 1)',
                showLine: true,
                data: [{
                    x:resultado.restriccion1[0].x,
                    y:resultado.restriccion1[0].y
                },{
                    x:resultado.restriccion1[1].x, 
                    y:resultado.restriccion1[1].y
                }]

            }, {
                label: 'Restricción 2',
                backgroundColor: 'rgba(176, 149, 102, 0.5)',
                bordercolor: 'rgba(176, 149, 102, 1)',
                showLine: true,
                data: [{
                    x:resultado.restriccion2[0].x,
                    y:resultado.restriccion2[0].y
                },{
                    x:resultado.restriccion2[1].x, 
                    y:resultado.restriccion2[1].y
                }]
            }],
        }
    })
    debugger
}