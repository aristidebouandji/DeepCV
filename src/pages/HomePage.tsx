import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Briefcase, ArrowRight, CheckCircle } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Optimisez votre CV avec l'IA
              </h1>
              <p className="text-xl mb-8 text-primary-100">
                DeepCV analyse votre CV et l'offre d'emploi pour créer 
                une candidature parfaitement adaptée et maximiser vos chances de décrocher un entretien.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/input" 
                  className="btn-accent flex items-center gap-2 text-base"
                >
                  Commencer maintenant
                  <ArrowRight size={18} />
                </Link>
                <a 
                  href="#how-it-works" 
                  className="btn-secondary flex items-center gap-2 bg-transparent text-white border-white/30 hover:bg-white/10 text-base"
                >
                  Comment ça marche
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-white/5 rounded-lg transform rotate-3"></div>
                <div className="relative bg-white/10 backdrop-blur-sm p-8 rounded-lg border border-white/20 shadow-xl">
                  <div className="flex items-center mb-4">
                    <FileText className="text-accent-400 mr-2" size={24} />
                    <h3 className="text-xl font-semibold text-white">Votre CV optimisé</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="h-6 bg-white/20 rounded w-3/4"></div>
                    <div className="h-6 bg-white/20 rounded w-1/2"></div>
                    <div className="h-6 bg-white/20 rounded w-5/6"></div>
                    <div className="h-6 bg-white/20 rounded w-2/3"></div>
                    <div className="mt-6 h-20 bg-white/20 rounded"></div>
                    <div className="h-6 bg-white/20 rounded w-4/5"></div>
                    <div className="h-6 bg-white/20 rounded w-3/5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Pourquoi utiliser DeepCV ?</h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Notre technologie d'IA avancée analyse en profondeur votre CV et l'offre d'emploi 
              pour créer la candidature parfaite.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card hover:shadow-lg group">
              <div className="rounded-full bg-primary-100 p-3 inline-flex mb-5 transition-all duration-200 group-hover:bg-primary-200">
                <FileText className="h-6 w-6 text-primary-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">CV personnalisé</h3>
              <p className="text-neutral-600">
                Notre IA analyse l'offre d'emploi pour mettre en avant vos compétences 
                et expériences les plus pertinentes.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="card hover:shadow-lg group">
              <div className="rounded-full bg-accent-100 p-3 inline-flex mb-5 transition-all duration-200 group-hover:bg-accent-200">
                <Briefcase className="h-6 w-6 text-accent-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Adapté à chaque poste</h3>
              <p className="text-neutral-600">
                Créez facilement plusieurs versions de votre CV, chacune optimisée 
                pour une offre d'emploi spécifique.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="card hover:shadow-lg group">
              <div className="rounded-full bg-secondary-100 p-3 inline-flex mb-5 transition-all duration-200 group-hover:bg-secondary-200">
                <CheckCircle className="h-6 w-6 text-secondary-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Designs professionnels</h3>
              <p className="text-neutral-600">
                Choisissez parmi plusieurs modèles élégants et professionnels 
                pour présenter votre candidature sous son meilleur jour.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 bg-neutral-50" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Comment ça marche</h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Trois étapes simples pour créer un CV parfaitement adapté à l'offre d'emploi.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step connector lines (desktop) */}
            <div className="hidden md:block absolute top-1/4 left-0 right-0 h-0.5 bg-primary-200 z-0"></div>
            
            {/* Step 1 */}
            <div className="relative z-10">
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-primary-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mb-6">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Téléchargez votre CV</h3>
                <p className="text-neutral-600 text-center">
                  Importez votre CV actuel et l'offre d'emploi qui vous intéresse au format texte ou PDF.
                </p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative z-10">
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-primary-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mb-6">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">L'IA optimise votre CV</h3>
                <p className="text-neutral-600 text-center">
                  Notre intelligence artificielle analyse les deux documents et crée un CV parfaitement adapté.
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative z-10">
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-primary-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mb-6">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Téléchargez le résultat</h3>
                <p className="text-neutral-600 text-center">
                  Choisissez un design, ajustez si nécessaire, et téléchargez votre CV optimisé prêt à l'emploi.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link to="/input" className="btn-primary inline-flex items-center">
              Essayer maintenant <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Prêt à optimiser votre CV avec l'IA ?
          </h2>
          <p className="text-lg text-primary-100 mb-8 max-w-3xl mx-auto">
            Créez un CV personnalisé qui se démarque et augmente vos chances d'être 
            sélectionné pour un entretien.
          </p>
          <Link 
            to="/input" 
            className="btn-accent inline-flex items-center text-base px-6 py-3"
          >
            Commencer gratuitement
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;