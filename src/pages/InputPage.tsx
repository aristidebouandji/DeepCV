import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Briefcase, ArrowRight, Upload, Link as LinkIcon } from 'lucide-react';
import { useCVContext } from '../context/CVContext';

const InputPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useCVContext();
  
  const [cvInputType, setCvInputType] = useState<'text' | 'file' | 'link'>('text');
  const [jobInputType, setJobInputType] = useState<'text' | 'file'>('text');
  
  const [cvText, setCvText] = useState('');
  const [jobText, setJobText] = useState('');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  
  const [fileNames, setFileNames] = useState({
    cv: '',
    job: '',
  });
  
  // Event handlers
  const handleCvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFileNames(prev => ({ ...prev, cv: file.name }));
      
      // Here we would normally parse the file
      // For demo, we'll just use the file name as placeholder
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setCvText(`Contenu du CV importé depuis: ${file.name}`);
          dispatch({ type: 'SET_ORIGINAL_CV', payload: `Contenu du CV importé depuis: ${file.name}` });
        }
      };
      reader.readAsText(file);
    }
  };
  
  const handleJobFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFileNames(prev => ({ ...prev, job: file.name }));
      
      // Here we would normally parse the file
      // For demo, we'll just use the file name as placeholder
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setJobText(`Contenu de l'offre d'emploi importé depuis: ${file.name}`);
          dispatch({ type: 'SET_JOB_OFFER', payload: `Contenu de l'offre d'emploi importé depuis: ${file.name}` });
        }
      };
      reader.readAsText(file);
    }
  };
  
  const handleCvTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCvText(e.target.value);
    dispatch({ type: 'SET_ORIGINAL_CV', payload: e.target.value });
  };
  
  const handleJobTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobText(e.target.value);
    dispatch({ type: 'SET_JOB_OFFER', payload: e.target.value });
  };
  
  const handleLinkedInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkedInUrl(e.target.value);
    dispatch({ type: 'SET_ORIGINAL_CV', payload: `Profil LinkedIn: ${e.target.value}` });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!state.originalCV || !state.jobOffer) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    
    // Navigate to processing page
    navigate('/processing');
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Créez votre CV optimisé</h1>
        <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
          Entrez votre CV actuel et l'offre d'emploi pour que notre IA crée un CV personnalisé.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* CV Input */}
          <div className="card">
            <div className="flex items-center mb-4">
              <FileText className="text-primary-600 mr-2" size={24} />
              <h2 className="text-xl font-semibold">Votre CV actuel</h2>
            </div>
            
            <div className="mb-4">
              <div className="flex border border-neutral-300 rounded-lg overflow-hidden">
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 text-center ${cvInputType === 'text' ? 'bg-primary-100 text-primary-800' : 'bg-white text-neutral-600 hover:bg-neutral-50'}`}
                  onClick={() => setCvInputType('text')}
                >
                  Texte
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 text-center ${cvInputType === 'file' ? 'bg-primary-100 text-primary-800' : 'bg-white text-neutral-600 hover:bg-neutral-50'}`}
                  onClick={() => setCvInputType('file')}
                >
                  Fichier
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 text-center ${cvInputType === 'link' ? 'bg-primary-100 text-primary-800' : 'bg-white text-neutral-600 hover:bg-neutral-50'}`}
                  onClick={() => setCvInputType('link')}
                >
                  LinkedIn
                </button>
              </div>
            </div>
            
            {cvInputType === 'text' && (
              <div>
                <textarea
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[200px]"
                  placeholder="Copiez-collez votre CV ici..."
                  value={cvText}
                  onChange={handleCvTextChange}
                ></textarea>
              </div>
            )}
            
            {cvInputType === 'file' && (
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="cv-file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleCvFileChange}
                />
                <label htmlFor="cv-file" className="cursor-pointer block">
                  <Upload className="mx-auto h-12 w-12 text-neutral-400 mb-3" />
                  <p className="text-sm font-medium text-neutral-900 mb-1">
                    {fileNames.cv ? fileNames.cv : "Cliquez pour importer votre CV"}
                  </p>
                  <p className="text-xs text-neutral-500">PDF, DOC, DOCX ou TXT (max 5MB)</p>
                </label>
              </div>
            )}
            
            {cvInputType === 'link' && (
              <div>
                <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden">
                  <div className="bg-neutral-100 p-3 text-neutral-500">
                    <LinkIcon size={20} />
                  </div>
                  <input
                    type="url"
                    className="flex-1 p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://linkedin.com/in/votre-profil"
                    value={linkedInUrl}
                    onChange={handleLinkedInChange}
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  Nous analyserons les informations publiques de votre profil LinkedIn
                </p>
              </div>
            )}
          </div>
          
          {/* Job Offer Input */}
          <div className="card">
            <div className="flex items-center mb-4">
              <Briefcase className="text-primary-600 mr-2" size={24} />
              <h2 className="text-xl font-semibold">Offre d'emploi</h2>
            </div>
            
            <div className="mb-4">
              <div className="flex border border-neutral-300 rounded-lg overflow-hidden">
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 text-center ${jobInputType === 'text' ? 'bg-primary-100 text-primary-800' : 'bg-white text-neutral-600 hover:bg-neutral-50'}`}
                  onClick={() => setJobInputType('text')}
                >
                  Texte
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 text-center ${jobInputType === 'file' ? 'bg-primary-100 text-primary-800' : 'bg-white text-neutral-600 hover:bg-neutral-50'}`}
                  onClick={() => setJobInputType('file')}
                >
                  Fichier
                </button>
              </div>
            </div>
            
            {jobInputType === 'text' && (
              <div>
                <textarea
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[200px]"
                  placeholder="Copiez-collez l'offre d'emploi ici..."
                  value={jobText}
                  onChange={handleJobTextChange}
                ></textarea>
              </div>
            )}
            
            {jobInputType === 'file' && (
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="job-file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleJobFileChange}
                />
                <label htmlFor="job-file" className="cursor-pointer block">
                  <Upload className="mx-auto h-12 w-12 text-neutral-400 mb-3" />
                  <p className="text-sm font-medium text-neutral-900 mb-1">
                    {fileNames.job ? fileNames.job : "Cliquez pour importer l'offre d'emploi"}
                  </p>
                  <p className="text-xs text-neutral-500">PDF, DOC, DOCX ou TXT (max 5MB)</p>
                </label>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center">
          <button
            type="submit"
            className="btn-primary inline-flex items-center px-6 py-3"
            disabled={!state.originalCV || !state.jobOffer}
          >
            Générer mon CV optimisé
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputPage;