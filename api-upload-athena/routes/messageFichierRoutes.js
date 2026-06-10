// messageFichierRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const {
  uploadMessageFichiers,
  getFichiers,
} = require("../controllers/messageFichierController");

router.post("/message-upload", upload.array("fichiers"), uploadMessageFichiers);
router.get("/message_groupes/:id/fichiers", getFichiers);

module.exports = router;
