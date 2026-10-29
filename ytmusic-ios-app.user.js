// ==UserScript==
// @name         YouTube Music → App (iOS)
// @namespace    https://github.com/twozerozerofour
// @version      1.1
// @description  Abre enlaces de YouTube Music en la app oficial de iOS desde Safari
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Esquema URL registrado por la app oficial de YouTube Music en iOS.
    const APP_SCHEME = 'vnd.youtube.music://';

    // Hostnames de YouTube Music que deben abrirse en la app.
    const MUSIC_HOSTS = new Set([
        'music.youtube.com',
        'app.music.youtube.com'
    ]);

    /**
     * Comprueba si una URL pertenece a YouTube Music.
     * @param {string} url - URL absoluta o relativa.
     * @returns {boolean}
     */
    function isMusicUrl(url) {
        try {
            return MUSIC_HOSTS.has(new URL(url, location.href).hostname);
        } catch {
            return false;
        }
    }

    /**
     * Convierte una URL web de YouTube Music en su equivalente para la app.
     *
     * Por defecto se conserva el hostname original (music.youtube.com o
     * app.music.youtube.com). Si descubres que la app no reconoce el
     * segundo, descomenta el bloque "Opción B" para normalizarlo.
     */
    function buildAppUrl(webUrl) {
        const u = new URL(webUrl, location.href);

        // --- Opción B (descomenta si es necesario) ---
        // if (u.hostname === 'app.music.youtube.com') {
        //     u.hostname = 'music.youtube.com';
        // }
        // ---------------------------------------------

        const withoutProtocol = u.href.replace(/^https?:\/\//, '');
        return APP_SCHEME + withoutProtocol;
    }

    // -----------------------------------------------------------------
    // 1. REDIRECCIÓN AUTOMÁTICA SI YA ESTAMOS EN YOUTUBE MUSIC
    // -----------------------------------------------------------------
    if (MUSIC_HOSTS.has(location.hostname)) {
        window.location.href = buildAppUrl(location.href);
        return;
    }

    // -----------------------------------------------------------------
    // 2. INTERCEPTAR CLICS EN ENLACES A YOUTUBE MUSIC
    // -----------------------------------------------------------------
    document.addEventListener('click', function(event) {
        const link = event.target.closest('a');
        if (!link || !link.href) return;

        if (isMusicUrl(link.href)) {
            event.preventDefault();
            window.location.href = buildAppUrl(link.href);
        }
    }, true);
})();
