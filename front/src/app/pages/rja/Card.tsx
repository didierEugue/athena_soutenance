import { FC, useEffect, useState } from "react";
import { KTIcon } from "../../../_metronic/helpers";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Swal from "sweetalert2";
import { getRJAFichiers } from "../../../services/api";

type Props = {
  id: number;
  date: string;
  typeActivite: string;
  tacheFacturable: {
    code: string;
    nom: string;
  };
  ordreFabrication: {
    numero: string;
    nom: string;
    affaire?: {
      numero: string;
      nom: string;
    };
  };
  duree: string;
  statut: "Standby" | "Validé" | "Réfusé" | "Rejeté";
  validateur?: {
    prenoms: string;
    nom: string;
  } | string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

const Card: FC<Props> = ({
  id,
  date,
  typeActivite,
  tacheFacturable,
  ordreFabrication,
  duree,
  statut,
  validateur,
  onEdit,
  onDelete,
}) => {
  const formattedDate = format(new Date(date), "dd MMM yyyy 'à' HH:mm");
  const durationInHours = parseFloat(duree);
  const [fichiers, setFichiers] = useState<any[]>([]);

  // Vérification de sécurité pour les propriétés imbriquées
  const affaireInfo = ordreFabrication?.affaire ? (
    <>{ordreFabrication.affaire.nom}</>
  ) : (
    "Information non disponible"
  );

  const ofInfo = ordreFabrication ? (
    <>
      {ordreFabrication.numero} - {ordreFabrication.nom}
    </>
  ) : (
    "Information non disponible"
  );

  useEffect(() => {
    const loadFichiers = async () => {
      const files = await getRJAFichiers(id); // Utilisez l'id des props
      setFichiers(files);
    };
    loadFichiers();
  }, [id]);

  const handleDelete = () => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(id);
      }
    });
  };

  return (
    <div className="card border border-2 border-gray-300 border-hover">
      <div className="card-body p-9">
        <div className="d-flex justify-content-between align-items-start mb-5">
          <div>
            <div className="fs-3 fw-bold text-gray-900 mb-2">{affaireInfo}</div>
            <div className="fs-5 fw-semibold text-gray-600">{ofInfo}</div>
          </div>
          <span className={`badge badge-light-${getStatusColor(statut)} fs-7`}>
            {statut}
          </span>
        </div>

        <div className="mb-5">
          <div className="text-gray-800 mb-2">
            <span className="fw-bold">Type d'activité:</span> {typeActivite}
          </div>
          <div className="text-gray-800 mb-2">
            <span className="fw-bold">Tâche:</span>{" "}
            {tacheFacturable
              ? `${tacheFacturable.code} - ${tacheFacturable.nom}`
              : "Non spécifié"}
          </div>
          <div className="text-gray-800">
            <span className="fw-bold">Durée:</span> {durationInHours} heure(s)
          </div>
        </div>

        <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 mb-3">
          <div className="fs-6 text-gray-800 fw-bold">Du {formattedDate}</div>
        </div>

        {/* <div className="mt-2">
          <div className="fs-7 fw-bold text-gray-600 mb-2">Pièces jointes:</div>
          {fichiers.map((fichier, index) => (
            <span
              key={index}
              onClick={() => window.open(fichier.url, "_blank")}
              className={`badge ${
                fichier.mime_type.includes("image")
                  ? "badge-light-info"
                  : "badge-light-primary"
              } me-2 mb-1`}
              style={{ cursor: "pointer" }}
            >
              <KTIcon
                iconName={
                  fichier.mime_type.includes("image") ? "image" : "file-doc"
                }
                className="fs-6 me-1"
              />
              {fichier.nom}
            </span>
          ))}
        </div> */}
        <div className="mt-2">
          <div className="fs-7 fw-bold text-gray-600 mb-2">Pièces jointes:</div>
          {fichiers.length > 0 ? (
            fichiers.map((fichier, index) => (
              <span
                key={index}
                onClick={() => window.open(fichier.url, "_blank")}
                className={`badge ${
                  fichier.mime_type.includes("image")
                    ? "badge-light-info"
                    : "badge-light-primary"
                } me-2 mb-1`}
                style={{ cursor: "pointer" }}
              >
                <KTIcon
                  iconName={
                    fichier.mime_type.includes("image") ? "image" : "file-doc"
                  }
                  className="fs-6 me-1"
                />
                {fichier.nom}
              </span>
            ))
          ) : (
            <span className="badge badge-light-secondary">Aucun fichier</span>
          )}
        </div>

        <div className="d-flex justify-content-end mt-5">
          {statut === "Standby" ? (
            <div className="d-flex justify-content-end mt-5">
              <button
                className="btn btn-icon btn-light-primary btn-sm me-2"
                onClick={() => onEdit(id)}
              >
                <KTIcon iconName="pencil" className="fs-2" />
              </button>
              <button
                className="btn btn-icon btn-light-danger btn-sm"
                onClick={handleDelete}
              >
                <KTIcon iconName="trash" className="fs-2" />
              </button>
            </div>
          ) : (
            <div className="text-end mt-5 text-gray-600 fs-7">
              {statut} par :{" "}
              <b>
                {(validateur as any)?.prenoms} {(validateur as any)?.nom}
              </b>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (statut: string) => {
  switch (statut) {
    case "Standby":
      return "warning";
    case "Validé":
      return "info";
    case "Réfusé":
      return "danger";
    default:
      return "primary";
  }
};

export { Card };
