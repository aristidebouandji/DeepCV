import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, ArrowRight, RotateCw } from 'lucide-react';
import { useCVContext } from '../context/CVContext';

const SummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useCVContext();
  const [showDetails, setShowDetails] = useState(false);

  // Si pas de CV optimisé, rediriger vers la page d'accueil
  if (!state.optimizedCV) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Aucune donnée disponible</h1>
          <p className="text-neutral-600 mb-6">
            Nous n'avons pas pu récupérer les informations d'optimisation de votre CV.
            Veuillez retourner à la page de saisie.
          </p>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/input')}
          >
            Retour à la saisie
          </button>
        </div>
      </div>
    );
  }

  // Extraire des informations du CV optimisé pour le résumé
  const extractSummary = () => {
    const cv = state.optimizedCV || '';
    
    // Extraire le nombre de sections
    const sections = cv.match(/##\s+/g)?.length || 0;
    
    // Essayer d'extraire quelques compétences clés
    const skillsSection = cv.match(/##\s+Compétences([\s\S]*?)(?=##|$)/i)?.[1] || '';
    const skills = skillsSection
      .split('\n')
      .filter((line: string) => line.trim().startsWith('-'))
      .map((line: string) => line.replace(/^-\s+/, '').trim())
      .slice(0, 3);
    
    return {
      sections,
      characterCount: cv.length,
      skills: skills.length ? skills : ['Compétences analysées avec succès']
    };
  };

  const summary = extractSummary();
  const hasError = state.error !== null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="card p-8">
          {hasError ? (
            // Affichage en cas d'erreur avec l'API
            <>
              <div className="flex items-center mb-6">
                <AlertCircle className="h-10 w-10 text-amber-500 mr-4" />
                <h1 className="text-2xl font-bold">Connexion à l'API limitée</h1>
              </div>
              
              <p className="text-neutral-600 mb-6">
                Nous avons rencontré des difficultés pour nous connecter à notre service d'optimisation. 
                Cependant, nous avons pu générer un CV optimisé en mode hors ligne.
              </p>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <p className="text-amber-800 text-sm">
                  Détail de l'erreur: {state.error || "Connexion à l'API impossible"}
                </p>
              </div>
            </>
          ) : (
            // Affichage en cas de succès
            <>
              <div className="flex items-center mb-6">
                <CheckCircle className="h-10 w-10 text-green-500 mr-4" />
                <h1 className="text-2xl font-bold">Optimisation réussie !</h1>
              </div>
              
              <p className="text-neutral-600 mb-6">
                Votre CV a été optimisé avec succès pour l'offre d'emploi que vous avez fournie.
                Nous avons analysé votre profil et mis en valeur les éléments les plus pertinents.
              </p>
            </>
          )}
          
          {/* Résumé de l'optimisation */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 mb-6">
            <h2 className="font-semibold text-lg mb-4">Résumé de l'optimisation</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                <span className="text-neutral-600">Sections optimisées</span>
                <span className="font-medium">{summary.sections} sections</span>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                <span className="text-neutral-600">Taille du contenu</span>
                <span className="font-medium">{summary.characterCount} caractères</span>
              </div>
              
              <div>
                <span className="text-neutral-600 block mb-2">Compétences mises en avant</span>
                <ul className="list-disc pl-5 space-y-1">
                  {summary.skills.map((skill: string, index: number) => (
                    <li key={index} className="text-primary-700">{skill}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Bouton pour voir les détails */}
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-primary-600 hover:text-primary-800 text-sm font-medium mb-4 flex items-center"
          >
            {showDetails ? 'Masquer les détails' : 'Voir les détails'}
            <RotateCw className={`ml-1 h-4 w-4 ${showDetails ? 'transform rotate-180' : ''}`} />
          </button>
          
          {/* Détails du CV */}
          {showDetails && (
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-6 overflow-auto max-h-60">
              <pre className="text-xs text-neutral-700 whitespace-pre-wrap">
                {state.optimizedCV}
              </pre>
            </div>
          )}
          
          {/* Boutons de navigation */}
          <div className="flex justify-between mt-8">
            <button 
              onClick={() => navigate('/input')}
              className="btn-outline"
            >
              Retour à la saisie
            </button>
            
            <button 
              onClick={() => navigate('/results')}
              className="btn-primary flex items-center"
            >
              Voir les templates
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage; 