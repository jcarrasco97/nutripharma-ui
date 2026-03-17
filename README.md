# NutriPharma UI 🏥

Frontend moderno para la gestión clínica de pacientes y consultas nutricionales. Desarrollado con un enfoque "Mobile-First" para facilitar el trabajo de los nutricionistas desde cualquier dispositivo.

## 🚀 Tecnologías Principales

Este proyecto utiliza el stack más avanzado de 2026:

* **React 19** - Librería principal para la interfaz de usuario.
* **Vite** - Herramienta de construcción ultra rápida.
* **Tailwind CSS v4** - Motor de diseño atómico de última generación.
* **Axios** - Cliente HTTP para la comunicación con la API.
* **Lucide React** - Set de iconos vectoriales modernos y ligeros.
* **React Router Dom** - Gestión de navegación y rutas.

## 🛠️ Instalación y Configuración

Sigue estos pasos para poner en marcha el entorno de desarrollo:

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/jcarrasco97/nutripharma-ui.git](https://github.com/jcarrasco97/nutripharma-ui.git)
    ```

2.  **Entrar en la carpeta del proyecto:**
    ```bash
    cd nutripharma-ui
    ```

3.  **Instalar dependencias:**
    ```bash
    npm install
    ```

4.  **Arrancar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

La aplicación estará disponible en: `http://localhost:5173`

## 📁 Estructura del Proyecto

* `src/components/`: Componentes reutilizables de la interfaz.
* `src/services/`: Lógica de conexión con la API (Axios).
* `src/assets/`: Imágenes y recursos estáticos.
* `src/index.css`: Configuración global de Tailwind CSS v4.

## 📡 Conexión con el Backend

La aplicación está configurada para comunicarse con la **API de NutriPharma** (Spring Boot) ejecutándose por defecto en `http://localhost:8080`. Asegúrate de tener el backend activo para que las funcionalidades clínicas (búsqueda predictiva, registro de consultas) operen correctamente.

---
Desarrollado con ❤️ para **NutriPharma**.
