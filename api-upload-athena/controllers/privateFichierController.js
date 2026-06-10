const fs = require("fs").promises;
const PrivateFichier = require("../models/PrivateFichier");
const db = require("../config/database");

const uploadPrivateFichiers = async (req, res) => {
  try {
    console.log("Files received:", req.files);
    console.log("Message ID received:", req.body.messageId);

    if (!req.files || req.files.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Aucun fichier à uploader",
        data: [],
      });
    }

    const messageId = parseInt(req.body.messageId, 10);
    if (!messageId) {
      throw new Error("ID Message manquant ou invalide");
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      const fichierData = {
        nom: file.originalname,
        chemin: file.filename,
        mime_type: file.mimetype,
        message_id: messageId,
      };

      const result = await PrivateFichier.create(fichierData);
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
    console.error("Erreur upload fichiers privés:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'upload des fichiers",
      error: error.message,
    });
  }
};

const getFichiers = async (req, res) => {
  try {
    const [fichiers] = await db.query(
      "SELECT * FROM fichiers WHERE message_id = ?",
      [req.params.id]
    );
    res.json({ "hydra:member": fichiers });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des fichiers",
    });
  }
};

module.exports = {
  uploadPrivateFichiers,
  getFichiers,
};
