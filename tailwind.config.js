/** @type {import('tailwindcss').Config} */
export default {
  // Aquí le decimos a Tailwind dónde buscar clases en tu estructura Feature-Sliced
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Mapeamos tu branding a variables semánticas
        primary: {
          DEFAULT: "#367933", // Verde oscuro - Acciones principales
          hover: "#2d652a", // Un tono ligeramente más oscuro para el hover
        },
        secondary: {
          DEFAULT: "#062e3a", // Azul oscuro - Institucional, Headers, H1
        },
        accent: {
          DEFAULT: "#b1cb0c", // Verde claro/Lima - Resaltes
          light: "rgba(177, 203, 12, 0.2)", // El fondo al 20% que mencionas
        },
        muted: {
          DEFAULT: "#342c1e", // Pardo - Textos secundarios y bordes
        },
        // Colores de fondo de la aplicación para el estilo Clean SaaS
        background: "#f8fafc", // Slate 50 (Gris muy clarito)
        surface: "#ffffff", // Blanco puro para las tarjetas
      },
      backgroundImage: {
        // Tus gradientes corporativos listos para usar
        "gradient-nutri-light": "linear-gradient(to right, #bed000, #85ac1c)",
        "gradient-nutri-dark": "linear-gradient(to right, #006633, #68b54e)",
      },
    },
  },
  plugins: [],
};
