import React from 'react';
import { Language } from '../../../context/CVContext';
import { User, MapPin, Mail, Phone, Globe, Calendar, Briefcase, GraduationCap, Languages as LanguagesIcon, Link } from 'lucide-react';

interface ModernTemplateProps {
  sections: Record<string, string>;
  language: Language;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ sections, language }) => {
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
  
  return (
    <div className="font-sans text-neutral-800 max-w-4xl mx-auto">
      {/* Header */}
      <header className="bg-primary-700 text-white p-8 rounded-t-lg">
        <h1 className="text-3xl font-bold text-white">{sections.title || 'CV Optimisé'}</h1>
        
        {sections.profil && (
          <p className="mt-3 text-primary-100 text-lg">
            {sections.profil.trim()}
          </p>
        )}
        
        {/* Contact info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {combinedPersonalInfo.email && (
            <div className="flex items-center">
              <Mail size={16} className="mr-2 text-primary-300" />
              <span>{combinedPersonalInfo.email}</span>
            </div>
          )}
          
          {combinedPersonalInfo.téléphone && (
            <div className="flex items-center">
              <Phone size={16} className="mr-2 text-primary-300" />
              <span>{combinedPersonalInfo.téléphone}</span>
            </div>
          )}
          
          {combinedPersonalInfo.adresse && (
            <div className="flex items-center">
              <MapPin size={16} className="mr-2 text-primary-300" />
              <span>{combinedPersonalInfo.adresse}</span>
            </div>
          )}
          
          {combinedPersonalInfo.linkedin && (
            <div className="flex items-center">
              <Globe size={16} className="mr-2 text-primary-300" />
              <span>{combinedPersonalInfo.linkedin}</span>
            </div>
          )}
          
          {combinedPersonalInfo['site web'] && (
            <div className="flex items-center">
              <Link size={16} className="mr-2 text-primary-300" />
              <span>{combinedPersonalInfo['site web']}</span>
            </div>
          )}
        </div>
      </header>
      
      <div className="bg-white p-8 rounded-b-lg">
        {/* Expérience */}
        {sections.expérience && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-primary-700 border-b-2 border-primary-200 pb-2 mb-3">
              {language === 'fr' ? 'Expérience' : 'Experience'}
            </h2>
            
            <div className="space-y-6 mt-3">
              {/* Vérifier si la section comporte au moins une expérience au format standard ### */}
              {sections.expérience.includes('###') ? (
                // Format standard avec ### Poste | Entreprise
                sections.expérience.split(/(?=###\s)/).filter(Boolean).map((exp, index) => {
                  const lines = exp.split('\n').filter(Boolean);
                  
                  // Extract job title and company
                  const titleLine = lines[0]?.replace(/^###\s/, '') || '';
                  const [jobTitle, company] = titleLine.split('|').map(s => s?.trim() || '');
                  
                  // Extract date
                  const dateLine = lines.find(line => line.match(/^\*.*\*$/))?.replace(/^\*|\*$/g, '');
                  
                  // Get the rest as responsibilities
                  const responsibilities = lines
                    .filter(line => !line.startsWith('###') && !line.match(/^\*.*\*$/))
                    .map(line => line.replace(/^[*-]\s+/, ''))
                    .filter(line => line.trim().length > 0);
                  
                  return (
                    <div key={index} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-primary-200">
                      <h3 className="font-bold text-lg">{jobTitle}</h3>
                      <div className="flex flex-wrap items-center text-neutral-600 mb-2">
                        {company && (
                          <>
                            <Briefcase size={16} className="mr-1 text-primary-600" />
                            <span className="font-medium">{company}</span>
                          </>
                        )}
                        {dateLine && (
                          <>
                            <span className="mx-2">•</span>
                            <Calendar size={16} className="mr-1 text-primary-600" />
                            <span>{dateLine}</span>
                          </>
                        )}
                      </div>
                      <ul className="space-y-1 mt-2">
                        {responsibilities.map((item, i) => (
                          <li key={i} className="flex">
                            <span className="mr-2">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })
              ) : (
                // Format alternatif - analyse intelligente des expériences
                (() => {
                  // Type pour une expérience
                  interface Experience {
                    title: string;
                    company: string;
                    date: string;
                    responsibilities: string[];
                  }
                  
                  const experienceLines = sections.expérience.split('\n').filter(line => line.trim().length > 0);
                  const experiences: Experience[] = [];
                  let currentExperience: Experience | null = null;
                  
                  // Regex pour détecter les dates
                  const dateRegex = /\b(19|20)\d{2}[-–]\s*(19|20)\d{2}\b|\b(0?[1-9]|1[0-2])\/\d{4}[-–]\s*(0?[1-9]|1[0-2])\/\d{4}\b/;
                  // Regex pour détecter les entreprises
                  const companyRegex = /\b(entreprise|company|corporation|inc\.|sarl|sas|SA)\b/i;
                  
                  // Première identification par paragraphes
                  const paragraphs = sections.expérience.split('\n\n').filter(p => p.trim().length > 0);
                  
                  paragraphs.forEach(paragraph => {
                    const lines = paragraph.split('\n').filter(line => line.trim().length > 0);
                    
                    if (lines.length === 0) return;
                    
                    // Détecter si la première ligne peut être un titre
                    const firstLine = lines[0].trim();
                    let title = firstLine;
                    let company = '';
                    let date = '';
                    let responsibilities: string[] = [];
                    
                    // Chercher des indices de date
                    const dateMatch = paragraph.match(dateRegex);
                    if (dateMatch) {
                      date = dateMatch[0];
                    }
                    
                    // Chercher des indices de nom d'entreprise dans la première ligne
                    if (title.includes('|')) {
                      const parts = title.split('|').map(s => s.trim());
                      title = parts[0];
                      company = parts[1];
                    } else if (title.includes('chez') || title.includes('at')) {
                      const parts = title.split(/chez|at/i).map(s => s.trim());
                      title = parts[0];
                      company = parts[1] || '';
                    } else if (title.match(companyRegex)) {
                      company = title;
                      title = '';
                    }
                    
                    // Traiter le reste comme responsabilités
                    responsibilities = lines
                      .slice(title === firstLine ? 1 : 0)
                      .filter(line => !line.includes(date))
                      .map(line => line.replace(/^[*-]\s+/, '').trim())
                      .filter(line => line.trim().length > 0);
                    
                    // Si pas de responsabilités et que le titre est vide, utiliser la première ligne
                    if (responsibilities.length === 0 && !title) {
                      if (firstLine !== date) {
                        responsibilities.push(firstLine);
                      }
                    }
                    
                    experiences.push({
                      title: title || 'Poste',
                      company,
                      date,
                      responsibilities
                    });
                  });
                  
                  // Rendu des expériences
                  return (
                    <div className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-primary-200">
                      {experiences.map((exp, index) => (
                        <div key={index} className="mb-6">
                          <h3 className="font-bold text-lg">{exp.title}</h3>
                          <div className="flex flex-wrap items-center text-neutral-600 mb-2">
                            {exp.company && (
                              <>
                                <Briefcase size={16} className="mr-1 text-primary-600" />
                                <span className="font-medium">{exp.company}</span>
                              </>
                            )}
                            {exp.date && (
                              <>
                                {exp.company && <span className="mx-2">•</span>}
                                <Calendar size={16} className="mr-1 text-primary-600" />
                                <span>{exp.date}</span>
                              </>
                            )}
                          </div>
                          {exp.responsibilities.length > 0 && (
                            <ul className="space-y-1 mt-2">
                              {exp.responsibilities.map((item, i) => (
                                <li key={i} className="flex">
                                  <span className="mr-2">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()
              )}
            </div>
          </section>
        )}
        
        {/* Formation */}
        {sections.formation && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-primary-700 border-b-2 border-primary-200 pb-2 mb-3">
              {language === 'fr' ? 'Formation' : 'Education'}
            </h2>
            
            <div className="space-y-4 mt-3">
              {/* Vérifier si le format standard avec ### est utilisé */}
              {sections.formation.includes('###') ? (
                // Format standard
                sections.formation.split(/(?=###\s)/).filter(Boolean).map((edu, index) => {
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
                            <div key={`${index}-${i}`} className="flex items-start">
                              <GraduationCap size={18} className="mr-2 mt-1 text-primary-600 flex-shrink-0" />
                              <div>{cleanLine}</div>
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
                  
                  // Extract details and filter out contact info
                  const details = lines
                    .filter(line => !line.startsWith('###') && !line.match(/^\*.*\*$/))
                    .map(line => line.replace(/^[*-]\s+/, ''))
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
                    <div key={index} className="flex items-start">
                      <GraduationCap size={18} className="mr-2 mt-1 text-primary-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold">{degree}</h3>
                        {school && <p className="text-neutral-600">{school}</p>}
                        {dateLine && <p className="text-sm text-neutral-500">{dateLine}</p>}
                        {details.length > 0 && (
                          <ul className="mt-1 text-sm">
                            {details.map((detail, i) => (
                              <li key={i} className="flex">
                                <span className="mr-1">•</span>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                // Format non standard - analyse intelligente plus avancée
                <div>
                  {(() => {
                    // Analyser le texte pour identifier les formations
                    const formationText = sections.formation;
                    
                    // Définition d'un type pour une formation
                    interface Formation {
                      title: string;
                      school: string;
                      date: string;
                      details: string[];
                    }
                    
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
                      <div key={index} className="flex items-start mb-4">
                        <GraduationCap size={18} className="mr-2 mt-1 text-primary-600 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold">{formation.title}</h3>
                          {formation.school && <p className="text-neutral-600">{formation.school}</p>}
                          {formation.date && <p className="text-sm text-neutral-500">{formation.date}</p>}
                          {formation.details.length > 0 && (
                            <ul className="mt-1 text-sm">
                              {formation.details.map((detail, i) => (
                                <li key={i} className="flex">
                                  <span className="mr-1">•</span>
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>
          </section>
        )}
        
        {/* Compétences */}
        {sections.compétences && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-primary-700 border-b-2 border-primary-200 pb-2 mb-3">
              {language === 'fr' ? 'Compétences' : 'Skills'}
            </h2>
            
            <div className="mt-2 flex flex-wrap gap-2">
              {sections.compétences.split('\n').filter(Boolean).map((skill, index) => {
                // Removes list markers
                const cleanSkill = skill.replace(/^[*-]\s+/, '');
                if (!cleanSkill) return null;
                
                return (
                  <div key={index} className="bg-neutral-100 px-3 py-1 rounded-lg text-primary-800">
                    {cleanSkill}
                  </div>
                );
              })}
            </div>
          </section>
        )}
        
        {/* Langues */}
        {sections.langues && (
          <section>
            <h2 className="text-xl font-bold text-primary-700 border-b-2 border-primary-200 pb-2 mb-3">
              {language === 'fr' ? 'Langues' : 'Languages'}
            </h2>
            
            <div className="mt-3">
              <div className="flex flex-wrap gap-3">
                {sections.langues.split('\n').filter(Boolean).map((lang, index) => {
                  // Removes list markers and handles bold formatting
                  const cleanLang = lang.replace(/^[*-]\s+/, '');
                  // Format: **Français:** Natif
                  const match = cleanLang.match(/\*\*([^:]+):\*\*\s+(.*)/);
                  
                  if (match) {
                    const [, language, level] = match;
                    return (
                      <div key={index} className="flex items-center bg-neutral-100 px-3 py-2 rounded-full">
                        <LanguagesIcon size={16} className="mr-2 text-primary-600" />
                        <span className="font-medium">{language}:</span>
                        <span className="ml-1">{level}</span>
                      </div>
                    );
                  }
                  
                  return (
                    <div key={index} className="flex items-center bg-neutral-100 px-3 py-2 rounded-full">
                      <LanguagesIcon size={16} className="mr-2 text-primary-600" />
                      <span>{cleanLang}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ModernTemplate;