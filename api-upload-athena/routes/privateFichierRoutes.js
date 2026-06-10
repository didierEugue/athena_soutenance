const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const {
  uploadPrivateFichiers,
  getFichiers,
} = require("../controllers/privateFichierController");

router.post("/private-upload", upload.array("fichiers"), uploadPrivateFichiers);
router.get("/messages/:id/fichiers", getFichiers);

module.exports = router;
