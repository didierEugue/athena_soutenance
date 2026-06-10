// rjaFichierController.js
const fs = require("fs").promises;
const RJAFichier = require("../models/RJAFichier");
const db = require("../config/database");

const uploadRJAFichiers = async (req, res) => {
  try {
    console.log("Files received:", req.files);
    console.log("RJA ID received:", req.body.rjaId);

    if (!req.files || req.files.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Aucun fichier à uploader",
        data: [],
      });
    }

    const rjaId = parseInt(req.body.rjaId, 10);
    if (!rjaId) {
      throw new Error("ID RJA manquant ou invalide");
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      const fichierData = {
        nom: file.originalname,
        chemin: file.filename,
        mime_type: file.mimetype,
        rja_id: rjaId,
      };

      const result = await RJAFichier.create(fichierData);
      console.log("Fichier créé:", result);

      uploadedFiles.push({
        id: result.insertId,
        ...fichierData,
        url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
      });
    }

    res.status(201).json({
      success: true,
      message: "Fichiers uploadés avec succès",
      data: uploadedFiles,
    });
  } catch (error) {
    console.error("Erreur upload RJA fichiers:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'upload des fichiers",
      error: error.message,
    });
  }
};

const getFichiers = async (req, res) => {
  try {
    console.log("Recherche fichiers pour RJA:", req.params.id);
    const [fichiers] = await db.query(
      "SELECT id, nom, chemin, mime_type, created_at FROM fichiers WHERE rja_id = ?",
      [req.params.id]
    );
    console.log("Fichiers trouvés:", fichiers);
    res.json({ "hydra:member": fichiers });
  } catch (error) {
    console.error("Erreur SQL:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des fichiers",
    });
  }
};

module.exports = {
  uploadRJAFichiers,
  getFichiers,
};
