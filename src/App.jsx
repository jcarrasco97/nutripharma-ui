import React from 'react'
import { CheckCircle2, FlaskConical } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100 text-center max-w-lg w-full transform transition-all hover:scale-105 duration-300">
        <div className="flex justify-center mb-6">
          <div className="bg-sky-100 p-4 rounded-full text-nutri-blue shadow-inner">
            <FlaskConical size={48} strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Nutri<span className="text-nutri-blue">Pharma</span> UI
        </h1>

        <p className="text-lg text-gray-600 font-medium mb-8 leading-relaxed max-w-sm mx-auto">
          Interfaz clínica de vanguardia, diseñada para nutricionistas exigentes. <br />
          Optimizada para una experiencia móvil y de escritorio impecable.
        </p>

        <div className="flex items-center justify-center gap-3 bg-nutri-green/10 text-nutri-green px-6 py-3 rounded-2xl font-bold text-lg border border-nutri-green/20 inline-flex shadow-inner">
          <CheckCircle2 size={24} />
          <span>Servicio Backend Conectado</span>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 text-sm text-gray-500 font-mono">
          Entorno de desarrollo local activo • Puerto 5173
        </div>
      </div>
    </div>
  )
}

export default App