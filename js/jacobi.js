$('form').validate({
    rules: {
        form: "required",
        derivate: "required",
        iteractions: "required",
        a: "required",
        b: "required",
        error: "required",
        funPlusX: "required",
    },
    messages: {
        form: "campo requerido",
        derivate: "campo requerido",
        iteractions: "campo requerido",
        a: "campo requerido",
        b: "campo requerido",
        error: "campo requerido",
        funPlusX: "campo requerido",
    }
});

const llenarMatriz = (e) => {
    e.preventDefault();
    const tam = document.getElementById('tam').value;

    if (tam == "") {
        alert('digita un tamaño para la matriz cuadrada');
    } else {
        const matriz = document.getElementById('matriz');
        const valInd = document.getElementById('valInd');
        matriz.innerHTML = "";
        valInd.innerHTML = "";
        matriz.style.gridTemplateColumns = "repeat(" + tam + ", 1fr)";
        valInd.style.gridTemplateColumns = "repeat(" + tam + ", 1fr)";
        for (let i = 1; i <= Number(tam); i++) {
            for (let j = 1; j <= Number(tam); j++) {
                matriz.innerHTML += `<input type="text" name="m${i + "" + j}" placeholder="${i},${j}" class="item-matriz" required>`;
            }
            valInd.innerHTML += `<input type="text" name="v${i}" placeholder="ecuacion ${i}" class="item-val" required>`;
        }
    }
}

//funcion para obtener los datos del formulario
const getData = (e) => {
    e.preventDefault();         //este metodo cancela el evento por defecto al momento de hacer el submit

    if ($('form').valid() == false) {       // si al validar el formulario nos dice que que es false
        return;                             // retorna sin hacer nada, pero muestra los errores
    }

    $('#btnMatriz').hide();
    var config = {
        matriz: [],
        valInd: []
    };        //creamos un array para guardar los datos del formulario

    let i = 0;
    var aux = {};
    var tam;


    $('input').each(function () {           // vamos a recorrer todos los imputs del formulario
        const val = this.value;

        if (this.name === "tam") {
            tam = Number(val);
        }

        if (this.name.charAt(0) == "m") {
            aux[i] = Number(val);
            i++;
            if (i == tam) {
                config.matriz.push(aux);
                i = 0;
                aux = {};
            }
        } else if (this.name.charAt(0) == "v") {
            config.valInd.push(Number(val));
        } else {
            config[this.name] = this.value;     // y iteramos el arreglo nombrando cada pivote con el nombre del input
        }
    });

    $("input").attr('disabled', 'disabled');        // a todos los inputs los bloqueamos para que no pueda mover ningun dato
    $('#subir').html("Modificar datos");            // cambiamos el texto del boton
    $('form').addClass("activate animate__animated animate__fadeIn");       //añadimos clases con animaicones

    // como los datos int llegan en String los pasamos a int
    config.tam = Number(config.tam);
    config.error = Number(config.error);

    // console.log(config);
    headTable();
    calcular(config);
}

const headTable = () => {
    // estructura html de la cabecera
    $('#table').addClass('tabla');
    $('#table').html(`<table id="data">
                        <tr>
                            <th><span>x</span><i></i></th>
                            <th><span>x<i>1</i></span></th>
                            <th><span>x<i>2</i></span></th>
                            <th><span>x<i>3</i></span></th>
                            <th><span>| x<i>n+1</i> - x<i>n</i> |</span></th>
                            <th><span>| x<i>n+1</i> - x<i>n</i>| < &epsilon;</span>
                            </th>
                        </tr>
                    </table>`);
}

const calcular = (data) => {
    //aplicar el metodo de jacobi
    const { matriz, valInd, tam, error } = data;

    var xn = {}, newXn = {}, xVector = 0;
    for (let i = 0; i < tam; i++) {
        xn[i] = valInd[i] / matriz[i][i];
    }

    do {
        for (var i = 0; i < tam; i++) {
            var aux = 0;
            for (var j = 0; j < tam; j++) {

                if (i != j) {
                    aux += (matriz[i][j] * xn[j]) * (-1);
                }
            }
            aux = aux + valInd[i];
            aux = aux / matriz[i][i];
            // console.log(aux);
            newXn[i] = aux;
        }

        xVector++;
        var abs = 0, aux;
        for (let i = 0; i < tam; i++) {
            abs += newXn[i] - xn[i];
        }

        abs = Math.abs(abs);
        abs = Math.sqrt(abs);

        if (abs > error) {                                  // vemos si la tolerancia es menor al error
            aux = false;                                     //con la variable aux guardamos la condicion 
        } else {
            aux = true;
        }

        const newData = {
            newXn,
            error,
            abs,
            aux,
            tam,
            xVector
        };

        //mandamos el array a la funcion iteracion para imprimir los datos
        iteracion(newData);

        xn = newXn;
        newXn = {};
        //console.log(newData);

    } while (abs > error);


}

const iteracion = (data) => {
    //mandamos por consola la iteracion
    // console.log(data);

    var aux, cadena = "";
    //dependiendo de la variable aux del data la cambiamos a string
    if (data.aux == true) {
        aux = "SI"
    } else {
        aux = "NO";
    }

    // mostramos los datos en la tabla
    // const tabla = document.getElementById("table");

    cadena = `<tr>
            <td>${data.xVector}</td>`;

    for (let i = 0; i < data.tam; i++) {
        cadena += `<td>${data.newXn[i]}</td>`;
    }


    cadena += `<td>${data.abs}</td>
                <td>${aux}</td>
                </tr>`;

    $('#data').append(cadena);

}