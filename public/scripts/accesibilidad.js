const pequeno = "0.75em";
const mediano = "1em";
const grande = "1.3em";

fetch('/accesibilidad', {
    method: 'GET'
}).then(response => response.json())
.then(data => {
    const configuracion = data.configuracion;
    if (configuracion.paleta_colores) {
        switch(configuracion.paleta_colores) {
            case 'daltonismo':
                document.body.classList.add('daltonismo');
                document.getElementById('paletaColores').value = 'daltonismo';
                break;
            case 'alto_contraste':
                document.body.classList.add('alto-contraste');
                document.getElementById('paletaColores').value = 'alto-contraste';
                break;
            case 'default':
                document.getElementById('paletaColores').value = 'default';
                break;
        }
    }
    if (configuracion.tamano_fuente) {
        switch(configuracion.tamano_fuente){
            case 'pequeno':
                document.documentElement.style.fontSize = pequeno; // Ajustar tamaño de texto
                document.getElementById('tamanoFuente').value = 'pequeno';
                break;
            case 'mediano':
                document.documentElement.style.fontSize = mediano; // Ajustar tamaño de texto
                document.getElementById('tamanoFuente').value = 'mediano';
                break;
            case 'grande':
                document.documentElement.style.fontSize = grande; // Ajustar tamaño de texto
                document.getElementById('tamanoFuente').value = 'grande';
                break;
        }
        
    }
    if (configuracion.navegacion_teclado) {
        activarNavegacionPorTeclado(); // Activar funciones de teclado
    }
})
.catch(err => console.error('Error al cargar configuraciones:', err));

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('tamanoFuente').addEventListener('change', function() {
        cambiarTamanoFuente(this.value);
    });

    document.getElementById('paletaColores').addEventListener('change', function() {
        cambiarPaletaColores(this.value);
    });
});

function cambiarTamanoFuente(tamano) {
    document.documentElement.style.fontSize = tamano === 'pequeno' ? pequeno : tamano === 'mediano' ? mediano : grande;
}

function cambiarPaletaColores(paleta) {
    document.body.classList.remove('daltonismo', 'alto-contraste');
    if (paleta !== 'default') {
        document.body.classList.add(paleta);
    }
}

function guardarConfiguracion() {
    const tamanoFuente = document.getElementById('tamanoFuente').value;
    const paletaColores = document.getElementById('paletaColores').value;

    const configuracion = {
        tamano_fuente: tamanoFuente,
        paleta_colores: paletaColores
    };

    if(paletaColores === 'alto-contraste') {
        configuracion.paleta_colores = 'alto_contraste';
    }
    
    console.log(configuracion)

    fetch('/accesibilidad/editar', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(configuracion)
    }).then(response => {
        if (response.ok) {
            alert('Configuración guardada');
        } else {
            alert('Error al guardar configuración');
        }
    }).catch(error => {
        console.error('Error:', error);
        alert('Error al guardar configuración');
    });
}