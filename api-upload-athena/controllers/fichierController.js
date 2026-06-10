const Fichier = require("../models/Fichier");
const fs = require("fs").promises;

const uploadFichier = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Aucun fichier fourni",
      });
    }

    const utilisateurId = parseInt(req.body.utilisateurId, 10);
    console.log("ID utilisateur reçu:", utilisateurId);

    const fichierData = {
      nom: req.file.originalname,
      chemin: req.file.filename,
      mimeType: req.file.mimetype,
      utilisateurId: utilisateurId,
    };

    const result = await Fichier.create(fichierData);

    if (!result || !result.insertId) {
      await fs.unlink(req.file.path);
      throw new Error("Échec de l'insertion en base de données");
    }

    res.status(201).json({
      success: true,
      message: "Fichier uploadé avec succès",
      data: {
        id: result.insertId,
        ...fichierData,
        url: `${req.protocol}://${req.get("host")}/uploads/${
          fichierData.chemin
        }`,
      },
    });
  } catch (error) {
    console.error("Erreur upload:", error);
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'upload du fichier",
      error: error.message,
    });
  }
};

// const getFichierUtilisateur = async (req, res) => {
//   try {
//     const utilisateurId = parseInt(req.params.utilisateurId, 10);
//     const fichier = await Fichier.getByUtilisateurId(utilisateurId);

//     if (!fichier) {
//       return res.status(404).json({
//         success: false,
//         message: "Avatar non trouvé",
//       });
//     }

//     res.json({
//       success: true,
//       data: {
//         ...fichier,
//         url: `${req.protocol}://${req.get("host")}/uploads/${fichier.chemin}`,
//       },
//     });
//   } catch (error) {
//     console.error("Erreur récupération avatar:", error);
//     res.status(500).json({
//       success: false,
//       message: "Erreur lors de la récupération de l'avatar",
//     });
//   }
// };
const getFichierUtilisateur = async (req, res) => {
  try {
    const utilisateurId = parseInt(req.params.utilisateurId, 10);
    const fichier = await Fichier.getByUtilisateurId(utilisateurId);

    if (!fichier) {
      return res.status(404).json({
        success: false,
        message: "Avatar non trouvé",
      });
    }

    // Construction de l'URL complète
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
      fichier.chemin
    }`;

    res.json({
      success: true,
      data: {
        id: fichier.id,
        nom: fichier.nom,
        url: fileUrl,
      },
    });
  } catch (error) {
    console.error("Erreur récupération avatar:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'avatar",
    });
  }
};

module.exports = {
  uploadFichier,
  getFichierUtilisateur,
};
