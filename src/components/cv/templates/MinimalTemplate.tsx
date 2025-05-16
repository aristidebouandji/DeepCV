import React from 'react';
import { Language } from '../../../context/CVContext';
import { SECTION_NAMES, DEFAULT_CONTACT, ThemeOptions } from '../CVTemplate';

interface MinimalTemplateProps {
  sections: Record<string, string>;
  language: Language;
  theme: ThemeOptions;
}

const MinimalTemplate: React.FC<MinimalTemplateProps> = ({ sections, language, theme }) => {
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
      case 'compact': return 'px-4 py-2 gap-4';
      case 'comfortable': return 'px-8 py-8 gap-8';
      case 'loose': return 'px-10 py-10 gap-10';
      default: return 'px-6 py-6 gap-6';
    }
  };

  const getAccentColor = () => {
    return `text-${theme.accentColor || theme.primaryColor || 'neutral'}-600`;
  };

  const spacing = getSpacing();
  const borderRadius = getBorderRadius();
  const accentColor = getAccentColor();

  return (
    <div className={`font-${theme.fontFamily || 'sans'} text-${theme.fontSize || 'base'} text-neutral-800 max-w-4xl mx-auto bg-white`}>
      {/* Header with name only */}
      <header className="py-6 border-b border-neutral-200">
        <h1 className="text-3xl font-light text-center">{title}</h1>
      </header>
      
      <div className={`grid grid-cols-1 md:grid-cols-3 ${spacing.split(' ')[2]}`}>
        {/* Left column: Contact & Skills */}
        <div className={`md:border-r border-neutral-200 ${spacing.split(' ')[0]}`}>
          {/* Contact info dynamique */}
          <div className="mb-8">
            <h2 className={`text-sm uppercase tracking-wider font-semibold ${accentColor} mb-4`}>Contact</h2>
            <div className="space-y-2 text-sm">
              {combinedPersonalInfo.email && <p>{combinedPersonalInfo.email}</p>}
              {combinedPersonalInfo.téléphone && <p>{combinedPersonalInfo.téléphone}</p>}
              {combinedPersonalInfo.adresse && <p>{combinedPersonalInfo.adresse}</p>}
              {combinedPersonalInfo.linkedin && <p>{combinedPersonalInfo.linkedin}</p>}
              {combinedPersonalInfo['site web'] && <p>{combinedPersonalInfo['site web']}</p>}
            </div>
          </div>
          
          {/* Skills section */}
          {skills && (
            <div className="mb-8">
              <h2 className={`text-sm uppercase tracking-wider font-semibold ${accentColor} mb-4`}>
                {language === 'fr' ? 'Compétences' : 'Skills'}
              </h2>
              <div className="space-y-3">
                {skills.split('\n').filter(Boolean).map((skill, index) => {
                  const cleanSkill = skill.replace(/^[*-]\s+/, '');
                  if (!cleanSkill) return null;
                  
                  if (cleanSkill.includes(':')) {
                    const [category, skillItems] = cleanSkill.split(':').map(s => s.trim());
                    return (
                      <div key={index}>
                        <p className="font-medium">{category}</p>
                        <p className="text-neutral-600 text-sm">{skillItems}</p>
                      </div>
                    );
                  }
                  
                  return <p key={index} className="text-sm">{cleanSkill}</p>;
                })}
              </div>
            </div>
          )}
          
          {/* Languages section */}
          {languages && (
            <div>
              <h2 className={`text-sm uppercase tracking-wider font-semibold ${accentColor} mb-4`}>
                {language === 'fr' ? 'Langues' : 'Languages'}
              </h2>
              <div className="space-y-2">
                {languages.split('\n').filter(Boolean).map((lang, index) => {
                  const cleanLang = lang.replace(/^[*-]\s+/, '');
                  if (!cleanLang) return null;
                  
                  // Format: **Français:** Natif
                  const match = cleanLang.match(/\*\*([^:]+):\*\*\s+(.*)/);
                  if (match) {
                    const [, langName, level] = match;
                    return (
                      <div key={index} className="flex justify-between">
                        <span className="font-medium">{langName}</span>
                        <span className="text-neutral-600">{level}</span>
                      </div>
                    );
                  }
                  
                  // Si le format est "Langue: Niveau" sans markdown
                  if (cleanLang.includes(':')) {
                    const [langName, level] = cleanLang.split(':').map(s => s.trim());
                    return (
                      <div key={index} className="flex justify-between">
                        <span className="font-medium">{langName}</span>
                        <span className="text-neutral-600">{level}</span>
                      </div>
                    );
                  }
                  
                  return <p key={index} className="text-sm">{cleanLang}</p>;
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Right column: Profile, Experience, Education */}
        <div className={`col-span-2 ${spacing.split(' ')[0]}`}>
          {/* Profile section */}
          {profile && (
            <div className="mb-8">
              <h2 className={`text-sm uppercase tracking-wider font-semibold ${accentColor} mb-4`}>
                {language === 'fr' ? 'Profil' : 'Profile'}
              </h2>
              <p className="text-neutral-700 leading-relaxed">{profile.trim()}</p>
            </div>
          )}
          
          {/* Experience section */}
          {experience && (
            <div className="mb-8">
              <h2 className={`text-sm uppercase tracking-wider font-semibold ${accentColor} mb-4`}>
                {language === 'fr' ? 'Expérience' : 'Experience'}
              </h2>
              
              <div className="space-y-6">
                {/* Vérifier si la section comporte au moins une expérience au format standard ### */}
                {experience.includes('###') ? (
                  // Format standard avec ### Poste | Entreprise
                  experience.split(/(?=###\s)/).filter(Boolean).map((exp, index) => {
                    const lines = exp.split('\n').filter(Boolean);
                    
                    if (lines.length === 0) return null;
                    
                    // Extract job title and company
                    const titleLine = lines[0]?.replace(/^###\s/, '') || '';
                    const [jobTitle, company] = titleLine.split('|').map(s => s?.trim() || '');
                    
                    // Extract date
                    const dateLine = lines.find(line => line.match(/^\*.*\*$/))?.replace(/^\*|\*$/g, '');
                    
                    // Get responsibilities
                    const responsibilities = lines
                      .filter(line => !line.startsWith('###') && !line.match(/^\*.*\*$/))
                      .map(line => line.replace(/^[*-]\s+/, '').trim())
                      .filter(line => line.trim().length > 0);
                    
                    return (
                      <div key={index}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className={`font-medium ${accentColor}`}>{jobTitle}</h3>
                          {dateLine && <span className="text-neutral-500 text-sm">{dateLine}</span>}
                        </div>
                        {company && <p className="text-neutral-600 text-sm mb-2">{company}</p>}
                        
                        {responsibilities.length > 0 && (
                          <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-700">
                            {responsibilities.map((item, i) => (
                              <li key={i}>{item}</li>
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
                    
                    return (
                      <div key={index}>
                        {title && (
                          <div className="flex justify-between items-baseline mb-1">
                            <h3 className={`font-medium ${accentColor}`}>{title}</h3>
                            {dateLine && <span className="text-neutral-500 text-sm">{dateLine}</span>}
                          </div>
                        )}
                        {!title && dateLine && (
                          <div className="mb-1">
                            <span className="text-neutral-500 text-sm">{dateLine}</span>
                          </div>
                        )}
                        {responsibilities.length > 0 && (
                          <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-700">
                            {responsibilities.map((item, i) => (
                              <li key={i}>{item}</li>
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
          
          {/* Education section */}
          {education && (
            <div>
              <h2 className={`text-sm uppercase tracking-wider font-semibold ${accentColor} mb-4`}>
                {language === 'fr' ? 'Formation' : 'Education'}
              </h2>
              
              <div className="space-y-4">
                {/* Vérifier si le format standard avec ### est utilisé */}
                {education.includes('###') ? (
                  // Format standard
                  education.split(/(?=###\s)/).filter(Boolean).map((edu, index) => {
                    const lines = edu.split('\n').filter(Boolean);
                    
                    if (lines.length === 0) return null;
                    
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
                        <div key={index}>
                          {filteredLines.map((line, i) => {
                            // Remove list markers
                            const cleanLine = line.replace(/^[*-]\s+/, '');
                            return (
                              <p key={i} className="text-sm text-neutral-700">{cleanLine}</p>
                            );
                          })}
                        </div>
                      );
                    }
                    
                    // Extract degree and school
                    const titleLine = lines[0]?.replace(/^###\s/, '') || '';
                    const [degree, school] = titleLine.split('|').map(s => s?.trim() || '');
                    
                    // Extract date
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
                      <div key={index}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className={`font-medium ${accentColor}`}>{degree}</h3>
                          {dateLine && <span className="text-neutral-500 text-sm">{dateLine}</span>}
                        </div>
                        {school && <p className="text-neutral-600 text-sm mb-1">{school}</p>}
                        
                        {details.length > 0 && (
                          <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-700">
                            {details.map((item, i) => (
                              <li key={i}>{item}</li>
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
                    
                    // Rendu des formations analysées
                    return formations.map((formation, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className={`font-medium ${accentColor}`}>{formation.title}</h3>
                          {formation.date && <span className="text-neutral-500 text-sm">{formation.date}</span>}
                        </div>
                        {formation.school && <p className="text-neutral-600 text-sm mb-1">{formation.school}</p>}
                        
                        {formation.details.length > 0 && (
                          <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-700">
                            {formation.details.map((detail, i) => (
                              <li key={i}>{detail}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ));
                  })()
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MinimalTemplate;