# GameCodes - Proyecto React

Bienvenido a la versión React de GameCodes. Este proyecto fue migrado desde HTML/CSS/JS tradicional (Vanilla) hacia una arquitectura moderna basada en componentes con **React** y **Vite**.

## 🚀 Cómo ejecutar el proyecto en tu computadora

Si es la primera vez que clonas o descargas este repositorio, necesitas instalar las dependencias (librerías) que usa React para funcionar. Sigue estos sencillos pasos:

1. **Abre una terminal** (PowerShell, CMD o la terminal integrada de VS Code) y asegúrate de estar dentro de la carpeta `gamecodes-react`.
2. **Instala las dependencias**:
   ```bash
   npm install
   ```
   *(Esto creará una carpeta `node_modules` con todas las librerías necesarias).*
3. **Inicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
4. Verás que la terminal te da un enlace local (usualmente `http://localhost:5173`). Haz Ctrl+Clic o cópialo en tu navegador web. ¡Listo! La página está corriendo.

---

## 🏗 Arquitectura y Conceptos Clave (Guía de Estudio)

Si necesitas explicar el código para una evaluación, aquí tienes los conceptos fundamentales de esta migración:

### 1. Componentes (`src/components/`)
A diferencia de HTML5, donde todo estaba en un solo archivo gigante (`index.html`), en React dividimos la página en piezas pequeñas llamadas **Componentes** (archivos `.jsx`). 
- Ejemplos: `<Header />`, `<Banner />`, `<Registro />`. 
- **Ventaja**: El código es mucho más limpio, reutilizable y fácil de leer. Todo se junta finalmente en el orquestador principal: `App.jsx`.

### 2. React Router (Navegación sin recargar)
En HTML5, ir a la página de "Registro" significaba destruir el DOM y pedirle al servidor descargar `registro.html`.
En este proyecto usamos **React Router** (`<BrowserRouter>`, `<Routes>`).
- **Ventaja**: Ahora el `<Header />` y el `<Footer />` nunca desaparecen. Cuando vas a `/registro`, React simplemente oculta el componente de inicio y muestra el formulario de registro en milisegundos, sin recargar la página ("Single Page Application").

### 3. El Estado: `useState`
En HTML5, para saber qué escribía el usuario usabas `document.getElementById('correo').value`.
En React usamos `useState`. 
- **Ventaja**: React conecta el teclado del usuario directamente a una variable de estado (con el atributo `value={estado}` y el evento `onChange`). Si cambia el estado, React automáticamente actualiza la interfaz sin que tengamos que modificar el DOM a mano.

### 4. Flujo Unidireccional (`props`)
¿Cómo se comunica la página principal (`App.jsx`) con el botón superior de "Cerrar Sesión" (`Header.jsx`)? 
- A través de `props` (propiedades). `App.jsx` le "presta" la función de cerrar sesión al Header enviándosela como propiedad: `<Header onLogout={handleLogout} />`.

---

> **Tip para la evaluación:** Te recomiendo abrir los archivos `src/App.jsx` y `src/components/Login.jsx`. Ambos tienen comentarios súper explicativos ("acordeones de notas") que muestran la comparación exacta entre cómo se hacía antes en HTML y cómo se hace ahora en React.
