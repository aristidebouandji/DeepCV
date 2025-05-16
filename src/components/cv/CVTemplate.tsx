import React, { useState, useEffect, useCallback } from 'react';
import { Template, Language } from '../../context/CVContext';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import CreativeTemplate from './templates/CreativeTemplate';

interface CVTemplateProps {
  template: Template;
  content: string;
  language: Language;
  customTheme?: Partial<ThemeOptions>;
}

// Liste des noms de sections standardisés
export const SECTION_NAMES = {
  TITLE: 'title',
  PROFILE: 'profil',
  EXPERIENCE: 'expérience',
  EDUCATION: 'formation',
  SKILLS: 'compétences',
  LANGUAGES: 'langues',
  CONTACT: 'contact',
  PROJECTS: 'projets',
  INTERESTS: 'intérêts',
  CERTIFICATIONS: 'certifications',
  ACHIEVEMENTS: 'réalisations',
  REFERENCES: 'références'
};

// Aliases pour les noms de sections (pour gérer différentes façons d'écrire)
export const SECTION_ALIASES = {
  [SECTION_NAMES.PROFILE]: ['profil', 'profile', 'présentation', 'about', 'à propos', 'résumé', 'resume', 'summary', 'introduction', 'bio', 'biographie'],
  [SECTION_NAMES.EXPERIENCE]: ['expérience', 'experiences', 'expériences', 'experience', 'parcours professionnel', 'expérience professionnelle', 'professional experience', 'work experience', 'emplois', 'jobs', 'career', 'carrière'],
  [SECTION_NAMES.EDUCATION]: ['formation', 'education', 'éducation', 'formations', 'études', 'etudes', 'parcours académique', 'academic background', 'scolarité', 'diplômes', 'qualifications', 'cursus'],
  [SECTION_NAMES.SKILLS]: ['compétences', 'competences', 'skills', 'compétence', 'competence', 'savoir-faire', 'technologies', 'expertises', 'technical skills', 'compétences techniques', 'outils', 'tools', 'technologies'],
  [SECTION_NAMES.LANGUAGES]: ['langues', 'languages', 'langue', 'language', 'compétences linguistiques', 'language skills', 'idiomas', 'foreign languages'],
  [SECTION_NAMES.CONTACT]: ['contact', 'coordonnées', 'informations personnelles', 'informations de contact', 'personal information', 'contact details', 'contact info', 'coordinates'],
  [SECTION_NAMES.PROJECTS]: ['projets', 'projects', 'réalisations', 'portfolio', 'work', 'travaux', 'projets personnels', 'side projects', 'projets significatifs', 'significant projects'],
  [SECTION_NAMES.INTERESTS]: ['intérêts', 'interests', 'loisirs', 'hobbies', 'centres d\'intérêt', 'activités', 'extracurricular', 'périscolaire', 'passions', 'passetemps'],
  [SECTION_NAMES.CERTIFICATIONS]: ['certifications', 'certificates', 'diplômes', 'qualifications', 'accréditations', 'certifications professionnelles', 'professional certifications', 'licences'],
  [SECTION_NAMES.ACHIEVEMENTS]: ['réalisations', 'achievements', 'accomplishments', 'succès', 'distinctions', 'prix', 'awards', 'recognitions', 'reconnaissances', 'honors', 'honours'],
  [SECTION_NAMES.REFERENCES]: ['références', 'references', 'recommandations', 'témoignages', 'testimonials', 'recommendation']
};

// Informations de contact par défaut
export const DEFAULT_CONTACT = {
  name: 'Prénom Nom',
  email: 'email@example.com',
  phone: '+33 6 12 34 56 78',
  location: 'Paris, France',
  linkedin: 'linkedin.com/in/example',
  website: '',
  github: '',
  twitter: ''
};

// Fonction pour extraire des informations de contact d'un texte
export const extractContactInfo = (content: string) => {
  const contact = { ...DEFAULT_CONTACT };
  
  // Rechercher un email
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
  const emailMatch = content.match(emailRegex);
  if (emailMatch) {
    contact.email = emailMatch[0];
  }
  
  // Rechercher un numéro de téléphone (formats variés)
  const phoneRegex = /\b(?:\+\d{1,3}[-.\s]?)?(?:\(?\d{1,4}\)?[-.\s]?)?(?:\d{1,4}[-.\s]?){1,3}\d{1,4}\b/;
  const phoneMatch = content.match(phoneRegex);
  if (phoneMatch) {
    contact.phone = phoneMatch[0];
  }
  
  // Rechercher un nom (plus complexe, essayer de trouver en début de document ou après "CV de")
  const nameRegex = /(?:^|\n)(?:CV\s+(?:de|of|pour|for)\s+)?([A-ZÀ-Ú][a-zà-ú]+(?:\s+[A-ZÀ-Ú][a-zà-ú]+){1,3})/;
  const nameMatch = content.match(nameRegex) || content.match(/^#\s*([\w\s]+)/m);
  if (nameMatch && nameMatch[1]) {
    contact.name = nameMatch[1].trim();
  }
  
  // Rechercher une ville ou pays
  const locationRegex = /\b(?:à|in|de|from)\s+([A-ZÀ-Ú][a-zà-ú]+(?:[,-]\s+[A-ZÀ-Ú][a-zà-ú]+)?(?:[,-]\s+\d{5})?)\b|(?:^|\n)(?:Adresse|Address|Location)[:.\s]+([^,\n]+(?:,\s*[^,\n]+)*)/i;
  const locationMatch = content.match(locationRegex);
  if (locationMatch && (locationMatch[1] || locationMatch[2])) {
    contact.location = (locationMatch[1] || locationMatch[2]).trim();
  }
  
  // Rechercher un profil LinkedIn ou autre réseau social
  const linkedinRegex = /(?:linkedin\.com\/in\/|\/in\/)([a-zA-Z0-9_-]+)/i;
  const linkedinMatch = content.match(linkedinRegex);
  if (linkedinMatch) {
    if (linkedinMatch[0].includes('linkedin.com')) {
      contact.linkedin = linkedinMatch[0];
    } else if (linkedinMatch[0].includes('/in/')) {
      contact.linkedin = `linkedin.com${linkedinMatch[0]}`;
    } else {
      contact.linkedin = `linkedin.com/in/${linkedinMatch[1]}`;
    }
  }
  
  // Rechercher un site web personnel
  const websiteRegex = /(?:site(?:\s+web)?|website|portfolio|blog)[:.\s]+(https?:\/\/[^\s,]+)/i;
  const websiteMatch = content.match(websiteRegex) || content.match(/https?:\/\/(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/i);
  if (websiteMatch && websiteMatch[1] && !websiteMatch[1].includes('linkedin.com')) {
    contact.website = websiteMatch[1];
  }
  
  // Rechercher un profil GitHub
  const githubRegex = /github\.com\/([a-zA-Z0-9_-]+)/i;
  const githubMatch = content.match(githubRegex);
  if (githubMatch) {
    contact.github = githubMatch[0];
  }
  
  // Rechercher un profil Twitter
  const twitterRegex = /twitter\.com\/([a-zA-Z0-9_-]+)/i;
  const twitterMatch = content.match(twitterRegex);
  if (twitterMatch) {
    contact.twitter = twitterMatch[0];
  }
  
  return contact;
};

// Types du thème pour personnalisation
export interface ThemeOptions {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: string;
  spacing: string;
  borderRadius: string;
  accentColor: string;
  enableHeaderImage: boolean;
  dateFormat: string;
}

// Thèmes prédéfinis
export const THEMES = {
  default: {
    primaryColor: 'primary',
    secondaryColor: 'neutral',
    fontFamily: 'sans',
    fontSize: 'base',
    spacing: 'normal',
    borderRadius: 'md',
    accentColor: 'primary',
    enableHeaderImage: false,
    dateFormat: 'MMM YYYY'
  },
  classic: {
    primaryColor: 'neutral',
    secondaryColor: 'slate',
    fontFamily: 'serif',
    fontSize: 'base',
    spacing: 'comfortable',
    borderRadius: 'sm',
    accentColor: 'gray',
    enableHeaderImage: false,
    dateFormat: 'MMMM YYYY'
  },
  modern: {
    primaryColor: 'primary',
    secondaryColor: 'neutral',
    fontFamily: 'sans',
    fontSize: 'base',
    spacing: 'normal',
    borderRadius: 'lg',
    accentColor: 'sky',
    enableHeaderImage: true,
    dateFormat: 'MM/YYYY'
  },
  minimal: {
    primaryColor: 'neutral',
    secondaryColor: 'neutral',
    fontFamily: 'sans',
    fontSize: 'sm',
    spacing: 'compact',
    borderRadius: 'none',
    accentColor: 'gray',
    enableHeaderImage: false,
    dateFormat: 'YYYY'
  },
  creative: {
    primaryColor: 'accent',
    secondaryColor: 'neutral',
    fontFamily: 'sans',
    fontSize: 'base',
    spacing: 'loose',
    borderRadius: 'full',
    accentColor: 'violet',
    enableHeaderImage: true,
    dateFormat: 'MMM YYYY'
  }
};

// Fonction pour normaliser le texte (suppression des accents, mise en minuscule)
const normalizeText = (text: string): string => {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const CVTemplate: React.FC<CVTemplateProps> = ({ template, content, language, customTheme = {} }) => {
  const [parsedContent, setParsedContent] = useState<Record<string, string>>({});
  const [themeOptions, setThemeOptions] = useState<ThemeOptions>(THEMES[template] || THEMES.default);
  
  // Effet pour analyser le contenu lorsqu'il change
  useEffect(() => {
    if (content) {
      const parsed = parseMarkdown(content);
      setParsedContent(parsed);
    }
  }, [content]);
  
  // Effet pour mettre à jour les options de thème lorsque le template change
  useEffect(() => {
    const baseTheme = THEMES[template] || THEMES.default;
    // Fusionner avec les options personnalisées si présentes
    setThemeOptions({
      ...baseTheme,
      ...customTheme
    });
  }, [template, customTheme]);
  
  // Fonction optimisée pour vérifier la correspondance entre un nom de section et les alias
  const matchSectionAlias = useCallback((sectionName: string, aliases: string[]): boolean => {
    const normalizedSectionName = normalizeText(sectionName);
    
    return aliases.some(alias => {
      const normalizedAlias = normalizeText(alias);
      return normalizedSectionName.includes(normalizedAlias) || normalizedAlias.includes(normalizedSectionName);
    });
  }, []);
  
  // Parse the markdown content
  const parseMarkdown = (markdown: string) => {
    console.log("Parsing markdown content, length:", markdown.length);
    
    // This is a simplified markdown parser
    // In a production app, you'd use a proper markdown library
    
    const sections: Record<string, string> = {};
    let currentSection = SECTION_NAMES.PROFILE;
    
    // Garantir que markdown est une chaîne
    if (!markdown || typeof markdown !== 'string') {
      console.error("Le contenu du CV n'est pas une chaîne valide:", markdown);
      return createDefaultSections();
    }
    
    const lines = markdown.split('\n');
    console.log("Nombre de lignes:", lines.length);
    
    // Détecter les séparations de sections
    let previousLineEmpty = true;
    let inCodeBlock = false;
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Gérer les blocs de code (ignorés pour l'analyse des sections)
      if (trimmedLine.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        if (currentSection) {
          sections[currentSection] += line + '\n';
        }
        return;
      }
      
      if (inCodeBlock) {
        if (currentSection) {
          sections[currentSection] += line + '\n';
        }
        return;
      }
      
      // Check for headers
      if (line.startsWith('# ')) {
        console.log(`Titre principal trouvé ligne ${index}: ${line}`);
        currentSection = SECTION_NAMES.TITLE;
        sections[currentSection] = line.replace('# ', '');
      } else if (line.startsWith('## ')) {
        const sectionName = line.replace('## ', '').toLowerCase();
        console.log(`Section trouvée ligne ${index}: ${sectionName}`);
        
        // Identifier la section standardisée correspondante
        let standardSectionFound = false;
        
        for (const [standardSection, aliases] of Object.entries(SECTION_ALIASES)) {
          if (matchSectionAlias(sectionName, aliases)) {
            currentSection = standardSection;
            standardSectionFound = true;
            console.log(`Section standardisée: ${sectionName} -> ${standardSection}`);
            
            // Initialiser la section si elle n'existe pas encore
            if (!sections[currentSection]) {
              sections[currentSection] = '';
            }
            break;
          }
        }
        
        if (!standardSectionFound) {
          console.log(`Section non standardisée: ${sectionName}, utilisation comme is`);
          currentSection = sectionName;
          sections[currentSection] = '';
        }
      } 
      // Détecter les lignes vides consécutives qui pourraient indiquer un changement de section
      else if (trimmedLine === '') {
        previousLineEmpty = true;
        if (currentSection) {
          sections[currentSection] += line + '\n';
        }
      } 
      // Détecter les titres sans marqueurs (lignes en majuscules suivant une ligne vide)
      else if (previousLineEmpty && 
               (trimmedLine === trimmedLine.toUpperCase() || 
                /^[A-ZÀ-Ú\s]+$/.test(trimmedLine)) && 
               trimmedLine.length > 3 && 
               !/^\d+\./.test(trimmedLine)) {
        
        const potentialSectionName = trimmedLine.toLowerCase();
        let standardSectionFound = false;
        
        for (const [standardSection, aliases] of Object.entries(SECTION_ALIASES)) {
          if (matchSectionAlias(potentialSectionName, aliases)) {
            currentSection = standardSection;
            standardSectionFound = true;
            console.log(`Section inférée: ${potentialSectionName} -> ${standardSection}`);
            
            if (!sections[currentSection]) {
        sections[currentSection] = '';
            }
            sections[currentSection] += line + '\n';
            break;
          }
        }
        
        if (!standardSectionFound) {
          if (currentSection) {
            sections[currentSection] += line + '\n';
          }
        }
        
        previousLineEmpty = false;
      } else {
        previousLineEmpty = false;
        if (currentSection) {
        sections[currentSection] += line + '\n';
        }
      }
    });
    
    // S'assurer que toutes les sections essentielles existent
    const essentialSections = [
      SECTION_NAMES.PROFILE, 
      SECTION_NAMES.EXPERIENCE, 
      SECTION_NAMES.EDUCATION, 
      SECTION_NAMES.SKILLS, 
      SECTION_NAMES.LANGUAGES
    ];
    
    essentialSections.forEach(section => {
      if (!sections[section]) {
        console.log(`Section ${section} non trouvée, création d'une section vide`);
        sections[section] = '';
      }
    });
    
    // S'assurer que le titre existe
    if (!sections[SECTION_NAMES.TITLE]) {
      sections[SECTION_NAMES.TITLE] = 'CV Optimisé';
    }
    
    // Extraire les informations de contact
    const contactInfo = extractContactInfo(markdown);
    sections[SECTION_NAMES.CONTACT] = JSON.stringify(contactInfo);
    
    // Vérifier les sections analysées
    console.log("Sections analysées:", Object.keys(sections));
    
    // Créer des copies des sections standardisées pour la compatibilité avec les anciens templates
    // Cela garantit que les templates fonctionneront qu'ils utilisent "expérience" ou "expérience professionnelle"
    Object.entries(SECTION_ALIASES).forEach(([standardName, aliases]) => {
      if (sections[standardName]) {
        aliases.forEach(alias => {
          if (alias !== standardName) {
            sections[alias] = sections[standardName];
          }
        });
      }
    });
    
    return sections;
  };
  
  // Créer un ensemble de sections par défaut
  const createDefaultSections = () => {
    return {
      [SECTION_NAMES.TITLE]: "CV Optimisé",
      [SECTION_NAMES.PROFILE]: "Aucun contenu disponible.",
      [SECTION_NAMES.EXPERIENCE]: "",
      [SECTION_NAMES.EDUCATION]: "",
      [SECTION_NAMES.SKILLS]: "",
      [SECTION_NAMES.LANGUAGES]: "",
      [SECTION_NAMES.CONTACT]: JSON.stringify(DEFAULT_CONTACT)
    };
  };
  
  console.log("Rendu du template", template, "avec contenu de longueur", content?.length || 0);
  
  // Assurer que nous avons toujours un contenu valide à analyser
  if (!content || content.trim() === '') {
    console.error("Contenu du CV manquant ou vide. Cela devrait être géré en amont par l'API.");
    // Ne pas réinitialiser parsedContent si déjà défini
    if (Object.keys(parsedContent).length === 0) {
      setParsedContent(createDefaultSections());
    }
  }
  
  // Render the selected template with theme options
  const renderTemplate = () => {
    const props = {
      sections: parsedContent,
      language,
      theme: themeOptions
    };
    
  switch (template) {
    case 'modern':
        return <ModernTemplate {...props} />;
    case 'classic':
        return <ClassicTemplate {...props} />;
    case 'minimal':
        return <MinimalTemplate {...props} />;
    case 'creative':
        return <CreativeTemplate {...props} />;
    default:
        return <ModernTemplate {...props} />;
    }
  };
  
  // Vérifier si nous avons les sections nécessaires pour rendre le template
  if (Object.keys(parsedContent).length === 0) {
    return (
      <div className="p-4 text-center">
        <div role="status" aria-label="Chargement du CV" className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-6"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="col-span-2 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return renderTemplate();
};

export default CVTemplate;