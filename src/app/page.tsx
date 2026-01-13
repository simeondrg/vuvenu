import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-vuvenu-cream">
      {/* Header temporaire */}
      <header className="p-6">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.svg"
            alt="VuVenu Logo"
            width={120}
            height={40}
          />
        </div>
      </header>

      {/* Hero Section - Style Vogue Business x Archrival */}
      <main className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="space-y-8">
            {/* Pixels décoratifs */}
            <div className="flex gap-2 mb-4">
              <div className="w-3 h-3 bg-vuvenu-lime animate-pixel-float"></div>
              <div className="w-3 h-3 bg-vuvenu-blue animate-pixel-float" style={{animationDelay: '0.5s'}}></div>
              <div className="w-3 h-3 bg-vuvenu-violet animate-pixel-float" style={{animationDelay: '1s'}}></div>
            </div>

            {/* Slogan principal */}
            <h1 className="text-5xl lg:text-6xl font-display font-bold text-vuvenu-dark leading-tight">
              <span className="bg-vuvenu-lime px-2 py-1 rotate-1 inline-block">ils ont vu</span> —<br />
              <span className="bg-vuvenu-blue px-2 py-1 -rotate-1 inline-block text-white">ils sont venu</span> !
            </h1>

            {/* Sous-titre */}
            <p className="text-xl text-vuvenu-dark/80 leading-relaxed max-w-lg">
              Le marketing digital <span className="bg-vuvenu-violet px-1 py-0.5">enfin simple</span> pour ton commerce.
              <br />
              <span className="font-medium">Scripts, publicités, tout automatisé.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-4 pt-4">
              <button className="bg-vuvenu-lime text-vuvenu-dark font-semibold px-8 py-4 rounded-lg hover:scale-105 transition-transform shadow-vuvenu">
                Essayer gratuitement
              </button>
              <button className="border-2 border-vuvenu-dark text-vuvenu-dark font-semibold px-8 py-4 rounded-lg hover:bg-vuvenu-dark hover:text-white transition-colors">
                Voir comment ça marche
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 pt-8">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 bg-vuvenu-rose rounded-full border-2 border-white"></div>
                <div className="w-10 h-10 bg-vuvenu-violet rounded-full border-2 border-white"></div>
                <div className="w-10 h-10 bg-vuvenu-blue rounded-full border-2 border-white"></div>
              </div>
              <p className="text-sm text-vuvenu-dark/60">
                <span className="font-semibold">+50 commerces</span> déjà visibles
              </p>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            {/* Placeholder pour future image générée avec Gemini */}
            <div className="bg-white rounded-2xl p-8 shadow-vuvenu-lg border border-vuvenu-rose/20">
              <div className="aspect-square bg-gradient-to-br from-vuvenu-lime/20 to-vuvenu-blue/20 rounded-xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-vuvenu-lime rounded-lg mx-auto flex items-center justify-center">
                    <span className="text-2xl">📱</span>
                  </div>
                  <p className="text-vuvenu-dark font-medium">
                    Interface VuVenu<br />
                    <span className="text-sm opacity-60">Mockup à remplacer par Gemini</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Pixels décoratifs flottants */}
            <div className="absolute -top-4 -right-4 w-6 h-6 bg-vuvenu-lime rotate-45"></div>
            <div className="absolute -bottom-6 -left-6 w-4 h-4 bg-vuvenu-violet"></div>
          </div>
        </div>
      </main>

      {/* Footer temporaire */}
      <footer className="p-6 text-center text-vuvenu-dark/60 text-sm">
        <p>VuVenu MVP V1 - Développement en cours 🚧</p>
      </footer>
    </div>
  );
}
