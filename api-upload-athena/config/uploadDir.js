// Emplacement des fichiers televerses, partage entre le middleware multer
// (ecriture) et express.static (lecture).
//
// Par defaut `<projet>/uploads`, ce qui reproduit le comportement d'origine en
// developpement. En production, UPLOAD_DIR pointe sur un volume Docker : sans
// ca, les fichiers vivraient dans la couche du conteneur et disparaitraient a
// chaque redeploiement.
const path = require("path");
const fs = require("fs");

const UPLOAD_DIR = path.resolve(
  process.env.UPLOAD_DIR || path.join(__dirname, "..", "uploads")
);

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

module.exports = { UPLOAD_DIR };
