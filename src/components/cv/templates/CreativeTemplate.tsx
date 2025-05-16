import React from 'react';
import { Language } from '../../../context/CVContext';
import { SECTION_NAMES, DEFAULT_CONTACT, ThemeOptions } from '../CVTemplate';

interface CreativeTemplateProps {
  sections: Record<string, string>;
  language: Language;
  theme: ThemeOptions;
}

const CreativeTemplate: React.FC<CreativeTemplateProps> = ({ sections, language, theme }) => {
  // Parse informations personnelles (format: "- **Label:** Value") dans toutes les sections
  const parsePersonalInfo = () => {
    const infoMap: Record<string, string> = {};
    
    // Recherche dans toutes les sections du CV
    Object.values(sections).forEach(sectionContent => {
      if (!sectionContent) return;
      
      const lines = sectionContent.split('\n').filter(Boolean);
      
      lines.forEach(line => {
        // Format: "- **Email:** example@email.com" ou "**Email:** example@email.com"
        const match = line.match(/(?:^-\s+)?\*\*([^:]+):\*\*\s+(.+)$/);
        if (match) {
          const [, label, value] = match;
          const key = label.toLowerCase();
          
          // Vérifier si c'est une information de contact
          if (['email', 'téléphone', 'telephone', 'adresse', 'address', 'linkedin', 'site web', 'website'].includes(key)) {
            infoMap[key] = value.trim();
          }
        }
      });
    });
    
    // Normalisation des clés
    if (infoMap.telephone) infoMap.téléphone = infoMap.telephone;
    if (infoMap.address) infoMap.adresse = infoMap.address;
    if (infoMap.website) infoMap['site web'] = infoMap.website;
    
    return infoMap;
  };
  
  const personalInfo = parsePersonalInfo();
  
  // Fonction pour extraire l'email et le téléphone à partir du format sans astérisques
  const getContactFromSimpleFormat = () => {
    // Si nous avons déjà les infos au format standard, ne rien faire
    if (personalInfo.email && personalInfo.téléphone) return personalInfo;
    
    const result = { ...personalInfo };
    
    // Chercher les patterns d'email et téléphone dans toutes les sections
    Object.values(sections).forEach(sectionContent => {
      if (!sectionContent) return;
      
      // Recherche d'email
      if (!result.email) {
        const emailMatch = sectionContent.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
        if (emailMatch) result.email = emailMatch[0];
      }
      
      // Recherche de téléphone
      if (!result.téléphone) {
        const phoneMatch = sectionContent.match(/(?:\+\d{1,3}[\s-]?)?(?:\d{1,4}[\s\-.]?){3,4}/);
        if (phoneMatch) result.téléphone = phoneMatch[0];
      }
    });
    
    return result;
  };
  
  // Fusionner les résultats pour être sûr d'avoir toutes les informations
  const combinedPersonalInfo = getContactFromSimpleFormat();
  
  // Extraire les sections principales avec fallback
  const title = sections[SECTION_NAMES.TITLE] || sections.title || 'CV Optimisé';
  const profile = sections[SECTION_NAMES.PROFILE] || sections.profil || '';
  const experience = sections[SECTION_NAMES.EXPERIENCE] || sections.expérience || '';
  const education = sections[SECTION_NAMES.EDUCATION] || sections.formation || '';
  const skills = sections[SECTION_NAMES.SKILLS] || sections.compétences || '';
  const languages = sections[SECTION_NAMES.LANGUAGES] || sections.langues || '';
  const projects = sections[SECTION_NAMES.PROJECTS] || sections.projets || '';
  const interests = sections[SECTION_NAMES.INTERESTS] || sections.intérêts || '';

  // Obtenir les classes basées sur le thème
  const getBorderRadius = () => {
    switch (theme.borderRadius) {
      case 'none': return '';
      case 'sm': return 'rounded-sm';
      case 'lg': return 'rounded-lg';
      case 'full': return 'rounded-xl';
      default: return 'rounded-md';
    }
  };

  const getSpacing = () => {
    switch (theme.spacing) {
      case 'compact': return 'p-4 gap-4';
      case 'comfortable': return 'p-8 gap-8';
      case 'loose': return 'p-10 gap-10';
      default: return 'p-6 gap-6';
    }
  };

  // Couleur d'accent basée sur le thème
  const accentColor = theme.accentColor || theme.primaryColor || 'accent';
  const borderRadius = getBorderRadius();
  const spacing = getSpacing();

  // Extraire le nom du titre ou des infos personnelles
  const nameFromTitle = title.replace(/CV de |CV d'|CV|Curriculum Vitae de /gi, '').trim();
  const displayName = combinedPersonalInfo.nom || nameFromTitle || 'Candidat';
  const initials = displayName.split(/\s+/).map(part => part[0]).join('').toUpperCase();

  return (
    <div className={`font-${theme.fontFamily || 'sans'} text-${theme.fontSize || 'base'} text-neutral-800 max-w-4xl mx-auto`}>
      <div className={`grid grid-cols-1 md:grid-cols-3 ${spacing.split(' ')[1]}`}>
        {/* Colonne de gauche (contact, compétences, langues) */}
        <div className={`bg-${accentColor}-50 ${spacing.split(' ')[0]} ${borderRadius}`}>
          <div className="flex flex-col items-center text-center mb-8">
            <div className={`w-32 h-32 bg-${accentColor}-200 rounded-full flex items-center justify-center mb-4`}>
              <span className={`text-4xl font-bold text-${accentColor}-600`}>
                {initials}
              </span>
            </div>
            <h2 className={`text-xl font-bold text-${accentColor}-800`}>{displayName}</h2>
            
            {/* Titre du profil basé sur les mots clés du CV */}
            <p className="text-sm text-neutral-600 mt-1">
              {profile.split('.')[0]?.replace(/je suis/i, '').replace(/mon nom est/i, '') || 'Professionnel'}
            </p>
          </div>
          
          {/* Contact */}
          <div className="mb-8">
            <h3 className={`text-lg font-bold text-${accentColor}-700 mb-4 pb-2 border-b-2 border-${accentColor}-200 flex items-center`}>
              <span className={`w-6 h-6 bg-${accentColor}-500 rounded-full flex items-center justify-center text-white mr-2`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              Contact
            </h3>
            
            <div className="space-y-3 text-sm">
              {combinedPersonalInfo.email && (
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-${accentColor}-600 mr-2`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{combinedPersonalInfo.email}</span>
                </div>
              )}
              
              {combinedPersonalInfo.téléphone && (
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-${accentColor}-600 mr-2`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{combinedPersonalInfo.téléphone}</span>
                </div>
              )}
              
              {combinedPersonalInfo.adresse && (
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-${accentColor}-600 mr-2`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{combinedPersonalInfo.adresse}</span>
                </div>
              )}
              
              {combinedPersonalInfo.linkedin && (
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-${accentColor}-600 mr-2`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span>{combinedPersonalInfo.linkedin}</span>
                </div>
              )}
              
              {combinedPersonalInfo['site web'] && (
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-${accentColor}-600 mr-2`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
                  </svg>
                  <span>{combinedPersonalInfo['site web']}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Skills */}
          {skills && (
            <div className="mb-8">
              <h3 className={`text-lg font-bold text-${accentColor}-700 mb-4 pb-2 border-b-2 border-${accentColor}-200 flex items-center`}>
                <span className={`w-6 h-6 bg-${accentColor}-500 rounded-full flex items-center justify-center text-white mr-2`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                {language === 'fr' ? 'Compétences' : 'Skills'}
              </h3>
              
              <div className="space-y-4">
                {skills.split('\n').filter(Boolean).map((skill, index) => {
                  const cleanSkill = skill.replace(/^[*-]\s+/, '');
                  if (!cleanSkill) return null;
                  
                  if (cleanSkill.includes(':')) {
                    const [category, skillList] = cleanSkill.split(':').map(s => s.trim());
                    return (
                      <div key={index}>
                        <h4 className={`font-medium text-${accentColor}-800 mb-1`}>{category}</h4>
                        <p className="text-sm">{skillList}</p>
                      </div>
                    );
                  }
                  
                  return (
                    <div key={index} className={`bg-white py-1 px-3 ${borderRadius} border border-${accentColor}-100 text-sm`}>
                      {cleanSkill}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Languages */}
          {languages && (
            <div className="mb-8">
              <h3 className={`text-lg font-bold text-${accentColor}-700 mb-4 pb-2 border-b-2 border-${accentColor}-200 flex items-center`}>
                <span className={`w-6 h-6 bg-${accentColor}-500 rounded-full flex items-center justify-center text-white mr-2`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </span>
                {language === 'fr' ? 'Langues' : 'Languages'}
              </h3>
              
              <div className="space-y-3">
                {languages.split('\n').filter(Boolean).map((lang, index) => {
                  const cleanLang = lang.replace(/^[*-]\s+/, '');
                  if (!cleanLang) return null;
                  
                  // Format: **Français:** Natif
                  const markdownMatch = cleanLang.match(/\*\*([^:]+):\*\*\s+(.*)/);
                  if (markdownMatch) {
                    const [, langName, level] = markdownMatch;
                    
                    // Calculer une largeur de barre en fonction du niveau
                    let barWidth = '70%';
                    if (level.toLowerCase().includes('natif') || level.toLowerCase().includes('native') || level.toLowerCase().includes('maternel')) {
                      barWidth = '100%';
                    } else if (level.toLowerCase().includes('courant') || level.toLowerCase().includes('fluent')) {
                      barWidth = '90%';
                    } else if (level.toLowerCase().includes('intermédiaire')) {
                      barWidth = '60%';
                    } else if (level.toLowerCase().includes('base') || level.toLowerCase().includes('notions')) {
                      barWidth = '30%';
                    }
                    
                    return (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{langName}</span>
                          <span className="text-xs text-neutral-500">{level}</span>
                        </div>
                        <div className="h-2 w-full bg-neutral-200 rounded-full">
                          <div className={`h-2 bg-${accentColor}-400 rounded-full`} style={{ width: barWidth }}></div>
                        </div>
                      </div>
                    );
                  }
                  
                  // Format: Langue: Niveau sans markdown
                  if (cleanLang.includes(':')) {
                    const [language, level] = cleanLang.split(':').map(s => s.trim());
                    
                    // Calculer une largeur de barre en fonction du niveau
                    let barWidth = '70%';
                    if (level.toLowerCase().includes('natif') || level.toLowerCase().includes('native') || level.toLowerCase().includes('maternel')) {
                      barWidth = '100%';
                    } else if (level.toLowerCase().includes('courant') || level.toLowerCase().includes('fluent')) {
                      barWidth = '90%';
                    } else if (level.toLowerCase().includes('intermédiaire')) {
                      barWidth = '60%';
                    } else if (level.toLowerCase().includes('base') || level.toLowerCase().includes('notions')) {
                      barWidth = '30%';
                    }
                    
                    return (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{language}</span>
                          <span className="text-xs text-neutral-500">{level}</span>
                        </div>
                        <div className="h-2 w-full bg-neutral-200 rounded-full">
                          <div className={`h-2 bg-${accentColor}-400 rounded-full`} style={{ width: barWidth }}></div>
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <div key={index} className="text-sm">
                      {cleanLang}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Intérêts - si présents */}
          {interests && (
            <div>
              <h3 className={`text-lg font-bold text-${accentColor}-700 mb-4 pb-2 border-b-2 border-${accentColor}-200 flex items-center`}>
                <span className={`w-6 h-6 bg-${accentColor}-500 rounded-full flex items-center justify-center text-white mr-2`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                {language === 'fr' ? 'Centres d\'intérêt' : 'Interests'}
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {interests.split('\n').filter(Boolean).map((interest, index) => {
                  const cleanInterest = interest.replace(/^[*-]\s+/, '');
                  if (!cleanInterest) return null;
                  
                  return (
                    <div key={index} className={`bg-white py-1 px-3 ${borderRadius} border border-${accentColor}-100 text-sm`}>
                      {cleanInterest}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Colonne de droite - sections principales */}
        <div className={`col-span-2 ${spacing.split(' ')[0]}`}>
          {/* Profil */}
          {profile && (
            <div className="mb-8">
              <h2 className={`text-xl font-bold text-${accentColor}-700 mb-4 pb-2 border-b-2 border-${accentColor}-200 flex items-center`}>
                <span className={`w-6 h-6 bg-${accentColor}-500 rounded-full flex items-center justify-center text-white mr-2`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                {language === 'fr' ? 'Profil' : 'Profile'}
              </h2>
              <p className="text-neutral-600 leading-relaxed">{profile}</p>
            </div>
          )}
          
          {/* Expérience */}
          {experience && (
            <div className="mb-8">
              <h2 className={`text-xl font-bold text-${accentColor}-700 mb-4 pb-2 border-b-2 border-${accentColor}-200 flex items-center`}>
                <span className={`w-6 h-6 bg-${accentColor}-500 rounded-full flex items-center justify-center text-white mr-2`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                {language === 'fr' ? 'Expérience' : 'Experience'}
              </h2>
              
              <div className="space-y-6">
                {/* Vérifier si la section comporte au moins une expérience au format standard ### */}
                {experience.includes('###') ? (
                  // Format standard avec ### Poste | Entreprise
                  experience.split(/(?=###\s)/).filter(Boolean).map((exp, index) => {
                    const lines = exp.split('\n').filter(Boolean);
                    
                    // Extract job title and company
                    const titleLine = lines[0]?.replace(/^###\s/, '') || '';
                    const [jobTitle, company] = titleLine.split('|').map(s => s?.trim() || '');
                    
                    // Extract date - recherche ligne avec format *période*
                    const dateLine = lines.find(line => line.match(/^\*.*\*$/))?.replace(/^\*|\*$/g, '');
                    
                    // Get responsibilities
                    const responsibilities = lines
                      .filter(line => !line.startsWith('###') && !line.match(/^\*.*\*$/))
                      .map(line => line.replace(/^[*-]\s+/, '').trim())
                      .filter(line => line.trim().length > 0);
                    
                    return (
                      <div key={index} className={`relative pl-8 pb-6 ${index < experience.split(/(?=###\s)/).filter(Boolean).length - 1 ? `before:content-[''] before:absolute before:left-3 before:top-8 before:bottom-0 before:w-0.5 before:bg-${accentColor}-200` : ''}`}>
                        <div className={`absolute left-0 top-1 w-6 h-6 bg-${accentColor}-100 border-2 border-${accentColor}-300 rounded-full`}></div>
                        
                        <h3 className={`text-lg font-semibold text-${accentColor}-700`}>{jobTitle}</h3>
                        {company && <p className="text-neutral-600 font-medium">{company}</p>}
                        {dateLine && <p className="text-sm text-neutral-500 mb-2">{dateLine}</p>}
                        
                        {responsibilities.length > 0 && (
                          <ul className="mt-3 space-y-2 list-disc pl-5">
                            {responsibilities.map((item, i) => (
                              <li key={i} className="text-neutral-600">{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })
                ) : (
                  // Format alternatif - expérience sans structure ###
                  experience.split('\n\n').filter(paragraph => paragraph.trim().length > 0).map((paragraph, index) => {
                    // Nettoyer et diviser en lignes
                    const lines = paragraph.split('\n').filter(line => line.trim().length > 0);
                    
                    // Détecter si la première ligne peut être un titre
                    const firstLine = lines[0].trim();
                    let title = firstLine;
                    let remainingLines = lines.slice(1);
                    
                    // Chercher une date potentielle
                    const dateMatch = paragraph.match(/\b(19|20)\d{2}[-–]\s*(19|20)\d{2}\b|\b(0?[1-9]|1[0-2])\/\d{4}[-–]\s*(0?[1-9]|1[0-2])\/\d{4}\b/);
                    const dateLine = dateMatch ? dateMatch[0] : '';
                    
                    // Filtrer la date de la liste des responsabilités
                    const responsibilities = remainingLines
                      .filter(line => !line.includes(dateLine))
                      .filter(line => !line.match(/\b(19|20)\d{2}[-–]\s*(19|20)\d{2}\b|\b(0?[1-9]|1[0-2])\/\d{4}[-–]\s*(0?[1-9]|1[0-2])\/\d{4}\b/))
                      .map(line => line.replace(/^[*-]\s+/, '').trim())
                      .filter(line => line.trim().length > 0);

                    // Si pas de responsabilités, utiliser la première ligne comme responsabilité
                    if (responsibilities.length === 0 && title) {
                      responsibilities.push(title);
                      title = '';
                    }
                    
                    // Icônes et styles de la timeline
                    const isLast = index === experience.split('\n\n').filter(paragraph => paragraph.trim().length > 0).length - 1;
                    const timelineStyle = !isLast ? `before:content-[''] before:absolute before:left-3 before:top-8 before:bottom-0 before:w-0.5 before:bg-${accentColor}-200` : '';
                    
                    return (
                      <div key={index} className={`relative pl-8 pb-6 ${timelineStyle}`}>
                        <div className={`absolute left-0 top-1 w-6 h-6 bg-${accentColor}-100 border-2 border-${accentColor}-300 rounded-full`}></div>
                        
                        {title && <h3 className={`text-lg font-semibold text-${accentColor}-700`}>{title}</h3>}
                        {dateLine && <p className="text-sm text-neutral-500 mb-2">{dateLine}</p>}
                        
                        {responsibilities.length > 0 && (
                          <ul className="mt-3 space-y-2 list-disc pl-5">
                            {responsibilities.map((item, i) => (
                              <li key={i} className="text-neutral-600">{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
          
          {/* Formation */}
          {education && (
            <div className="mb-8">
              <h2 className={`text-xl font-bold text-${accentColor}-700 mb-4 pb-2 border-b-2 border-${accentColor}-200 flex items-center`}>
                <span className={`w-6 h-6 bg-${accentColor}-500 rounded-full flex items-center justify-center text-white mr-2`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                </span>
                {language === 'fr' ? 'Formation' : 'Education'}
              </h2>
              
              <div className="space-y-6">
                {/* Vérifier si le format standard avec ### est utilisé */}
                {education.includes('###') ? (
                  // Format standard
                  education.split(/(?=###\s)/).filter(Boolean).map((edu, index) => {
                    const lines = edu.split('\n').filter(Boolean);
                    
                    // If the section doesn't start with ###, handle as simple list
                    if (!lines[0]?.startsWith('###')) {
                      // Filtrer les lignes qui contiennent des informations de contact
                      const filteredLines = lines.filter(line => {
                        // Exclure les lignes avec format "**Email:**" ou "**Téléphone:**"
                        if (line.match(/\*\*(Email|Téléphone|Mail|Phone|Adresse|Address|LinkedIn|Site web|Website):\*\*/i)) {
                          return false;
                        }
                        // Exclure les lignes qui semblent être des emails
                        if (line.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/)) {
                          return false;
                        }
                        // Exclure les lignes qui semblent être des numéros de téléphone
                        if (line.match(/(?:\+\d{1,3}[\s-]?)?(?:\d{1,4}[\s\-.]?){3,4}/)) {
                          return false;
                        }
                        return true;
                      });

                      return (
                        <div key={index} className="space-y-2">
                          {filteredLines.map((line, i) => {
                            // Remove list markers
                            const cleanLine = line.replace(/^[*-]\s+/, '');
                            return (
                              <div key={`${index}-${i}`} className="mb-2">
                                <p className="text-neutral-600">{cleanLine}</p>
                              </div>
                            );
                          })}
                        </div>
                      );
                    }
                    
                    // Extract degree and school
                    const titleLine = lines[0]?.replace(/^###\s/, '') || '';
                    const [degree, school] = titleLine.split('|').map(s => s?.trim() || '');
                    
                    // Extract date - recherche ligne avec format *période*
                    const dateLine = lines.find(line => line.match(/^\*.*\*$/))?.replace(/^\*|\*$/g, '');
                    
                    // Get details and filter out contact info
                    const details = lines
                      .filter(line => !line.startsWith('###') && !line.match(/^\*.*\*$/))
                      .map(line => line.replace(/^[*-]\s+/, '').trim())
                      .filter(line => {
                        // Exclure les lignes avec format "**Email:**" ou "**Téléphone:**"
                        if (line.match(/\*\*(Email|Téléphone|Mail|Phone|Adresse|Address|LinkedIn|Site web|Website):\*\*/i)) {
                          return false;
                        }
                        // Exclure les lignes qui semblent être des emails
                        if (line.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/)) {
                          return false;
                        }
                        // Exclure les lignes qui semblent être des numéros de téléphone
                        if (line.match(/(?:\+\d{1,3}[\s-]?)?(?:\d{1,4}[\s\-.]?){3,4}/)) {
                          return false;
                        }
                        return line.trim().length > 0;
                      });
                    
                    return (
                      <div key={index} className={`relative pl-8 pb-6 ${index < education.split(/(?=###\s)/).filter(Boolean).length - 1 ? `before:content-[''] before:absolute before:left-3 before:top-8 before:bottom-0 before:w-0.5 before:bg-${accentColor}-200` : ''}`}>
                        <div className={`absolute left-0 top-1 w-6 h-6 bg-${accentColor}-100 border-2 border-${accentColor}-300 rounded-full`}></div>
                        
                        <h3 className={`text-lg font-semibold text-${accentColor}-700`}>{degree}</h3>
                        {school && <p className="text-neutral-600 font-medium">{school}</p>}
                        {dateLine && <p className="text-sm text-neutral-500 mb-2">{dateLine}</p>}
                        
                        {details.length > 0 && (
                          <ul className="mt-3 space-y-2 list-disc pl-5">
                            {details.map((item, i) => (
                              <li key={i} className="text-neutral-600">{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })
                ) : (
                  // Format non standard - analyse intelligente plus avancée
                  (() => {
                    // Définition d'un type pour une formation
                    interface Formation {
                      title: string;
                      school: string;
                      date: string;
                      details: string[];
                    }
                    
                    // Analyser le texte pour identifier les formations
                    const formationText = education;
                    
                    // Regex pour détecter les diplômes
                    const diplomaRegex = /\b(Master|Licence|Bachelor|Doctorat|PhD|MBA|Diplôme|BTS|DUT|Ingénieur|Formation)\b/i;
                    
                    // Regex pour détecter les dates
                    const dateRegex = /\b(19|20)\d{2}[-–]\s*(19|20)\d{2}\b|\b(0?[1-9]|1[0-2])\/\d{4}[-–]\s*(0?[1-9]|1[0-2])\/\d{4}\b/;
                    
                    // Regex pour détecter les écoles
                    const schoolRegex = /\b(université|university|école|school|institut|institute|center|centre|polytechnique|ESG|Hetic)\b/i;
                    
                    // Séparer d'abord par des lignes vides pour identifier les paragraphes
                    const paragraphs = formationText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
                    
                    const formations: Formation[] = [];
                    let lastDiploma: Formation | null = null;
                    
                    // Pour chaque paragraphe, détecter s'il s'agit d'un diplôme, d'une date ou de détails
                    paragraphs.forEach(paragraph => {
                      const lines = paragraph.split('\n').filter(line => line.trim().length > 0);
                      
                      // Ignorer les paragraphes qui contiennent des informations de contact
                      if (paragraph.match(/\*\*(Email|Téléphone|Mail|Phone|Adresse|Address|LinkedIn|Site web|Website):\*\*/i) ||
                          paragraph.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/) ||
                          paragraph.match(/(?:\+\d{1,3}[\s-]?)?(?:\d{1,4}[\s\-.]?){3,4}/)) {
                        return;
                      }
                      
                      // Déterminer ce qu'est ce paragraphe
                      let isDiploma = false;
                      let isDate = false;
                      let isSchool = false;
                      
                      for (const line of lines) {
                        const cleanLine = line.replace(/^[*•-]\s+/, '').trim();
                        
                        if (cleanLine.match(diplomaRegex)) {
                          isDiploma = true;
                          break;
                        }
                        
                        if (cleanLine.match(dateRegex) && cleanLine.length < 20) {
                          isDate = true;
                          break;
                        }
                        
                        if (cleanLine.match(schoolRegex)) {
                          isSchool = true;
                          break;
                        }
                      }
                      
                      // Si c'est un diplôme, créer une nouvelle formation
                      if (isDiploma || (!isDate && !isSchool && lines[0] && lines[0].trim().length > 10 && lines[0][0] === lines[0][0].toUpperCase())) {
                        // Si une nouvelle formation est détectée, ajouter la précédente à la liste
                        if (lastDiploma) {
                          formations.push(lastDiploma);
                        }
                        
                        lastDiploma = {
                          title: lines[0].replace(/^[*•-]\s+/, '').trim(),
                          school: '',
                          date: '',
                          details: []
                        };
                        
                        // Traiter les autres lignes comme détails ou école
                        lines.slice(1).forEach(line => {
                          const cleanLine = line.replace(/^[*•-]\s+/, '').trim();
                          
                          if (cleanLine.match(schoolRegex)) {
                            lastDiploma!.school = cleanLine;
                          } else if (cleanLine.match(dateRegex) && cleanLine.length < 20) {
                            lastDiploma!.date = cleanLine;
                          } else {
                            lastDiploma!.details.push(cleanLine);
                          }
                        });
                      }
                      // Si c'est une date et qu'on a un diplôme précédent, l'ajouter à ce diplôme
                      else if (isDate && lastDiploma) {
                        lastDiploma.date = lines[0].replace(/^[*•-]\s+/, '').trim();
                        
                        // Ajouter les autres lignes comme détails
                        lines.slice(1).forEach(line => {
                          const cleanLine = line.replace(/^[*•-]\s+/, '').trim();
                          if (cleanLine.length > 0) {
                            lastDiploma!.details.push(cleanLine);
                          }
                        });
                      }
                      // Si c'est une école et qu'on a un diplôme précédent, l'ajouter à ce diplôme
                      else if (isSchool && lastDiploma) {
                        lastDiploma.school = lines[0].replace(/^[*•-]\s+/, '').trim();
                        
                        // Ajouter les autres lignes comme détails
                        lines.slice(1).forEach(line => {
                          const cleanLine = line.replace(/^[*•-]\s+/, '').trim();
                          if (cleanLine.length > 0) {
                            lastDiploma!.details.push(cleanLine);
                          }
                        });
                      }
                      // Sinon, ajouter toutes les lignes comme détails au diplôme précédent
                      else if (lastDiploma) {
                        lines.forEach(line => {
                          const cleanLine = line.replace(/^[*•-]\s+/, '').trim();
                          if (cleanLine.length > 0) {
                            lastDiploma!.details.push(cleanLine);
                          }
                        });
                      }
                      // Si on n'a pas de diplôme précédent et que ce n'est pas une date, créer un nouveau diplôme
                      else if (!isDate) {
                        lastDiploma = {
                          title: lines[0].replace(/^[*•-]\s+/, '').trim(),
                          school: '',
                          date: '',
                          details: []
                        };
                        
                        // Traiter les autres lignes comme détails
                        lines.slice(1).forEach(line => {
                          const cleanLine = line.replace(/^[*•-]\s+/, '').trim();
                          if (cleanLine.length > 0) {
                            lastDiploma!.details.push(cleanLine);
                          }
                        });
                      }
                    });
                    
                    // Ajouter la dernière formation
                    if (lastDiploma) {
                      formations.push(lastDiploma);
                    }
                    
                    // Finaliser la structure des formations en déplaçant les détails qui sont en fait des dates ou des écoles
                    formations.forEach(formation => {
                      // Chercher parmi les détails s'il y a des dates ou des écoles
                      const newDetails: string[] = [];
                      
                      formation.details.forEach(detail => {
                        if (detail.match(dateRegex) && detail.length < 20 && !formation.date) {
                          formation.date = detail;
                        } else if (detail.match(schoolRegex) && !formation.school) {
                          formation.school = detail;
                        } else {
                          newDetails.push(detail);
                        }
                      });
                      
                      formation.details = newDetails;
                    });
                    
                    // Rendu des formations analysées avec timeline
                    return formations.map((formation, index) => {
                      const isLast = index === formations.length - 1;
                      const timelineStyle = !isLast ? `before:content-[''] before:absolute before:left-3 before:top-8 before:bottom-0 before:w-0.5 before:bg-${accentColor}-200` : '';
                      
                      return (
                        <div key={index} className={`relative pl-8 pb-6 ${timelineStyle}`}>
                          <div className={`absolute left-0 top-1 w-6 h-6 bg-${accentColor}-100 border-2 border-${accentColor}-300 rounded-full`}></div>
                          
                          <h3 className={`text-lg font-semibold text-${accentColor}-700`}>{formation.title}</h3>
                          {formation.school && <p className="text-neutral-600 font-medium">{formation.school}</p>}
                          {formation.date && <p className="text-sm text-neutral-500 mb-2">{formation.date}</p>}
                          
                          {formation.details.length > 0 && (
                            <ul className="mt-3 space-y-2 list-disc pl-5">
                              {formation.details.map((detail, i) => (
                                <li key={i} className="text-neutral-600">{detail}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    });
                  })()
                )}
              </div>
            </div>
          )}
          
          {/* Projets - si présents */}
          {projects && (
            <div>
              <h2 className={`text-xl font-bold text-${accentColor}-700 mb-4 pb-2 border-b-2 border-${accentColor}-200 flex items-center`}>
                <span className={`w-6 h-6 bg-${accentColor}-500 rounded-full flex items-center justify-center text-white mr-2`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </span>
                {language === 'fr' ? 'Projets' : 'Projects'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.split(/(?=###\s)/).filter(Boolean).map((project, index) => {
                  const lines = project.split('\n').filter(Boolean);
                  
                  // Extract project title and tech
                  const titleLine = lines[0]?.replace(/^###\s/, '') || '';
                  const [projectName, tech] = titleLine.split('|').map(s => s?.trim() || '');
                  
                  // Get project description
                  const description = lines
                    .filter(line => !line.startsWith('###'))
                    .map(line => line.replace(/^[*-]\s+/, '').trim())
                    .filter(line => line.trim().length > 0)
                    .join(' ');
                  
                  return (
                    <div key={index} className={`${borderRadius} border border-${accentColor}-100 p-4 bg-white shadow-sm`}>
                      <h3 className={`font-semibold text-${accentColor}-700 mb-1`}>{projectName}</h3>
                      {tech && <p className="text-sm font-medium text-neutral-500 mb-2">{tech}</p>}
                      <p className="text-sm text-neutral-600">{description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;