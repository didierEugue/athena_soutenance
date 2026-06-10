const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const {
  uploadFichier,
  getFichierUtilisateur,
} = require("../controllers/fichierController");

router.post("/upload", upload.single("fichier"), uploadFichier);
router.get("/avatar/:utilisateurId", getFichierUtilisateur);

module.exports = router;
