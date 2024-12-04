$(document).ready(function () {
    //Cargar eventos
    $.ajax({
        url: '/eventos/mis-eventos',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            $('#eventos-container').empty();
            if (data.eventos.length > 0) {
                let tabla = `
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Imagen</th>
                                <th>Título</th>
                                <th>Descripción</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Ubicación</th>
                                <th>Capacidad Máxima</th>
                                <th>Tipo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>c`;
                data.eventos.forEach(evento => {
                    tabla += 
                        `<tr data-id="${evento.id}">
                            <td><img src="${evento.foto ? '/fotos/' + evento.foto : '/fotos/default.jpg'}" alt="Foto del Evento" class="img-thumbnail" width="100"></td>
                            <td>${evento.titulo}</td>
                            <td>${evento.descripcion}</td>
                            <td>${evento.fecha}</td>
                            <td>${evento.hora}</td>
                            <td>${evento.ubicacion}</td>
                            <td>${evento.capacidad_maxima}</td>
                            <td>${evento.tipo}</td>
                            <td>
                                <button class="btn btn-success btn-sm btnGestionar" data-id="${evento.id}">Gestionar</button>
                                <button class="btn btn-info btn-sm btnDetalle">Detalle</button>
                                <button class="btn btn-warning btn-sm btnEditar">Editar</button>
                                <button class="btn btn-danger btn-sm btnEliminar">Eliminar</button>
                            </td>
                        </tr>`;
                });
                    tabla += `</tbody></table>`;
                    $('#eventos-container').html(tabla);
                } else {
                    $('#eventos-container').html('<p class="text-muted">No tienes eventos creados.</p>');
                }
            },
            error: function (err) {
                console.error('Error al cargar eventos:', err);
                $('#eventos-container').html('<p class="text-danger">Error al cargar los eventos.</p>');
            }
        });
    
    //Mostrar en detalle
    $(document).on('click', '.btnDetalle', function () {
        const eventoId = $(this).closest('tr').data('id');
        $.ajax({
            url: `/eventos/detalle/${eventoId}`,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                const evento = data.evento;
                $('#detalleEvento').html(`
                    <strong>Título:</strong> ${evento.titulo} <br>
                    <strong>Descripción:</strong> ${evento.descripcion} <br>
                    <strong>Fecha:</strong> ${evento.fecha} <br>
                    <strong>Hora:</strong> ${evento.hora} <br>
                    <strong>Ubicación:</strong> ${evento.ubicacion} <br>
                    <strong>Capacidad Máxima:</strong> ${evento.capacidad_maxima} <br>
                    <strong>Tipo:</strong> ${evento.tipo} <br>
                    <strong>Foto:</strong><br>
                    <img src="${evento.foto ? '/fotos/' + evento.foto : '/fotos/default.jpg'}" alt="Foto del Evento" class="img-fluid" width="200"> 
                `);
                $('#modalDetalle').modal('show');
            }
        });
    });

    //Mostrar en modal de edición
    $(document).on('click', '.btnEditar', function () {
        const eventoId = $(this).closest('tr').data('id');
        $.ajax({
            url: `/eventos/detalle/${eventoId}`,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                const evento = data.evento;
                $('#eventoId').val(evento.id);
                $('#titulo').val(evento.titulo);
                $('#descripcion').val(evento.descripcion);
                $('#fecha').val(evento.fecha);
                $('#hora').val(evento.hora);
                $('#ubicacion').val(evento.ubicacion);
                $('#capacidad_maxima').val(evento.capacidad_maxima);
                $('#tipo').val(evento.tipo);
                $('#modalEditar').modal('show');
            }
        });
    });

    //Mostrar en modal de edición
    $(document).on('click', '.btnEditar', function () {
        const eventoId = $(this).closest('tr').data('id');
        $.ajax({
            url: `/eventos/detalle/${eventoId}`,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                const evento = data.evento;
                $('#eventoId').val(evento.id);
                $('#titulo').val(evento.titulo);
                $('#descripcion').val(evento.descripcion);
                $('#fecha').val(evento.fecha);
                $('#hora').val(evento.hora);
                $('#ubicacion').val(evento.ubicacion);
                $('#capacidad_maxima').val(evento.capacidad_maxima);
                $('#modalEditar').modal('show');
                }
            });
        });
    
    //Eliminar evento
    $(document).on('click', '.btnEliminar', function () {
        const eventoId = $(this).closest('tr').data('id');
        if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
            $.ajax({
                url: `/eventos/eliminar/${eventoId}`,
                method: 'DELETE',
                success: function (data) {
                    alert('Evento eliminado con éxito');
                    location.reload(); // Recargar la página para reflejar los cambios
                },
                error: function (err) {
                    console.error('Error al eliminar el evento:', err);
                    alert('Error al eliminar el evento.');
                }
            });
        }
    });

    });

    $(document).on('submit', '#formEditarEvento', function (e) {
        e.preventDefault(); 

        const formData = new FormData();
        formData.append('titulo', $('#titulo').val());
        formData.append('descripcion', $('#descripcion').val());
        formData.append('fecha', $('#fecha').val());
        formData.append('hora', $('#hora').val());
        formData.append('ubicacion', $('#ubicacion').val());
        formData.append('capacidad_maxima', $('#capacidad_maxima').val());
        formData.append('tipo', $('#tipo').val());

        const foto = $('#fotoEditar')[0].files[0];
        if (foto) {
            formData.append('foto', foto);
        }

        const eventoId = $('#eventoId').val();

        $.ajax({
            url: `/eventos/editar/${eventoId}`, 
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                alert('Evento actualizado con éxito');
                $('#modalEditar').modal('hide');
                location.reload();
            },
            error: function (err) {
                console.error('Error al editar evento:', err);
                alert('Error al editar el evento.');
            }
        });
    });

    //Mostrar en el modal de añadir
    $('#btnAnyadir').click(function () {
        $('#modalAnyadir').modal('show');
    });

    $('#formAnyadirEvento').submit(function (e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('titulo', $('#tituloAnyadir').val());
    formData.append('descripcion', $('#descripcionAnyadir').val());
    formData.append('fecha', $('#fechaAnyadir').val());
    formData.append('hora', $('#horaAnyadir').val());
    formData.append('ubicacion', $('#ubicacionAnyadir').val());
    formData.append('capacidad_maxima', $('#capacidad_maximaAnyadir').val());
    formData.append('tipo', $('#tipoAnyadir').val());

    const foto = $('#fotoAnyadir')[0].files[0];
    if (foto) {
        formData.append('foto', foto);
    }

    $.ajax({
        url: '/eventos/Anyadir',
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            $('#modalAnyadir').modal('hide');
            alert('Evento añadido con éxito.');
            location.reload();
        },
        error: function (err) {
            console.error('Error al añadir el evento:', err.responseText || err);
            alert('Error al añadir el evento. Revisa la consola para más detalles.');
        }
    });
});

$(document).ready(function () {
        // Mostrar en modal de gestionar
        $(document).on('click', '.btnGestionar', function () {
            const eventoId = $(this).data('id');
            $.ajax({
                url: `/eventos/inscripciones/${eventoId}`,
                method: 'GET',
                dataType: 'json',
                success: function (data) {
                    const inscripciones = data.inscripciones;
                    let inscritosHtml = '';
                    let esperaHtml = '';

                    inscripciones.forEach(inscripcion => {
                        if(inscripcion.estado == "inscrito"){
                            inscritosHtml += `
                            <tr>
                                <td>${inscripcion.nombre}</td>
                                <td>
                                    <button class="btn btn-danger btn-sm btnEliminarInscripcion" data-id="${inscripcion.id}">Eliminar</button>
                                </td>
                            </tr>
                        `;
                        }else{
                            esperaHtml += `
                            <tr>
                                <td>${inscripcion.nombre}</td>
                                <td>
                                    <button class="btn btn-success btn-sm btnAscenderInscripcion" data-id="${inscripcion.id}">Ascender</button>
                                    <button class="btn btn-danger btn-sm btnEliminarInscripcion" data-id="${inscripcion.id}">Eliminar</button>
                                </td>
                            </tr>
                        `;
                        }
                        
                    });

                    $('#inscritos-list').html(inscritosHtml);
                    $('#espera-list').html(esperaHtml);
                    $('#modalGestionar').modal('show');
                },
                error: function (err) {
                    console.error('Error al cargar inscripciones:', err);
                }
            });
        });

        // Eliminar inscripción
        $(document).on('click', '.btnEliminarInscripcion', function () {
            const inscripcionId = $(this).data('id');
            console.log(inscripcionId);
            if (confirm('¿Estás seguro de que deseas eliminar esta inscripción?')) {
                $.ajax({
                    url: `/eventos/eliminar-inscripcion`,
                    method: 'POST',
                    data: { inscripcionId },
                    success: function () {
                        alert('Inscripción eliminada correctamente.');
                        location.reload();
                    },
                    error: function (err) {
                        console.error('Error al eliminar inscripción:', err);
                        alert('Error al eliminar inscripción.');
                    }
                });
            }
        });

        // Ascender inscripción
        $(document).on('click', '.btnAscenderInscripcion', function () {
            const inscripcionId = $(this).data('id');
            $.ajax({
                url: `/eventos/ascender-inscripcion`,
                method: 'POST',
                data: { inscripcionId },
                success: function () {
                    alert('Inscripción ascendida correctamente.');
                    location.reload();
                },
                error: function (err) {
                    console.error('Error al ascender inscripción:', err);
                    alert(err.responseJSON.error || 'Error al ascender inscripción.');
                }
            });
        });
    });
