// ==UserScript==
// @name         YouTube Music → App (iOS)
// @namespace    https://github.com/tu-usuario
// @version      1.0
// @description  Abre enlaces de YouTube Music en la app oficial de iOS desde Safari
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Esquema de URL que utiliza la app oficial de YouTube Music en iOS.
    // Basado en los esquemas registrados: vnd.youtube.music://
    const APP_SCHEME = 'vnd.youtube.music://';

    /**
     * Convierte una URL web de YouTube Music en su equivalente para la app.
     * @param {string} webUrl - URL completa (ej. https://music.youtube.com/watch?v=...)
     * @returns {string} URL con el esquema de la app (ej. vnd.youtube.music://music.youtube.com/watch?v=...)
     */
    function buildAppUrl(webUrl) {
        // Elimina el protocolo (http:// o https://) para concatenar el resto.
        const withoutProtocol = webUrl.replace(/^https?:\/\//, '');
        return APP_SCHEME + withoutProtocol;
    }

    // -----------------------------------------------------------------
    // 1. REDIRECCIÓN AUTOMÁTICA SI YA ESTAMOS EN YOUTUBE MUSIC
    // -----------------------------------------------------------------
    if (window.location.hostname === 'music.youtube.com') {
        // Construye la URL de la app y redirige.
        const appUrl = buildAppUrl(window.location.href);
        window.location.href = appUrl;
        // Detiene la ejecución del script para no interferir.
        return;
    }

    // -----------------------------------------------------------------
    // 2. INTERCEPTAR CLICS EN ENLACES A YOUTUBE MUSIC DESDE OTRAS WEBS
    // -----------------------------------------------------------------
    document.addEventListener('click', function(event) {
        // Busca el elemento <a> más cercano al clic.
        const link = event.target.closest('a');
        if (!link) return;

        const href = link.href;
        // Verifica si el enlace apunta a music.youtube.com.
        if (href && href.includes('music.youtube.com')) {
            // Evita que Safari abra el enlace en la web.
            event.preventDefault();
            // Redirige a la app.
            const appUrl = buildAppUrl(href);
            window.location.href = appUrl;
        }
    }, true); // El tercer parámetro 'true' activa la captura para interceptar antes.
})();
