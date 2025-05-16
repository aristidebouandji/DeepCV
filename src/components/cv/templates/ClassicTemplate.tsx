import React from 'react';
import { Language } from '../../../context/CVContext';
import { SECTION_NAMES, DEFAULT_CONTACT, ThemeOptions } from '../CVTemplate';

interface ClassicTemplateProps {
  sections: Record<string, string>;
  language: Language;
  theme: ThemeOptions;
}

const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ sections, language, theme }) => {
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
  const certifications = sections[SECTION_NAMES.CERTIFICATIONS] || sections.certifications || '';
  const interests = sections[SECTION_NAMES.INTERESTS] || sections.intérêts || '';

  // Obtenir les styles basés sur le thème
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
      case 'compact': return 'p-4 space-y-4';
      case 'comfortable': return 'p-8 space-y-8';
      case 'loose': return 'p-10 space-y-10';
      default: return 'p-6 space-y-6';
    }
  };

  const getFontSize = () => {
    switch (theme.fontSize) {
      case 'sm': return 'text-sm';
      case 'lg': return 'text-lg';
      default: return 'text-base';
    }
  };

  const getPrimaryColor = () => {
    return `text-${theme.primaryColor || 'neutral'}-800`;
  };

  const getSecondaryColor = () => {
    return `text-${theme.secondaryColor || 'neutral'}-600`;
  };

  const getAccentColor = () => {
    return `border-${theme.accentColor || 'neutral'}-300`;
  };

  // Appliquer les styles
  const borderRadius = getBorderRadius();
  const spacing = getSpacing();
  const fontSize = getFontSize();
  const primaryColor = getPrimaryColor();
  const secondaryColor = getSecondaryColor();
  const accentColor = getAccentColor();

  return (
    <div className={`font-${theme.fontFamily || 'serif'} ${fontSize} text-neutral-800 max-w-4xl mx-auto ${spacing.split(' ')[0]} bg-neutral-50 border border-neutral-200 ${borderRadius}`}>
      {/* Header */}
      <header className={`text-center mb-8 pb-6 border-b-2 ${accentColor}`}>
        <h1 className={`text-3xl font-bold mb-2 ${primaryColor}`}>{title}</h1>
        
        {/* Contact info */}
        <div className={`${secondaryColor} text-sm mt-2 flex flex-wrap justify-center gap-2`}>
          {combinedPersonalInfo.email && <span>{combinedPersonalInfo.email}</span>}
          {combinedPersonalInfo.téléphone && <><span className="hidden sm:inline">|</span> <span>{combinedPersonalInfo.téléphone}</span></>}
          {combinedPersonalInfo.adresse && <><span className="hidden sm:inline">|</span> <span>{combinedPersonalInfo.adresse}</span></>}
          {combinedPersonalInfo.linkedin && <><span className="hidden sm:inline">|</span> <span>{combinedPersonalInfo.linkedin}</span></>}
          {combinedPersonalInfo['site web'] && <><span className="hidden sm:inline">|</span> <span>{combinedPersonalInfo['site web']}</span></>}
        </div>
        
        {profile && (
          <p className={`mt-4 ${secondaryColor} mx-auto max-w-2xl`}>
            {profile.trim()}
          </p>
        )}
      </header>
      
      <div className={spacing.split(' ')[1]}>
        {/* Expérience Professionnelle */}
        {experience && (
          <section>
            <h2 className={`text-xl font-bold ${primaryColor} mb-3 uppercase tracking-wide`}>
              {language === 'fr' ? 'Expérience' : 'Experience'}
            </h2>
            
            <div className="space-y-4">
              {/* Vérifier si la section comporte au moins une expérience au format standard ### */}
              {experience.includes('###') ? (
                // Format standard avec ### Poste | Entreprise
                experience.split(/(?=###\s)/).filter(Boolean).map((exp, index) => {
                  const lines = exp.split('\n').filter(Boolean);
                  if (lines.length === 0) return null;
                  
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
                    <div key={index} className={`pb-4 ${borderRadius}`}>
                      <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-1">
                        <h3 className={`font-bold ${primaryColor}`}>{jobTitle}</h3>
                        <span className={`${secondaryColor} text-sm`}>{dateLine}</span>
                      </div>
                      {company && <p className={`font-medium ${secondaryColor} mb-2`}>{company}</p>}
                      <ul className="list-disc pl-5 space-y-1">
                        {responsibilities.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
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
                    <div key={index} className={`pb-4 ${borderRadius}`}>
                      {title && (
                        <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-1">
                          <h3 className={`font-bold ${primaryColor}`}>{title}</h3>
                          {dateLine && <span className={`${secondaryColor} text-sm`}>{dateLine}</span>}
                        </div>
                      )}
                      {!title && dateLine && (
                        <div className="mb-1">
                          <span className={`${secondaryColor} text-sm`}>{dateLine}</span>
                        </div>
                      )}
                      <ul className="list-disc pl-5 space-y-1">
                        {responsibilities.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        )}
        
        {/* Formation */}
        {education && (
          <section>
            <h2 className={`text-xl font-bold ${primaryColor} mb-3 uppercase tracking-wide`}>
              {language === 'fr' ? 'Formation' : 'Education'}
            </h2>
            
            <div className="space-y-3">
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
                              <p>{cleanLine}</p>
                            </div>
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
                    <div key={index} className="mb-2">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-baseline">
                        <h3 className={`font-semibold ${primaryColor}`}>{degree}</h3>
                        {dateLine && <span className={`${secondaryColor} text-sm`}>{dateLine}</span>}
                      </div>
                      {school && <p className={secondaryColor}>{school}</p>}
                      
                      {details.length > 0 && (
                        <ul className="list-disc pl-5 space-y-1 mt-1 text-sm">
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
                    <div key={index} className="mb-2">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-baseline">
                        <h3 className={`font-semibold ${primaryColor}`}>{formation.title}</h3>
                        {formation.date && <span className={`${secondaryColor} text-sm`}>{formation.date}</span>}
                      </div>
                      {formation.school && <p className={secondaryColor}>{formation.school}</p>}
                      
                      {formation.details.length > 0 && (
                        <ul className="list-disc pl-5 space-y-1 mt-1 text-sm">
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
          </section>
        )}
        
        {/* Compétences */}
        {skills && (
          <section>
            <h2 className={`text-xl font-bold ${primaryColor} mb-3 uppercase tracking-wide`}>
              {language === 'fr' ? 'Compétences' : 'Skills'}
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {skills.split('\n').filter(Boolean).map((skill, index) => {
                // Removes list markers
                const cleanSkill = skill.replace(/^[*-]\s+/, '');
                if (!cleanSkill) return null;
                
                return (
                  <div key={index} className={`inline-block px-3 py-1 bg-neutral-100 ${borderRadius} ${primaryColor}`}>
                    {cleanSkill}
                  </div>
                );
              })}
            </div>
          </section>
        )}
        
        {/* Langues */}
        {languages && (
          <section>
            <h2 className={`text-xl font-bold ${primaryColor} mb-3 uppercase tracking-wide`}>
              {language === 'fr' ? 'Langues' : 'Languages'}
            </h2>
            
            <div className="mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {languages.split('\n').filter(Boolean).map((lang, index) => {
                  // Removes list markers
                  const cleanLang = lang.replace(/^[*-]\s+/, '');
                  if (!cleanLang) return null;
                  
                  // Format: **Français:** Natif
                  const match = cleanLang.match(/\*\*([^:]+):\*\*\s+(.*)/);
                  
                  if (match) {
                    const [, langName, level] = match;
                    return (
                      <div key={index} className="flex justify-between items-center">
                        <span className={`font-medium ${primaryColor}`}>{langName}</span>
                        <span className={secondaryColor}>{level}</span>
                      </div>
                    );
                  }
                  
                  // Si le format est "Langue: Niveau" sans markdown
                  if (cleanLang.includes(':')) {
                    const [langName, level] = cleanLang.split(':').map(s => s.trim());
                    return (
                      <div key={index} className="flex justify-between items-center">
                        <span className={`font-medium ${primaryColor}`}>{langName}</span>
                        <span className={secondaryColor}>{level}</span>
                      </div>
                    );
                  }
                  
                  return (
                    <div key={index}>
                      {cleanLang}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
        
        {/* Certifications - si présent */}
        {certifications && (
          <section>
            <h2 className={`text-xl font-bold ${primaryColor} mb-3 uppercase tracking-wide`}>
              {language === 'fr' ? 'Certifications' : 'Certifications'}
            </h2>
            
            <div className="mt-2">
              <ul className="list-disc pl-5">
                {certifications.split('\n').filter(Boolean).map((cert, index) => {
                  const cleanCert = cert.replace(/^[*-]\s+/, '');
                  if (!cleanCert) return null;
                  
                  return <li key={index}>{cleanCert}</li>;
                })}
              </ul>
            </div>
          </section>
        )}
        
        {/* Centres d'intérêt - si présent */}
        {interests && (
          <section>
            <h2 className={`text-xl font-bold ${primaryColor} mb-3 uppercase tracking-wide`}>
              {language === 'fr' ? 'Centres d\'intérêt' : 'Interests'}
            </h2>
            
            <div className="mt-2">
              <ul className="list-disc pl-5">
                {interests.split('\n').filter(Boolean).map((interest, index) => {
                  const cleanInterest = interest.replace(/^[*-]\s+/, '');
                  if (!cleanInterest) return null;
                  
                  return <li key={index}>{cleanInterest}</li>;
                })}
              </ul>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ClassicTemplate;