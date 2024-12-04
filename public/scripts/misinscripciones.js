$(document).ready(function () {
    $(document).on('click', '.btn-desinscribirse', function () {

        const eventoId = $(this).data('id');
        $.ajax({
            url: '/inscripciones/desinscribir',
            type: 'POST',
            data: { eventoId: eventoId },
            success: function (response) {
                $(`#evento-${eventoId}`).html(response);
            },
            error: function (error) {
                alert('Error al desinscribirse');
            }
        });
    });
});

$(document).on('click', '.btn-inscribirse', function () {
        const eventoId = $(this).data('id');
        const usuarioId = $(this).data('usuario');

        $.ajax({
            url: '/inscripciones/inscribir',
            type: 'POST',
            data: {
                eventoId: eventoId,
                usuarioId: usuarioId
            },
            success: function (response) {
                $(`#evento-${eventoId}`).html(response);
            },
            error: function () {
                alert('Error al inscribirse');
            }
        });
    });