// rjaFichierRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const {
  uploadRJAFichiers,
  getFichiers,
} = require("../controllers/rjaFichierController");

router.post("/rja-upload", upload.array("fichiers"), uploadRJAFichiers);
router.get("/tache_par_activites/:id/fichiers", getFichiers);

module.exports = router;
