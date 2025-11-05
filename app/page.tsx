import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-bold leading-10 tracking-tight text-black dark:text-zinc-50">
            Urban City Logistics
          </h1>
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute animate-ping inline-flex h-full w-full rounded-full bg-orange-400 opacity-20"></div>
            <div className="relative rounded-full h-20 w-20 bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-orange-600 dark:text-orange-400">
            Sitio en Construcción
          </h2>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Estamos trabajando para traerte la mejor plataforma de gestión logística urbana. 
            Pronto podrás disfrutar de nuestros servicios innovadores.
          </p>
          
          </div>
        
      </main>
    </div>
  );
}
