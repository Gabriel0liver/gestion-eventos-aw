$(document).ready(function () {
    $("#searchForm").on("submit", function (e) {
        e.preventDefault();
        const query = $("#searchQuery").val();
        const date = $("#filterDate").val();
        const location = $("#filterLocation").val();
        const capacityType = $("#filterCapacityType").val();
        const capacity = $("#filterCapacity").val();
        const eventType = $("#filterEventType").val();

        $.ajax({
            url: "/eventos",
            type: "GET",
            data: {
                query: query,
                date: date,
                location: location,
                capacityType: capacityType,
                capacity: capacity,
                eventType: eventType
            },
            success: function (response) {
                $(".eventos").html(response);
            },
            error: function () {
                alert("Error al buscar eventos");
            }
        });
    });
    //Inscripción
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

    //Desinscrir
    $(document).on('click', '.btn-desinscribirse', function () {
        const eventoId = $(this).data('id');
        const usuarioId = $(this).data('usuario');

        $.ajax({
            url: '/inscripciones/desinscribir',
            type: 'POST',
            data: {
                eventoId: eventoId,
                usuarioId: usuarioId
            },
            success: function (response) {
                $(`#evento-${eventoId}`).html(response);
            },
            error: function () {
                alert('Error al desinscribirse');
            }
        });
    });
});
