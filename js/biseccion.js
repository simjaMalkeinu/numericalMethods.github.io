const headTable = () => {
    // estructura html de la cabecera
    $('#table').addClass('tabla');
    $('#table').html(`<table id="data">
                        <tr>
                            <th><span>x</span><i>n</i></th>
                            <th><span>x</span><i>n-1</i></th>
                            <th><span> Tolerancia </span></th>
                            <th><span> < &epsilon; </span></th>
                            <th><span>x</span><i>n+1</i></th>
                            <th><span>f(x)</span></th>
                            <th><span>f(x</span><i>n+1</i>)</th>
                            <th><span> <=0 </span> </th>
                        </tr>
                    </table>`);
}

const rowsTable = (sideLeft, sideRigth, data) => {
    // hacemos distructuring del array de data
    const { form , error } = data;

    //creamos las variables auxiliares y estaticas para el metodo a programar

    var xn, backxn, abs, aux, newXn, funXn, funBX, prodF;

    //la iteracion 1, pasamos los datos que ya calculamos 
    xn = sideRigth.x;     
    backxn = sideLeft.x;  
    funXn = sideRigth.y;  
   

    
    do {
        
        newXn = (xn+backxn)/2;    
        aux = nerdamer(form, { x: newXn }).evaluate();
        funBX = Number(aux.text());             //calculamos el nuevo Xn, o Xn+1
        prodF = funBX * funXn;
        abs = Math.abs(xn - backxn);                         //calculamos la tolerancia con valor abs
        if (abs > error) {                                  // vemos si la tolerancia es menor al error
            aux = false;                                     //con la variable aux guardamos la condicion 
        } else {
            aux = true;                                    
        }

        // construimos un nuevo array con los valores nuevos obtenidos
        const newData = {
            xn,
            backxn,
            abs,
            aux,
            newXn,
            funXn,
            funBX,
            prodF
        };
        
        //mandamos el array a la funcion iteracion para imprimir los datos
        iteracion(newData);

        // ahora el Xn+1 sera el Xn para la nueva iteracion
        

        if(prodF>0){

            xn = backxn;

        } 

        backxn = newXn;
    

        // usamos la variable aux para calcular la y del nuevo Xn
        aux = nerdamer(form, { x: xn }).evaluate();
        funXn = Number(aux.text());

        aux = nerdamer(form, { x: backxn }).evaluate();
        funBX = Number(aux.text());

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
                        <td>${data.xn.toFixed(5)}</td>
                        <td>${data.backxn.toFixed(5)}</td>
                        <td>${data.abs.toFixed(5)}</td>
                        <td>${aux}</td>
                        <td>${data.newXn.toFixed(5)}</td>
                        <td>${data.funXn.toFixed(5)}</td>
                        <td>${data.funBX.toFixed(5)}</td>
                        <td>${data.prodF.toFixed(5)}</td>
                    </tr>`);
}

