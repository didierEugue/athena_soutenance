// messageFichierController.js
const fs = require("fs").promises;
const MessageFichier = require("../models/MessageFichier");
const db = require("../config/database");

const uploadMessageFichiers = async (req, res) => {
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
        mg_id: messageId,
      };

      const result = await MessageFichier.create(fichierData);
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
    console.error("Erreur upload message fichiers:", error);
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
      "SELECT id, nom, chemin, mime_type, created_at FROM fichiers WHERE mg_id = ?",
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
  uploadMessageFichiers,
  getFichiers,
};
