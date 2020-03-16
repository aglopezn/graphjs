const submitMetodoGrafico = document.getElementById("calcularGrafico")
submitMetodoGrafico.addEventListener("click", mostrarResultado)




function mostrarResultado() {
    let xhr = new XMLHttpRequest()
    let grafica = document.getElementById("grafica")
    let json = crearJSON()
    xhr.onreadystatechange = () =>{
        if (xhr.readyState == 4 && xhr.status == 200){
            grafica.innerHTML = xhr.responseText
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.open(formMetodoGrafico.method, formMetodoGrafico.action, true)
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