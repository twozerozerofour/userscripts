// ==UserScript==
// @name         Spotify → App (iOS)
// @namespace    https://github.com/twozerozerofour
// @version      1.0
// @description  Abre enlaces de Spotify en la app oficial de iOS desde Safari
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Esquema registrado por la app oficial de Spotify en iOS.
    const SPOTIFY_SCHEME = 'spotify:';
    const SPOTIFY_HOST   = 'open.spotify.com';

    /**
     * Convierte una URL de open.spotify.com en una URI de la app.
     * Ej: https://open.spotify.com/track/ID  →  spotify:track:ID
     * También maneja rutas con prefijo regional como /intl-es/track/ID.
     */
    function buildSpotifyUri(webUrl) {
        const u = new URL(webUrl, location.href);
        // Quita prefijos de internacionalización (/intl-xx/) si existen
        const path = u.pathname.replace(/^\/intl-[^\/]+\//, '/');
        // Extrae el tipo (track, album, playlist, etc.) y el ID
        const match = path.match(/^\/([^\/]+)\/([^\/]+)/);
        if (match) {
            return SPOTIFY_SCHEME + match[1] + ':' + match[2];
        }
        // Fallback: si no se reconoce la ruta, no se redirige
        return null;
    }

    // -----------------------------------------------------------------
    // 1. REDIRECCIÓN AUTOMÁTICA SI YA ESTAMOS EN open.spotify.com
    // -----------------------------------------------------------------
    if (location.hostname === SPOTIFY_HOST) {
        const appUri = buildSpotifyUri(location.href);
        if (appUri) {
            window.location.href = appUri;
            return; // Detiene la ejecución
        }
    }

    // -----------------------------------------------------------------
    // 2. INTERCEPTAR CLICS EN ENLACES A open.spotify.com
    // -----------------------------------------------------------------
    document.addEventListener('click', function(event) {
        const link = event.target.closest('a');
        if (!link || !link.href) return;

        try {
            const linkUrl = new URL(link.href, location.href);
            if (linkUrl.hostname === SPOTIFY_HOST) {
                const appUri = buildSpotifyUri(linkUrl.href);
                if (appUri) {
                    event.preventDefault();
                    window.location.href = appUri;
                }
            }
        } catch (e) {
            // URL inválida: se ignora
        }
    }, true); // Captura para interceptar antes de que Safari procese el enlace
})();
