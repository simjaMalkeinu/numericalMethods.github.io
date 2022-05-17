const headTable = () => {
    // estructura html de la cabecera
    $('#table').addClass('tabla');
    $('#table').html(`<table id="data">
                        <tr>
                            <th><span>x</span><i>n</i></th>
                            <th><span>X<i>n+1</i> = g(x<i>n</i>)</span></th>
                            <th><span>| x<i>n+1</i> - x<i>n</i> |</span></th>
                            <th><span>| x<i>n+1</i> - x<i>n</i>| < &epsilon;</span> </th>
                        </tr>
                    </table>`);
}

const rowsTable = (sideLeft, sideRigth, data) => {
    // hacemos distructuring del array de data
    const {funPlusX, error } = data;

    //creamos las variables auxiliares y estaticas para el metodo a programar
    var aux, xn, pm, newXn, abs,aux;
    let funGX;
    //la iteracion 1, pasamos los datos que ya calculamos 
    xn = sideLeft.x;  //x del lado izquierdo
    xx = sideRigth.x;         // x del lado derecho 
    pm = (xn+xx)/2
    console.log(xn,xx,pm);
   
    do {
        newXn = nerdamer (funPlusX, { x: pm}).evaluate ();
        funGX = Number(newXn.text());
        abs = Math.abs(pm-newXn);
        if (abs > error) {                                  // vemos si la tolerancia es menor al error
            aux = false;                                     //con la variable aux guardamos la condicion 
        } else {
            aux = true;                                    
        }
        const newData = {
            pm,
            funGX,
            abs,
            aux
        };
        iteracion(newData);
        pm = funGX;
    } while (abs > error);          // mientras que el abs, valor abstracto obtenido sea mayor al error que nos dio el usuario
}
const iteracion = (data) => {
    //mandamos por consola la iteracion
    console.log(data);

    var aux;
    //dependiendo de la variable aux del data la cambiamos a string
    if (data.aux == true) {
        aux = "SI"
    } else {
        aux = "NO";
    }

    // mostramos los datos en la tabla
    $('#data').append(`<tr>
                        <td>${data.pm.toFixed(3)}</td>
                        <td>${data.funGX.toFixed(3)}</td>
                        <td>${data.abs.toFixed(3)}</td>
                        <td>${aux}</td>
                    </tr>`);
}