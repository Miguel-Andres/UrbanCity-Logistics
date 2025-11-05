export default function EtiquetasPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-bold leading-10 tracking-tight text-black dark:text-zinc-50">
            Etiquetas
          </h1>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {[
              { name: "Paquete Estándar", status: "Activo", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
              { name: "Entrega Urgente", status: "Prioritario", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
              { name: "Fragil", status: "Manejo Especial", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
              { name: "Refrigerado", status: "Temperatura Controlada", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
              { name: "Grande", status: "Volumen Extra", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
              { name: "Documentos", status: "Papel", color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200" },
            ].map((etiqueta, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-black dark:text-white">{etiqueta.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${etiqueta.color}`}>
                    {etiqueta.status}
                  </span>
                </div>
                <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10v10H7V7zm0-3h10v3H7V4zm0 13h10v3H7v-3z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Sistema de gestión de etiquetas logísticas
            </p>
            <a 
              href="/" 
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Volver al inicio
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}