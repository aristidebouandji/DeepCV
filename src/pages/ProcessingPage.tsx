import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useCVContext } from '../context/CVContext';
import { optimizeCV } from '../services/api';

const ProcessingPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useCVContext();
  const [progress, setProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  
  const processCV = async (retry = false) => {
    try {
      // Indique que le traitement a commencé
      dispatch({ type: 'SET_PROCESSING', payload: true });
      if (!retry) {
        dispatch({ type: 'SET_ERROR', payload: null });
      }

      console.log("Début du traitement du CV" + (retry ? " (retry)" : ""));
      
      // Réinitialiser le progrès si c'est une nouvelle tentative
      if (retry) {
        setProgress(10);
        setIsRetrying(true);
        setRetryCount(prev => prev + 1);
      }
      
      // Appel à la fonction d'optimisation
      const optimizedCVText = await optimizeCV({ 
        cv: state.originalCV || '', 
        jobOffer: state.jobOffer || ''
      });

      console.log("CV optimisé reçu");
      setIsRetrying(false);
      
      // Vérification de la qualité/complétude du CV généré
      const isCVComplete = checkCVCompleteness(optimizedCVText);
      
      // Met à jour le CV optimisé dans le contexte
      if (optimizedCVText && isCVComplete) {
        dispatch({ 
          type: 'SET_OPTIMIZED_CV', 
          payload: optimizedCVText 
        });
      
        // Artificiellement ralentir pour montrer la progression complète
        setProgress(95);
        setTimeout(() => {
          setProgress(100);
          // Redirige vers la page de résumé
          navigate('/summary');
        }, 800);
      } else if (optimizedCVText && !isCVComplete && retryCount < 2) {
        // Si le CV n'est pas complet, on réessaie (max 2 fois)
        console.warn("CV incomplet, nouvelle tentative...");
        processCV(true);
      } else if (optimizedCVText) {
        // Si on a un CV mais toujours incomplet après les tentatives, on l'utilise quand même
        console.warn("CV potentiellement incomplet mais utilisé après tentatives");
        dispatch({ 
          type: 'SET_OPTIMIZED_CV', 
          payload: optimizedCVText 
        });
        setProgress(100);
        setTimeout(() => navigate('/summary'), 500);
      } else {
        throw new Error("Aucun CV optimisé n'a été reçu");
      }
    } catch (error) {
      setIsRetrying(false);
      console.error("Erreur lors de l'optimisation du CV:", error);
      
      // Si moins de 2 tentatives, réessayer
      if (retryCount < 2) {
        setRetryCount(prev => prev + 1);
        console.log("Tentative de récupération automatique...");
        setTimeout(() => processCV(true), 1500);
      } else {
        // Affiche l'erreur à l'utilisateur après 3 tentatives
        dispatch({ 
          type: 'SET_ERROR', 
          payload: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'optimisation du CV' 
        });
        
        // Si on a déjà un CV optimisé (d'une session précédente), on peut quand même continuer
        if (state.optimizedCV) {
          navigate('/summary');
        }
      }
    }
  };
  
  // Fonction pour vérifier la complétude du CV
  const checkCVCompleteness = (cvText: string): boolean => {
    // Vérifier si toutes les sections obligatoires sont présentes
    const requiredSections = ['Profil', 'Expérience', 'Formation', 'Compétences', 'Langues'];
    const missingSections = requiredSections.filter(section => 
      !cvText.includes(`## ${section}`) && !cvText.includes(`\n# ${section}`)
    );
    
    // Vérifier la longueur minimale (un CV complet devrait avoir une certaine longueur)
    const isLongEnough = cvText.length > 300;
    
    // Un CV est considéré complet s'il a toutes les sections et une longueur suffisante
    return missingSections.length === 0 && isLongEnough;
  };

  useEffect(() => {
    // Vérifie si les données requises sont présentes
    if (!state.originalCV || !state.jobOffer) {
      navigate('/input');
      return;
    }

    // Animation de progression - plus lente pour Claude
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        // Progression plus lente pour Claude (max 90%)
        const increment = prev < 50 ? 0.8 : prev < 80 ? 0.4 : 0.1;
        const newValue = prev + increment;
        return newValue >= 90 ? 90 : newValue;
      });
    }, 500);

    // Animation des étapes
    const stepsInterval = setInterval(() => {
      setProcessingStep(prev => (prev + 1) % 4);
    }, 2000);
    
    // Lance le traitement
    processCV();
    
    return () => {
      clearInterval(progressInterval);
      clearInterval(stepsInterval);
    };
  }, [state.originalCV, state.jobOffer, dispatch, navigate]);

  // Option pour réessayer manuellement
  const handleRetry = () => {
    processCV(true);
  };

  // Si une erreur s'est produite
  if (state.error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card p-8 border-red-300">
            <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-4">Une erreur est survenue</h1>
            <p className="text-neutral-600 mb-6">
              {state.error}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleRetry} 
                className="btn-secondary flex items-center justify-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </button>
              <button 
                onClick={() => navigate('/input')} 
                className="btn-primary"
              >
                Retourner à la saisie
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Liste des étapes avec animations
  const processingSteps = [
    "Analyse approfondie de votre CV et de l'offre",
    "Extraction des mots-clés et compétences recherchées",
    "Génération d'un CV personnalisé avec Claude AI",
    "Optimisation finale du profil et de la mise en page"
  ];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="max-w-3xl mx-auto text-center">
        <div className="card p-8">
          <Loader2 className="h-16 w-16 text-primary-600 animate-spin mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4">
            {isRetrying 
              ? `Optimisation en cours... (tentative ${retryCount}/3)` 
              : "Optimisation de votre CV en cours..."}
          </h1>
          <p className="text-neutral-600 mb-6">
            Notre IA Claude analyse en profondeur votre CV et l'offre d'emploi pour créer une version personnalisée.
            Ce processus peut prendre jusqu'à une minute pour garantir une qualité optimale.
          </p>
          
          <div className="w-full bg-neutral-200 h-2 rounded-full mb-6">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="text-left space-y-4 bg-neutral-50 p-4 rounded-lg border border-neutral-200">
            <h3 className="font-semibold text-neutral-800">Ce que fait notre IA Claude :</h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              {processingSteps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full mr-2 flex-shrink-0 transition-colors duration-300 ${
                    index === processingStep 
                      ? "bg-primary-500 text-white" 
                      : index < processingStep 
                        ? "bg-green-100 text-green-800" 
                        : "bg-primary-100 text-primary-800"
                  }`}>
                    {index < processingStep ? "✓" : index + 1}
                  </span>
                  <span className={index === processingStep ? "font-medium" : ""}>
                    {step}
                  </span>
              </li>
              ))}
            </ul>
          </div>
          
          {isRetrying && (
            <div className="mt-4 p-2 bg-amber-50 border border-amber-200 rounded text-sm text-amber-700">
              Le système effectue une génération plus approfondie pour améliorer la qualité du CV...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessingPage;