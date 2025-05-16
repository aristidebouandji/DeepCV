# Étape 1 : Installer les dépendances et builder l'application
FROM node:18

# Créer un dossier de travail dans le container
WORKDIR /app

# Copier les fichiers de projet
COPY package.json package-lock.json* ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Exposer le port 80
EXPOSE 80

# Lancer le serveur de développement Vite
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "80"]
