import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, CheckSquare, Languages, AlertCircle, Palette, Sliders } from 'lucide-react';
import { useCVContext } from '../context/CVContext';
import CVTemplate from '../components/cv/CVTemplate';
import { translateCV } from '../services/api';
import { ThemeOptions } from '../components/cv/CVTemplate';

const ResultsPage: React.FC = () => {
  const { state, dispatch } = useCVContext();
  const [isTranslating, setIsTranslating] = useState(false);
  const [debugInfo, setDebugInfo] = useState<{ visible: boolean, message: string }>({ 
    visible: false, 
    message: '' 
  });
  const [customTheme, setCustomTheme] = useState<Partial<ThemeOptions>>({});
  const [showThemeOptions, setShowThemeOptions] = useState(false);
  
  // Options de couleurs disponibles
  const colorOptions = [
    { name: 'Bleu', value: 'primary' },
    { name: 'Gris', value: 'neutral' },
    { name: 'Vert', value: 'emerald' },
    { name: 'Violet', value: 'violet' },
    { name: 'Rouge', value: 'rose' },
    { name: 'Orange', value: 'amber' },
    { name: 'Cyan', value: 'sky' }
  ];
  
  // Options de polices disponibles
  const fontOptions = [
    { name: 'Sans serif', value: 'sans' },
    { name: 'Serif', value: 'serif' },
    { name: 'Monospace', value: 'mono' }
  ];
  
  // Options d'espacement
  const spacingOptions = [
    { name: 'Compact', value: 'compact' },
    { name: 'Normal', value: 'normal' },
    { name: 'Confortable', value: 'comfortable' },
    { name: 'Large', value: 'loose' }
  ];
  
  useEffect(() => {
    // Vérifier le contenu du CV optimisé
    if (state.optimizedCV) {
      console.log("CV optimisé disponible sur ResultsPage, longueur:", state.optimizedCV.length);
      console.log("Aperçu du CV:", state.optimizedCV.substring(0, 200) + "...");
      
      // Vérifier si le contenu est au format Markdown attendu
      const hasMarkdownStructure = state.optimizedCV.includes('# ') || state.optimizedCV.includes('## ');
      if (!hasMarkdownStructure) {
        console.warn("Le CV ne semble pas être au format Markdown attendu");
        setDebugInfo({
          visible: true,
          message: "Le contenu du CV n'est pas correctement formaté. L'affichage peut être incomplet."
        });
      }
    } else {
      console.error("CV optimisé non disponible sur ResultsPage");
      setDebugInfo({
        visible: true,
        message: "Données de CV non disponibles. Veuillez réessayer l'optimisation."
      });
    }
  }, [state.optimizedCV]);
  
  // Handle template change
  const handleTemplateChange = (template: 'modern' | 'classic' | 'minimal' | 'creative') => {
    dispatch({ type: 'SET_TEMPLATE', payload: template });
    // Réinitialiser le thème personnalisé lors du changement de template
    setCustomTheme({});
  };
  
  // Handle language change
  const handleLanguageChange = async (language: 'fr' | 'en') => {
    if (language === state.language || !state.optimizedCV) return;
    
    try {
      setIsTranslating(true);
      const translatedCV = await translateCV(state.optimizedCV, language);
      dispatch({ type: 'SET_OPTIMIZED_CV', payload: translatedCV });
      dispatch({ type: 'SET_LANGUAGE', payload: language });
    } catch (error) {
      console.error('Translation error:', error);
      setDebugInfo({
        visible: true,
        message: "Erreur lors de la traduction. Veuillez réessayer."
      });
    } finally {
      setIsTranslating(false);
    }
  };
  
  // Handle theme option change
  const handleThemeOptionChange = (option: keyof ThemeOptions, value: string) => {
    setCustomTheme(prev => ({
      ...prev,
      [option]: value
    }));
  };
  
  // Toggle header image
  const toggleHeaderImage = () => {
    setCustomTheme(prev => ({
      ...prev,
      enableHeaderImage: !prev.enableHeaderImage
    }));
  };
  
  // Handle download
  const handleDownload = () => {
    // In a real implementation, this would generate a PDF or DOCX file
    // For this demo, we'll just create a text file
    if (!state.optimizedCV) return;
    
    const blob = new Blob([state.optimizedCV], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV_Optimisé_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Toggle debug information
  const toggleDebugInfo = () => {
    setDebugInfo(prev => ({
      ...prev,
      visible: !prev.visible
    }));
  };
  
  if (!state.optimizedCV) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Données de CV non disponibles</h1>
          <p className="text-neutral-600 mb-6">
            Une erreur s'est produite lors de la récupération de votre CV optimisé. 
            Veuillez retourner à la page précédente et réessayer.
          </p>
          <button 
            className="btn-primary" 
            onClick={() => window.history.back()}
          >
            Retour
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Votre CV optimisé est prêt !</h1>
        <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
          Voici votre CV personnalisé pour cette offre d'emploi. Vous pouvez choisir un modèle, 
          le traduire ou le télécharger.
        </p>
        
        {/* Debug button */}
        <button 
          onClick={toggleDebugInfo} 
          className="text-sm text-primary-600 mt-2 hover:underline"
        >
          {debugInfo.visible ? "Masquer les informations de débogage" : "Afficher les informations de débogage"}
        </button>
        
        {/* Debug information */}
        {debugInfo.visible && (
          <div className="mt-2 p-4 bg-neutral-100 border border-neutral-300 rounded-lg text-left">
            <h3 className="text-sm font-semibold mb-2">Informations de débogage :</h3>
            {debugInfo.message && (
              <p className="text-sm text-amber-700 mb-2">{debugInfo.message}</p>
            )}
            <p className="text-xs text-neutral-700">Longueur du CV : {state.optimizedCV.length} caractères</p>
            <p className="text-xs text-neutral-700">Template actuel : {state.selectedTemplate}</p>
            <p className="text-xs text-neutral-700">Langue : {state.language}</p>
            <details className="mt-2">
              <summary className="text-xs cursor-pointer hover:text-primary-600">Voir le contenu brut</summary>
              <pre className="mt-2 p-2 bg-neutral-200 rounded overflow-auto text-xs max-h-40">
                {state.optimizedCV}
              </pre>
            </details>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar options */}
        <div className="lg:col-span-3">
          <div className="card sticky top-24">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <RefreshCw size={18} className="mr-2 text-primary-600" />
              Options
            </h3>
            
            {/* Template selection */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-neutral-700 mb-2">Modèle</h4>
              <div className="space-y-2">
                <button
                  className={`flex items-center w-full p-2 rounded-lg transition-colors ${
                    state.selectedTemplate === 'modern'
                      ? 'bg-primary-100 text-primary-800'
                      : 'hover:bg-neutral-100'
                  }`}
                  onClick={() => handleTemplateChange('modern')}
                >
                  <CheckSquare
                    size={16}
                    className={`mr-2 ${
                      state.selectedTemplate === 'modern' ? 'text-primary-600' : 'text-neutral-400'
                    }`}
                  />
                  <span>Moderne</span>
                </button>
                
                <button
                  className={`flex items-center w-full p-2 rounded-lg transition-colors ${
                    state.selectedTemplate === 'classic'
                      ? 'bg-primary-100 text-primary-800'
                      : 'hover:bg-neutral-100'
                  }`}
                  onClick={() => handleTemplateChange('classic')}
                >
                  <CheckSquare
                    size={16}
                    className={`mr-2 ${
                      state.selectedTemplate === 'classic' ? 'text-primary-600' : 'text-neutral-400'
                    }`}
                  />
                  <span>Classique</span>
                </button>
                
                <button
                  className={`flex items-center w-full p-2 rounded-lg transition-colors ${
                    state.selectedTemplate === 'minimal'
                      ? 'bg-primary-100 text-primary-800'
                      : 'hover:bg-neutral-100'
                  }`}
                  onClick={() => handleTemplateChange('minimal')}
                >
                  <CheckSquare
                    size={16}
                    className={`mr-2 ${
                      state.selectedTemplate === 'minimal' ? 'text-primary-600' : 'text-neutral-400'
                    }`}
                  />
                  <span>Minimal</span>
                </button>
                
                <button
                  className={`flex items-center w-full p-2 rounded-lg transition-colors ${
                    state.selectedTemplate === 'creative'
                      ? 'bg-primary-100 text-primary-800'
                      : 'hover:bg-neutral-100'
                  }`}
                  onClick={() => handleTemplateChange('creative')}
                >
                  <CheckSquare
                    size={16}
                    className={`mr-2 ${
                      state.selectedTemplate === 'creative' ? 'text-primary-600' : 'text-neutral-400'
                    }`}
                  />
                  <span>Créatif</span>
                </button>
              </div>
            </div>
            
            {/* Personnalisation du thème */}
            <div className="mb-6">
              <button
                className="flex items-center w-full p-2 justify-between text-sm font-medium text-neutral-700 rounded-lg hover:bg-neutral-100"
                onClick={() => setShowThemeOptions(!showThemeOptions)}
              >
                <span className="flex items-center">
                  <Palette size={16} className="mr-2 text-primary-600" />
                  Personnaliser le thème
                </span>
                <span className={`transition-transform ${showThemeOptions ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              {showThemeOptions && (
                <div className="mt-3 space-y-4 p-3 bg-neutral-50 rounded-lg">
                  {/* Couleur principale */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Couleur principale
                    </label>
                    <select
                      value={customTheme.primaryColor || ''}
                      onChange={(e) => handleThemeOptionChange('primaryColor', e.target.value)}
                      className="w-full p-2 text-sm border rounded"
                    >
                      <option value="">Par défaut</option>
                      {colorOptions.map(color => (
                        <option key={color.value} value={color.value}>{color.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Couleur d'accent */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Couleur d'accent
                    </label>
                    <select
                      value={customTheme.accentColor || ''}
                      onChange={(e) => handleThemeOptionChange('accentColor', e.target.value)}
                      className="w-full p-2 text-sm border rounded"
                    >
                      <option value="">Par défaut</option>
                      {colorOptions.map(color => (
                        <option key={color.value} value={color.value}>{color.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Police de caractères */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Police de caractères
                    </label>
                    <select
                      value={customTheme.fontFamily || ''}
                      onChange={(e) => handleThemeOptionChange('fontFamily', e.target.value)}
                      className="w-full p-2 text-sm border rounded"
                    >
                      <option value="">Par défaut</option>
                      {fontOptions.map(font => (
                        <option key={font.value} value={font.value}>{font.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Espacement */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Espacement
                    </label>
                    <select
                      value={customTheme.spacing || ''}
                      onChange={(e) => handleThemeOptionChange('spacing', e.target.value)}
                      className="w-full p-2 text-sm border rounded"
                    >
                      <option value="">Par défaut</option>
                      {spacingOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Image d'en-tête */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="headerImage"
                      checked={customTheme.enableHeaderImage || false}
                      onChange={toggleHeaderImage}
                      className="rounded text-primary-600 mr-2"
                    />
                    <label htmlFor="headerImage" className="text-xs font-medium text-neutral-700">
                      Activer l'image d'en-tête
                    </label>
                  </div>
                </div>
              )}
            </div>
            
            {/* Language selection */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-neutral-700 mb-2 flex items-center">
                <Languages size={16} className="mr-2 text-primary-600" />
                Langue
              </h4>
              
              <div className="flex space-x-2">
                <button
                  disabled={isTranslating}
                  className={`flex-1 py-2 px-3 text-sm rounded-lg border transition-colors ${
                    state.language === 'fr'
                      ? 'bg-primary-100 text-primary-800 border-primary-300'
                      : 'hover:bg-neutral-100 border-neutral-300'
                  }`}
                  onClick={() => handleLanguageChange('fr')}
                >
                  Français
                </button>
                
                <button
                  disabled={isTranslating}
                  className={`flex-1 py-2 px-3 text-sm rounded-lg border transition-colors ${
                    state.language === 'en'
                      ? 'bg-primary-100 text-primary-800 border-primary-300'
                      : 'hover:bg-neutral-100 border-neutral-300'
                  }`}
                  onClick={() => handleLanguageChange('en')}
                >
                  {isTranslating ? 'Traduction...' : 'English'}
                </button>
              </div>
              
              {isTranslating && (
                <p className="text-xs text-neutral-500 mt-2">
                  Traduction en cours, veuillez patienter...
                </p>
              )}
            </div>
            
            {/* Download button */}
            <button
              onClick={handleDownload}
              className="flex items-center justify-center w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              <Download size={18} className="mr-2" />
              Télécharger
            </button>
          </div>
        </div>
        
        {/* CV Template preview */}
        <div className="lg:col-span-9">
          <div className="bg-white p-1 md:p-8 rounded-lg shadow-sm border border-neutral-200">
            <CVTemplate
              template={state.selectedTemplate}
              content={state.optimizedCV}
              language={state.language}
              customTheme={customTheme}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;