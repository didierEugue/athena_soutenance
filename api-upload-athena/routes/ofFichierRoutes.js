// const express = require("express");
// const router = express.Router();
// const upload = require("../middlewares/uploadMiddleware");
// const { uploadOFFichiers } = require("../controllers/ofFichierController");
// const db = require("../config/database");

// router.post("/of-upload", upload.array("fichiers"), uploadOFFichiers);
// router.get("/ordre_fabrications/:id/fichiers", getFichiers);

// // router.get("/ordre_fabrications/:id/fichiers", async (req, res) => {
// //   try {
// //     const [fichiers] = await db.query(
// //       "SELECT * FROM fichiers WHERE ofab_id = ?",
// //       [req.params.id]
// //     );
// //     res.json({ "hydra:member": fichiers });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: "Erreur lors de la récupération des fichiers",
// //     });
// //   }
// // });

// router.get("/ordre_fabrications/:id/fichiers", async (req, res) => {
//   try {
//     const [fichiers] = await db.query(
//       "SELECT id, nom, chemin, mime_type, created_at FROM fichiers WHERE ofab_id = ?",
//       [req.params.id]
//     );
//     res.json({ "hydra:member": fichiers });
//   } catch (error) {
//     console.error("Erreur SQL:", error);
//     res.status(500).json({
//       success: false,
//       message: "Erreur lors de la récupération des fichiers",
//     });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const {
  uploadOFFichiers,
  getFichiers,
} = require("../controllers/ofFichierController");
const db = require("../config/database");

// Route pour l'upload de fichiers
router.post("/of-upload", upload.array("fichiers"), uploadOFFichiers);

// Route pour récupérer les fichiers d'un OF
router.get("/ordre_fabrications/:id/fichiers", getFichiers);

module.exports = router;
