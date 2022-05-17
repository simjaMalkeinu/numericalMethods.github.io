//funcion para validar el formulario que no llegue bacio
$('form').validate({
    rules: {
        form: "required",
        derivate: "required",
        iteractions: "required",
        a: "required",
        b: "required",
        error: "required",
        funPlusX : "required"
    },
    messages: {
        form: "campo requerido",
        derivate: "campo requerido",
        iteractions: "campo requerido",
        a: "campo requerido",
        b: "campo requerido",
        error: "campo requerido",
        funPlusX: "campo requerido"
    }
});

//funcion para obtener los datos del formulario
const getData = (e) => {
    e.preventDefault();         //este metodo cancela el evento por defecto al momento de hacer el submit

    if ($('form').valid() == false) {       // si al validar el formulario nos dice que que es false
        return;                             // retorna sin hacer nada, pero muestra los errores
    }

    var config = {};        //creamos un array para guardar los datos del formulario
    $('input').each(function () {           // vamos a recorrer todos los imputs del formulario
        config[this.name] = this.value;     // y iteramos el arreglo nombrando cada pivote con el nombre del input

    });

    $("input").attr('disabled', 'disabled');        // a todos los inputs los bloqueamos para que no pueda mover ningun dato
    $('#subir').hide();            // cambiamos el texto del boton
    $('form').addClass("activate animate__animated animate__fadeIn");       //añadimos clases con animaicones
 
    // como los datos int llegan en String los pasamos a int
    config.a = Number(config.a);        
    config.b = Number(config.b);
    config.error = Number(config.error);
    //config.iteractions = Number(config.iteractions);

    //mandamos el arreglo con los datos 
    calculate(config);
}

const calculate = (config) => {

    // hacemos distructuring al arreglo de config
    const { form, a, b } = config;

    const res = [];         // creamos un nuevo array 
    var li, ld;             // creamos variables en donde alojaremos al limite inferior y superior

    // vamos a un siclo desde el intervalo que nos dio el usuario [a, b], desde a hasta b
    for (let i = a - 1; i <= b + 1; i++) {
        let aux = nerdamer(form, { x: i }).evaluate();      //evaluamos la funcion en la coordenada x => i
        res.push({ x: i, y: Number(aux.text())});          //metemos el dato que obtuvimos en el array de coordenadas
    }

    //despues de calcular recorremos el array para encontrar los limites en donde hay un cambio de signo
    for (let i = 1; i < res.length; i++) {
        //obtenemos los valores actual y anterior del array
        const now = res[i];
        const before = res[i - 1];

        // si el valor de 'y' en el dato de ahora es negativo
        if (Math.sign(now.y) == -1) {
            // si el valor de 'y' del siguiente dato es positivo
            if (Math.sign(before.y) == 1) {
                //como hay un cambio de signo datos son nuestros limites 
                li = before;
                ld = now;
            }
        }
    }

    //mostramos en consola las coordenadas del intervalo, y los limites en que se encuentra la raiz
    console.log({ data: res, li: li, ld: ld });
    //mandamos los datos a la grafica y a la tabla
    llenarTabla(li, ld, config);
    grafica(res, a - 1, b + 1, form);
}

const llenarTabla = (sideLeft, sideRigth, data) => {
    //primero se llenan las cabeceras
    headTable();
    //luego los datos de la tabla
    rowsTable(sideLeft, sideRigth, data);
}

const grafica = (graphicData, a, b, formString) => {
    // ejemplos             //6x^(2)-2x-5           //2x^(3)-x^(2)-5x+2
                            //2x^(2)+1-e^x          //4x-e^x
    
    //Setup block

    const labels = [];      // eje x de la grafica
    const datapoints = [];  // datos de y de la grafica
    const datapointsX = [];

    for (let i = a; i <= b; ++i) {
        labels.push(i.toString());      //llenamos x
        datapointsX.push(0);            // para que se vea el eje de las x
    }

    graphicData.forEach(item => {               //recorremos el arreglo
        datapoints.push(item.y.toString());     //cada punto de y se guardara en la posicion
    });

    const data = {
        labels: labels,
        datasets: [
            {
                label: formString,
                data: datapoints,
                borderColor: 'rgb(218, 146, 48)',
                fill: false,
                cubicInterpolationMode: 'monotone',
                tension: 0.4
            },
            {
                label: "x",
                data: datapointsX,
                borderColor: 'rgb(178, 201, 194)',
                fill: false,
                cubicInterpolationMode: 'monotone',
                tension: 0.4
            }
        ]
    };

    //Config block
    const config = {
        type: 'line',
        data: data,
        options: {
            animations: {
                radius: {
                    duration: 400,
                    easing: 'linear',
                    loop: (context) => context.active
                }
            },
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "GRAFICA DE LA ECUACION: " + formString       //titulo
                },
            },
            interaction: {
                intersect: false,
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Value'
                    },
                    suggestedMin: -10,
                    suggestedMax: 10
                }
            }
        },
    };

    //Render block

    const ctx = $('#myChart');
    const myChart = new Chart(ctx, config);
}