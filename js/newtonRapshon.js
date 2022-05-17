const headTable = () => {
    // estructura html de la cabecera
    $('#table').addClass('tabla');
    $('#table').html(`<table id="data">
                        <tr>
                            <th><span>x</span><i>n</i></th>
                            <th><span>f(x<i>n</i>)</span></th>
                            <th><span>f '(x<i>n</i>)</span></th>
                            <th>
                                <span>x<i>n+1</i> = x<i>n</i> -
                                    <div class="fraction">
                                        <span class="fup">f(x<i>n</i>)</span>
                                        <span class="fdn">f '(x<i>n</i>)</span>
                                    </div>

                                </span>
                            </th>
                            <th><span>| x<i>n+1</i> - x<i>n</i> |</span></th>
                            <th><span>| x<i>n+1</i> - x<i>n</i>| < &epsilon;</span> </th>
                        </tr>
                    </table>`);
}

const rowsTable = (sideLeft, sideRigth, data) => {
    // hacemos distructuring del array de data
    const { form, derivate, error } = data;

    //creamos las variables auxiliares y estaticas para el metodo a programar
    var aux, xn, funXnn, funXn, newXn, abs;

    //la iteracion 1, pasamos los datos que ya calculamos 
    xn = sideLeft.x;  //x del lado izquierdo
   // xx = sideRigth.x;         // x del lado derecho 
    funXn = sideLeft.y;         //'y' del lado izquierdo
    aux = nerdamer(derivate, { x: xn }).evaluate();         //evaluamos la derivada 0 (para este metodo)
    let derivateFun = Number(aux.text());                 //la guardamos en una constante ya que siempre sera igual.

    
    do {
        newXn = xn - (funXn / derivateFun);                 //calculamos el nuevo Xn, o Xn+1
        aux = nerdamer(derivate, { x: newXn }).evaluate();
        derivateFun = Number(aux.text());  
        abs = Math.abs(newXn - xn);                         //calculamos la tolerancia con valor abs
        if (abs > error) {                                  // vemos si la tolerancia es menor al error
            aux = false;                                     //con la variable aux guardamos la condicion 
        } else {
            aux = true;                                    
        }

        // construimos un nuevo array con los valores nuevos obtenidos
        const newData = {
            xn,
            funXn,
            derivateFun,
            newXn,
            abs,
            aux
        };
        
        //mandamos el array a la funcion iteracion para imprimir los datos
        iteracion(newData);

        // ahora el Xn+1 sera el Xn para la nueva iteracion
        xn = newXn;
        // usamos la variable aux para calcular la y del nuevo Xn
        aux = nerdamer(form, { x: xn }).evaluate();
        funXn = Number(aux.text());

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
                        <td>${data.xn.toFixed(3)}</td>
                        <td>${data.funXn.toFixed(3)}</td>
                        <td>${data.derivateFun.toFixed(3)}</td>
                        <td>${data.newXn.toFixed(3)}</td>
                        <td>${data.abs.toFixed(3)}</td>
                        <td>${aux}</td>
                    </tr>`);
}