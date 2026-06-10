const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const multer = require("multer");
// const ofFichierRoutes = require("./routes/ofFichierRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
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
