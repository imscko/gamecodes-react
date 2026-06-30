// ================================
// DATOS INICIALES PARA LA TIENDA
// ================================
// Estos juegos se cargarán por defecto en la tienda si no hay productos guardados.
// Tienen enlaces a imágenes reales de la API de RAWG y datos aproximados.

export const juegosIniciales = [
    {
        id: "init-1",
        rawgId: 3498,
        nombre: "Grand Theft Auto V",
        imagen: "https://media.rawg.io/media/games/20a/20aa03a10cda45239fe22d035c0ebe64.jpg",
        plataformas: ["PC", "PlayStation 5", "Xbox Series X", "PlayStation 4", "Xbox One"],
        rating: 4.47,
        metacritic: 92,
        generos: ["Action", "Adventure"],
        precioCLP: 14990,
        fechaPublicacion: "2013-09-17"
    },
    {
        id: "init-2",
        rawgId: 28,
        nombre: "Red Dead Redemption 2",
        imagen: "https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg",
        plataformas: ["PC", "PlayStation 4", "Xbox One"],
        rating: 4.58,
        metacritic: 96,
        generos: ["Action", "Adventure"],
        precioCLP: 19990,
        fechaPublicacion: "2018-10-26"
    },
    {
        id: "init-3",
        rawgId: 4200,
        nombre: "Portal 2",
        imagen: "https://media.rawg.io/media/games/328/3283617cb7d75d67257fc58339188742.jpg",
        plataformas: ["PC", "Xbox 360", "PlayStation 3"],
        rating: 4.62,
        metacritic: 95,
        generos: ["Shooter", "Puzzle"],
        precioCLP: 5990,
        fechaPublicacion: "2011-04-18"
    },
    {
        id: "init-4",
        rawgId: 3328,
        nombre: "The Witcher 3: Wild Hunt",
        imagen: "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg",
        plataformas: ["PC", "PlayStation 5", "Xbox Series X", "Nintendo Switch"],
        rating: 4.66,
        metacritic: 92,
        generos: ["Action", "RPG"],
        precioCLP: 12990,
        fechaPublicacion: "2015-05-18"
    },
    {
        id: "init-5",
        rawgId: 41494,
        nombre: "Cyberpunk 2077",
        imagen: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7h.jpg",
        plataformas: ["PC", "PlayStation 5", "Xbox Series X"],
        rating: 4.12,
        metacritic: 86,
        generos: ["Action", "RPG"],
        precioCLP: 19990,
        fechaPublicacion: "2020-12-10"
    },
    {
        id: "init-6",
        rawgId: 12020,
        nombre: "Left 4 Dead 2",
        imagen: "https://media.rawg.io/media/games/d58/d588947d4286e7b5e0e12e1bea7d9844.jpg",
        plataformas: ["PC", "Xbox 360"],
        rating: 4.09,
        metacritic: 89,
        generos: ["Shooter", "Action"],
        precioCLP: 4990,
        fechaPublicacion: "2009-11-17"
    }
];
