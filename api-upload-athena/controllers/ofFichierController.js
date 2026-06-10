// const fs = require("fs").promises;
// const OFFichier = require("../models/OFFichier");
// const db = require("../config/database");

// const uploadOFFichiers = async (req, res) => {
//   try {
//     console.log("Files received:", req.files);
//     console.log("OF ID received:", req.body.ofId);

//     if (!req.files || req.files.length === 0) {
//       return res.status(200).json({
//         success: true,
//         message: "Aucun fichier à uploader",
//         data: [],
//       });
//     }

//     const ofId = parseInt(req.body.ofId, 10);
//     if (!ofId) {
//       throw new Error("ID OF manquant ou invalide");
//     }

//     const uploadedFiles = [];

//     for (const file of req.files) {
//       const fichierData = {
//         nom: file.originalname,
//         chemin: file.filename,
//         mime_type: file.mimetype,
//         ofab_id: ofId,
//         // mimeType: file.mimetype,
//         // ofId: ofId,
//       };

//       const result = await OFFichier.create(fichierData);
//       console.log("Fichier créé:", result);

//       //   uploadedFiles.push({
//       //     id: result.insertId,
//       //     ...fichierData,
//       //     url: `${req.protocol}://${req.get("host")}/uploads/${
//       //       fichierData.chemin
//       //     }`,
//       //   });
//       uploadedFiles.push({
//         id: result.insertId,
//         ...fichierData,
//         url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
//       });
//     }

//     res.status(201).json({
//       success: true,
//       message: "Fichiers uploadés avec succès",
//       data: uploadedFiles,
//     });
//   } catch (error) {
//     console.error("Erreur upload OF fichiers:", error);
//     res.status(500).json({
//       success: false,
//       message: "Erreur lors de l'upload des fichiers",
//       error: error.message,
//     });
//   }
// };

// router.get("/ordre_fabrications/:id/fichiers", async (req, res) => {
//   try {
//     console.log("Recherche fichiers pour OF:", req.params.id);
//     const [fichiers] = await db.query(
//       "SELECT * FROM fichiers WHERE ofab_id = ?",
//       [req.params.id]
//     );
//     console.log("Fichiers trouvés:", fichiers);
//     res.json({ "hydra:member": fichiers });
//   } catch (error) {
//     console.error("Erreur SQL:", error);
//     res.status(500).json({
//       success: false,
//       message: "Erreur lors de la récupération des fichiers",
//     });
//   }
// });

// const getFichiers = async (req, res) => {
//   try {
//     const [fichiers] = await db.query(
//       "SELECT * FROM fichiers WHERE ofab_id = ?",
//       [req.params.id]
//     );
//     res.json({ "hydra:member": fichiers });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Erreur lors de la récupération des fichiers",
//     });
//   }
// };

// module.exports = {
//   uploadOFFichiers,
//   getFichiers,
// };

const fs = require("fs").promises;
const OFFichier = require("../models/OFFichier");
const db = require("../config/database");

const uploadOFFichiers = async (req, res) => {
  try {
    console.log("Files received:", req.files);
    console.log("OF ID received:", req.body.ofId);

    if (!req.files || req.files.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Aucun fichier à uploader",
        data: [],
      });
    }

    const ofId = parseInt(req.body.ofId, 10);
    if (!ofId) {
      throw new Error("ID OF manquant ou invalide");
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      const fichierData = {
        nom: file.originalname,
        chemin: file.filename,
        mime_type: file.mimetype,
        ofab_id: ofId,
      };

      const result = await OFFichier.create(fichierData);
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
    console.error("Erreur upload OF fichiers:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'upload des fichiers",
      error: error.message,
    });
  }
};

const getFichiers = async (req, res) => {
  try {
    console.log("Recherche fichiers pour OF:", req.params.id);
    const [fichiers] = await db.query(
      "SELECT id, nom, chemin, mime_type, created_at FROM fichiers WHERE ofab_id = ?",
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
  uploadOFFichiers,
  getFichiers,
};
