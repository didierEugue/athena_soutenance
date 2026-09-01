const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const multer = require("multer");
const { UPLOAD_DIR } = require("./config/uploadDir");
// const ofFichierRoutes = require("./routes/ofFichierRoutes");

const app = express();

// Derriere le Caddy d'entree : sans ca, req.protocol vaut toujours "http" et
// les URL renvoyees par les controleurs sortent en clair alors que le site est
// servi en HTTPS.
app.set("trust proxy", true);

// Middlewares
// CORS restreint au front en production. Sans CORS_ALLOW_ORIGIN (developpement),
// on garde le comportement permissif d'origine.
const allowedOrigins = (process.env.CORS_ALLOW_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
app.use(cors(allowedOrigins.length ? { origin: allowedOrigins } : {}));
app.use(express.json());
app.use("/uploads", express.static(UPLOAD_DIR));

// Sonde de sante du conteneur : ne touche pas la base, repond tant que le
// process Express est vivant.
app.get("/health", (req, res) => res.json({ status: "ok" }));
// app.use("/api", ofFichierRoutes);
// Ajouter cette ligne avec les autres routes

// Routes
app.use("/api", require("./routes/fichierRoutes"));
app.use("/api", require("./routes/ofFichierRoutes")); // Pour les fichiers OF
app.use("/api", require("./routes/rjaFichierRoutes"));
app.use("/api", require("./routes/messageFichierRoutes"));
app.use("/api", require("./routes/privateFichierRoutes"));

// Gestion des erreurs spécifiques
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: "Erreur d'upload : vérifiez que le champ s'appelle 'fichier'",
      error: err.message,
    });
  }

  console.error("Erreur serveur:", err);
  res.status(500).json({
    success: false,
    message: "Erreur serveur",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
