//cargar notificaciones cada 5 sec
setInterval(() => {
    cargarNotificaciones();
}, 5000);

$('#notificacionesModal').on('show.bs.modal', function () {
    cargarNotificaciones();
});

//cargar notificaciones
function cargarNotificaciones() {
    $.ajax({
        url: '/notificaciones',
        method: 'GET',
        success: function(data) {
            const listaNotificaciones = $('#listaNotificaciones');
            listaNotificaciones.empty();

            data.notificaciones.forEach(function(notificacion) {
                const claseNuevo = notificacion.leida ? '' : 'text-danger';
                const textoNuevo = notificacion.leida ? '' : '[Nuevo]';

                listaNotificaciones.append(`
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <span class="${claseNuevo}">${textoNuevo} ${notificacion.mensaje}</span>
                        <button class="btn btn-sm btn-link" onclick="marcarComoVisto(${notificacion.id})">Marcar como visto</button>
                    </li>
                `);
            });
        },
        error: function() {
            console.error('Error al cargar las notificaciones');
        }
    });
}

//marcar notificación como vista
function marcarComoVisto(id) {
    $.ajax({
        url: `/notificaciones/visto/${id}`,
        method: 'POST',
        success: function(response) {
            alert(response.message);
            cargarNotificaciones();

        },
        error: function() {
            console.error('Error al marcar la notificación como vista');
        }
    });
}