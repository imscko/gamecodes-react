// ================================
// MÓDULO: igdbApi.js (Conexión con IGDB de Twitch)
// ================================
// Centraliza todas las llamadas a la API de IGDB usando Axios.
// Requiere un proxy configurado en Vite para evitar problemas de CORS.

import axios from 'axios';

const CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID || '';
const CLIENT_SECRET = import.meta.env.VITE_TWITCH_CLIENT_SECRET || '';

let accessToken = null;

// ================================
// AUTENTICACIÓN
// ================================
/**
 * Obtener o reutilizar el token de Twitch
 */
async function getTwitchToken() {
    if (accessToken) return accessToken;
    
    if (!CLIENT_ID || !CLIENT_SECRET) {
        console.warn("Falta CLIENT_ID o CLIENT_SECRET en .env");
        return null;
    }

    try {
        const response = await axios.post('/api/twitch/oauth2/token', null, {
            params: {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'client_credentials'
            }
        });
        accessToken = response.data.access_token;
        return accessToken;
    } catch (error) {
        console.error('Error obteniendo token de Twitch:', error);
        throw error;
    }
}

// ================================
// CONFIGURACIÓN AXIOS IGDB
// ================================
const igdbAxios = axios.create({
    baseURL: '/api/igdb', // Esto pasa por el proxy de vite.config.js
});

// Interceptor para inyectar headers de autenticación antes de cada petición
igdbAxios.interceptors.request.use(async (config) => {
    const token = await getTwitchToken();
    if (token) {
        config.headers['Client-ID'] = CLIENT_ID;
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    config.headers['Accept'] = 'application/json';
    return config;
});

// ================================
// FUNCIONES DE LA API
// ================================

/**
 * Buscar juegos por nombre
 */
export async function buscarJuegos(query, pageSize = 20) {
    try {
        // IGDB usa Apicalypse (texto plano para las consultas) en peticiones POST
        const body = `search "${query}"; fields name, cover.url, platforms.name, rating, total_rating, genres.name, first_release_date; limit ${pageSize};`;
        const response = await igdbAxios.post('/games', body);
        return response.data || [];
    } catch (error) {
        console.error('Error buscando juegos en IGDB:', error);
        throw error;
    }
}

/**
 * Obtener juegos populares
 */
export async function obtenerPopulares(pageSize = 12) {
    try {
        const body = `fields name, cover.url, platforms.name, rating, total_rating, genres.name, first_release_date; sort total_rating desc; where total_rating > 80 & rating_count > 100; limit ${pageSize};`;
        const response = await igdbAxios.post('/games', body);
        return response.data || [];
    } catch (error) {
        console.error('Error obteniendo juegos populares en IGDB:', error);
        return [];
    }
}

/**
 * Formatear datos de IGDB a formato interno de producto de la tienda
 */
export function formatearProducto(igdbGame, precioCLP) {
    let imagenUrl = '';
    if (igdbGame.cover && igdbGame.cover.url) {
        // IGDB entrega URLs sin protocolo y en tamaño "thumb", las convertimos a "cover_big"
        imagenUrl = igdbGame.cover.url.startsWith('//') 
            ? 'https:' + igdbGame.cover.url.replace('t_thumb', 't_cover_big') 
            : igdbGame.cover.url;
    } else {
        imagenUrl = 'https://via.placeholder.com/400x600?text=Sin+Imagen';
    }

    // El rating en IGDB es 0-100, RAWG usaba 0-5. Lo adaptamos dividiendo por 20.
    const rawRating = igdbGame.total_rating || igdbGame.rating || 0;
    const ratingConvertido = (rawRating / 20).toFixed(2);

    return {
        id: Date.now() + Math.random(), // ID único local
        rawgId: igdbGame.id, // Mantenemos el nombre de la propiedad por compatibilidad con código anterior
        nombre: igdbGame.name,
        imagen: imagenUrl,
        plataformas: igdbGame.platforms ? igdbGame.platforms.map(p => p.name) : [],
        rating: parseFloat(ratingConvertido),
        metacritic: Math.round(rawRating) || null,
        generos: igdbGame.genres ? igdbGame.genres.map(g => g.name) : [],
        precioCLP: precioCLP,
        // IGDB entrega fecha en formato Unix Timestamp
        fechaPublicacion: igdbGame.first_release_date 
            ? new Date(igdbGame.first_release_date * 1000).toISOString().split('T')[0] 
            : 'N/A',
    };
}

/**
 * Formatear precio en CLP chileno
 */
export function formatearPrecioCLP(precio) {
    return '$' + precio.toLocaleString('es-CL');
}

export default igdbAxios;
