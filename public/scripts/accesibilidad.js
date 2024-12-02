fetch('/accesibilidad', {
    method: 'GET'
}).then(response => response.json())
.then(data => {
    const configuracion = data.configuracion;
    if (configuracion.paleta_colores) {
        switch(configuracion.paleta_colores) {
            case 'daltonismo':
                document.body.classList.add('daltonismo');
                break;
            case 'alto_contraste':
                document.body.classList.add('alto-contraste');
                break;
            case 'default':
                document.documentElement.style.removeProperty('--bs-primary');
                document.documentElement.style.removeProperty('--bs-secondary');
                document.documentElement.style.removeProperty('--bs-success');
                document.documentElement.style.removeProperty('--bs-info');
                document.documentElement.style.removeProperty('--bs-warning');
                document.documentElement.style.removeProperty('--bs-danger');
                document.documentElement.style.removeProperty('--bs-light');
                document.documentElement.style.removeProperty('--bs-dark');
                break;
        }
    }
    if (configuracion.tamano_fuente) {
        switch(configuracion.tamano_fuente){
            case 'pequeno':
                document.documentElement.style.fontSize = `0.75em`; // Ajustar tamaño de texto
                break;
            case 'mediano':
                document.documentElement.style.fontSize = `1em`; // Ajustar tamaño de texto
                break;
            case 'grande':
                document.documentElement.style.fontSize = `1.3em`; // Ajustar tamaño de texto
                break;
        }
        
    }
    if (configuracion.navegacion_teclado) {
        activarNavegacionPorTeclado(); // Activar funciones de teclado
    }
})
.catch(err => console.error('Error al cargar configuraciones:', err));

