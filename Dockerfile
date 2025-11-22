# Utiliser l'image officielle Node.js
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de package
COPY package*.json ./

# Installer les dépendances
RUN npm install --production

# Copier tous les fichiers de l'application
COPY . .

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["node", "server.js"]