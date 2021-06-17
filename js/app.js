//  variables y selectores
 const formulario = document.querySelector('#agregar-gasto');
 const gastoListado = document.querySelector('#gastos ul');
 let  presupuesto;
 

// Clases

 class Presupuesto {

    constructor(presupuesto) {
        this.presupuesto= Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }


 nuevoGasto(gasto){
     this.gastos = [...this.gastos, gasto];
     console.log(this.gastos)
     this.calcularRestante();
 }

 calcularRestante(){
 const gastado = this.gastos.reduce( (total, gasto ) => total + gasto.cantidad, 0)
 this.restante = this.presupuesto - gastado;
 }

 eliminarGasto(id){
    this.gastos = this.gastos.filter( gasto => gasto.id !== id);
    this.calcularRestante();
   
 }
}


class UI{

    insertarPresupuesto(cantidad) {
          const {presupuesto, restante } = cantidad;
                 
        //   Agregarndo el HTML
          document.querySelector('#total').textContent = presupuesto;
          document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo){
         const divMensaje = document.createElement('div');
         divMensaje.classList.add('text-center', 'alert')

         if (tipo == 'error') {
             divMensaje.classList.add('alert-danger');
         } else{
             divMensaje.classList.add('alert-success');
         }
         divMensaje.textContent = mensaje;
         document.querySelector('.primario').insertBefore(divMensaje, formulario);


         setTimeout(() => {
             divMensaje.remove();
         }, 3000);
   
    }

    mostrarGastos( gastos ) {

        this.limpiarHTML();
       
        gastos.forEach(gasto => {

            const {cantidad,nombre,id } = gasto;

            // LI
             const nuevoGasto = document.createElement('li');
             nuevoGasto.className = 'list-group-item justify-content-between aling-items-center';
             nuevoGasto.dataset.id = id;

            // AGREGAR HTML
             nuevoGasto.innerHTML = `${nombre} <span class= "badge badge-primary badge-pill"> $ ${cantidad}</span>`;




            // ELIMINAR GASTO
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'btn-gasto');
            btnBorrar.innerHTML = 'Borrar  &times;';
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            };
                
            
            nuevoGasto.appendChild(btnBorrar);

            gastoListado.appendChild(nuevoGasto);

        });
    }

    limpiarHTML(){
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante){

        document.querySelector('#restante').textContent = restante;

    }

    comprobarPresupuesto(presupuestoObj){
        const{ presupuesto, restante} = presupuestoObj;
        const restateDiv = document.querySelector('.restante');

        // comprobar 25%
        if (presupuesto / 4 > restante) {
            restateDiv.classList.remove('alert-success', 'alert-warning');
            restateDiv.classList.add('alert-danger');
        }
        else if ( (presupuesto / 2 )> restante){
            restateDiv.classList.remove('alert-success');
            restateDiv.classList.add('alert-warning');
        }else{
            restateDiv.classList.remove('alert-danger', 'alert-warning');
            restateDiv.classList.add('alert-succes');
        }


            //Si el total es menor a 0  
        if (restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', ' error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }

    }
    
}


const ui = new UI();


// Eventos

eventListeners();
 function eventListeners() {
     document.addEventListener('DOMcontentLoaded', preguntarPresupuesto());
     formulario.addEventListener('submit', agregarGasto);

 }




// Funciones

  function preguntarPresupuesto() {

    const presupuestoUsuario = prompt('Cual es tu presupuesto?');

    if ( !presupuestoUsuario  || presupuestoUsuario <= 0) {
        window.location.reload();
    }
    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e) {
    e.preventDefault();

    // Leer los datos del formulario
      const nombre = document.querySelector('#gasto').value;
      const cantidad = Number(document.querySelector('#cantidad').value);


        // Validar 
        if (nombre === '' || cantidad === '') {
           ui.imprimirAlerta('Ambos campos son obligatorios','error');
           return;
        } else if (cantidad <= 0|| isNaN(cantidad))   {
            ui.imprimirAlerta('no es una cantidad permitida' , 'error');
            return;
        }


        // objet literal en hansmen
        // hace lo contrario al destructuring este agrega a gastos estos 3 elementos
        // agrega un nuevo gasto
       const gasto ={nombre , cantidad, id:Date.now() }
       presupuesto.nuevoGasto(gasto);
        ui.imprimirAlerta('Gasto agregado correctamente');


    // imprimir el html
        const {gastos, restante} = presupuesto;
       ui.mostrarGastos(gastos);
       ui.actualizarRestante(restante);
       ui.comprobarPresupuesto(presupuesto);


    // resetear form
       formulario.reset();

        }

       function eliminarGasto(id){
            presupuesto.eliminarGasto(id)
            const { gastos, restante} = presupuesto;
            ui.mostrarGastos(gastos);
            ui.actualizarRestante(restante);
            ui.comprobarPresupuesto(presupuesto);
        }



