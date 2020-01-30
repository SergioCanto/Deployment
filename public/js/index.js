function loadComments(){

    let url = "https://safe-spire-19122.herokuapp.com/blog-api/comentarios";
    let settings = {
        method : "GET"
    };

    fetch(url, settings)
        .then(response => {
            if(response.ok){
                return response.json();
            }
        })
        .then(responseJSON => {
            displayResults(responseJSON);
        });

}

function autorComments(){

    $('#buscar').on('click', function(e){

        let autorBuscar = $('#autorBuscar');

        let url = "https://safe-spire-19122.herokuapp.com/blog-api/comentarios-por-autor?autor=" + autorBuscar.value;
        let settings = {
            method : "GET"
        };

        fetch(url, settings)
            .then(response => {
                if(response.ok){
                    $('#commentAutor').empty();
                    return response.json();
                }
            })
            .then(responseJSON => {
                $('#commentAutor').empty();

                for(let i = 0; i < responseJSON.length; i++){
            
                    $('#commentList').append(`
                        <div class="paragraph">
                            <li>
                                <span class="sub"> ID: </span> ${responseJSON[i].id}
                            </li>
                            <li>
                                <span class="sub"> Titulo: </span> ${responseJSON[i].titulo}
                            </li>
                            <li>
                                <span class="sub"> Contenido: </span> ${responseJSON[i].contenido}
                            </li>
                            <li>
                                <span class="sub"> Autor: </span> ${responseJSON[i].autor}
                            </li>
                            <li>
                                <span class="sub"> Fecha: </span> ${responseJSON[i].fecha}
                            </li>
                        </div>
                    `)
                }
                });
            });
}

function addComment(){

    let agregar = $( '#agregar' );
  
    $(agregar).on('click', function(e){
        
        e.preventDefault();

        let titulo = $('#Titulo').val();
        let contenido = $('#Contenido').val();
        let autor = $('#Autor').val();

        let url = 'https://safe-spire-19122.herokuapp.com/blog-api/nuevo-comentario';
        let data = {
            autor: autor.value,
            titulo: titulo.value,
            contenido: contenido.value
        }

        let settings = {
            method: "POST",
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify(data)
        };

        fetch(url, settings)
            .then(response => {
                if (response.ok) {
                    autor.value = '';
                    contenido.value = '';
                    titulo.value = '';
                    return response.json();
                }
            })
            .then(responseJSON => {
                loadComments();
            });
    });

}

function actualizarComment(){

    let editar = $( '#editar' );
  
    $(editar).on('click', function(e){
        
        e.preventDefault();

        let id = $('#id');
        let titulo = $('#Titulo').val();
        let contenido = $('#Contenido').val();
        let autor = $('#Autor').val();

        let url = 'https://safe-spire-19122.herokuapp.com/blog-api/actualizar-comentario/' + id.value;
        let settings = {
            method: "PUT",
            headers: { "Content-type": "application/json"},
            body: JSON.stringify({
                id: id.value,
                autor: autor.value,
                titulo: titulo.value,
                contenido: contenido.value
            })
        };
        fetch(url, settings)
            .then(response => {
                if (response.ok) {
                    autor.value = '';
                    contenido.vContenido = '';
                    titulo.value = '';
                    id.value = '';
                    return response.json();
                }
            })

            .then(responseJSON => {
                loadComments();
            });
    });

}

function deleteComment(){

    let eliminar = $( '#eliminar' );
  
    $(eliminar).on('click', function(e){
        
        e.preventDefault();

        let id = $('#id');

        let url = 'https://safe-spire-19122.herokuapp.com/blog-api/remover-comentario/' + id.value;
        let settings = {
            method: "DELETE"
        };
        fetch(url, settings)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            })

            .then(responseJSON => {
                loadComments();
            });
    });

}

function displayResults(responseJSON){

    $('#commentList').empty();

    for(let i = 0; i < responseJSON.length; i++){
        $('#commentList').append(`
            <div class="paragraph">
                <li>
                    <span class="sub"> ID: </span> ${responseJSON[i].id}
                </li>
                <li>
                    <span class="sub"> Titulo: </span> ${responseJSON[i].titulo}
                </li>
                <li>
                    <span class="sub"> Contenido: </span> ${responseJSON[i].contenido}
                </li>
                <li>
                    <span class="sub"> Autor: </span> ${responseJSON[i].autor}
                </li>
                <li>
                    <span class="sub"> Fecha: </span> ${responseJSON[i].fecha}
                </li>
            </div>
        `)
    }

}

function init(){
    loadComments();
    addComment();
    actualizarComment();
    deleteComment();
    autorComments();
}

init();