const headTable = () => {
    // estructura html de la cabecera
    $('#table').addClass('tabla');
    $('#table').html(`<table id="data">
                        <tr>
                            <th><span># i</span></th> 
                            <th><span>x</span><i>n</i></span></th>
                            <th><span>f(x<i>n</i>)</span></th>
                            <th><span>x</span><i>n+1</i></span></th>
                            <th><span>f(x<i>n+1</i>)</span></th>
                            <th><span>| x<i>n+1</i> - x<i>n</i> |</span></th>
                            <th><span>| x<i>n+1</i> - x<i>n</i>| < &epsilon;</span> </th>
                        </tr>
                    </table>`);
}

const rowsTable = (sideLeft, sideRigth, data) => {
    //x^4 -x^3 -2x^2 -6x -4
    // hacemos distructuring del array de data
    const { form, error } = data;

    //creamos las variables auxiliares y estaticas para el metodo a programar
    var aux, abs, xn, newXn, funNewXn, funXn, b = [], xVector = 0;

    var a = form.split(" "), Rn, Rnn;


    for (let i = 0; i < a.length; i++) {
        aux = nerdamer(a[i], { x: 1 }).evaluate();
        a[i] = Number(aux.text());
    }

    console.log(a);

    //calculamos el punto medio
    xn = (sideLeft.x + sideRigth.x) / 2;
    aux = nerdamer(form, { x: xn }).evaluate();
    funXn = Number(aux.text());
    // console.log(pm);

    do {
        aux = a[0];
        b.push(aux);
        for (let i = 1; i < a.length; i++) {
            aux = (xn * aux) + a[i];
            b.push(aux);
        }

        Rn = aux;

        aux = a[0];
        for (let j = 1; j < b.length - 1; j++) {
            aux = (xn * aux) + b[j];
        }

        Rnn = aux;
        newXn = xn - (Rn / Rnn);
        aux = nerdamer(form, { x: newXn }).evaluate();
        funNewXn = Number(aux.text());

        abs = Math.abs(newXn - xn);                         //calculamos la tolerancia con valor abs
        if (abs > error) {                                  // vemos si la tolerancia es menor al error
            aux = false;                                     //con la variable aux guardamos la condicion 
        } else {
            aux = true;
        }

        console.log({ "Rn": Rn, "Rnn": Rnn, "xn+1": newXn });

        const newData = {
            xVector,
            xn,
            funXn,
            newXn,
            funNewXn,
            abs,
            aux
        };

        //mandamos el array a la funcion iteracion para imprimir los datos
        iteracion(newData);

        xVector++;

        // ahora el Xn+1 sera el Xn para la nueva iteracion
        xn = newXn;
        funXn = funNewXn;
        b = [];
    } while (abs > error);
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
                        <td>${data.xVector}</td>
                        <td>${data.xn}</td>
                        <td>${data.funXn}</td>
                        <td>${data.newXn}</td>
                        <td>${data.funNewXn}</td>
                        <td>${data.abs}</td>
                        <td>${aux}</td>
                    </tr>`);
}