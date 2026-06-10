import React, { useState, useEffect } from "react";
import { PageTitle } from "../../../_metronic/layout/core";
import { useAuth } from "../../modules/auth";
import {
  getTacheParActivites,
  updateTacheParActivite,
  TacheParActivite,
  getRJAFichiers,
} from "../../../services/api";
import Swal from "sweetalert2";
import { KTIcon } from "../../../_metronic/helpers";

const usersBreadcrumbs = [
  {
    title: "Validation des Rapports d'Activité",
    path: "/app/pages/rja/validate",
    isSeparator: false,
    isActive: false,
  },
  {
    title: "",
    path: "",
    isSeparator: true,
    isActive: false,
  },
];

export function RJAValidate() {
  const { currentUser } = useAuth();
  const [rapports, setRapports] = useState<TacheParActivite[]>([]);
  const [rapportFichiers, setRapportFichiers] = useState<{
    [key: number]: any[];
  }>({});

  const fetchRapports = async () => {
    try {
      const data = await getTacheParActivites();
      setRapports(data.filter((rapport: any) => rapport.statut === "Standby"));
    } catch (error) {
      console.error("Erreur lors du chargement des rapports:", error);
      Swal.fire({
        title: "Erreur!",
        text: "Impossible de charger les rapports",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    fetchRapports();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTacheParActivites();
        const filteredRapports = data.filter(
          (rapport: any) => rapport.statut === "Standby"
        );
        setRapports(filteredRapports);

        // Chargement des fichiers pour chaque rapport
        for (const rapport of filteredRapports) {
          if (rapport.id) {
            const fichiers = await getRJAFichiers(rapport.id);
            setRapportFichiers((prev) => ({
              ...prev,
              [rapport.id!]: fichiers,
            }));
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        Swal.fire({
          title: "Erreur!",
          text: "Impossible de charger les rapports",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    fetchData();
  }, []);

  const handleStatusUpdate = async (
    id: number,
    newStatus: "Validé" | "Réfusé"
  ) => {
    if (!currentUser?.id) {
      Swal.fire({
        title: "Erreur!",
        text: "Utilisateur non identifié",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      await updateTacheParActivite(id, {
        statut: newStatus,
        validateur: `/api/utilisateurs/${currentUser.id}`,
      });

      await fetchRapports();

      Swal.fire({
        title: "Succès!",
        text: `Le rapport a été ${newStatus.toLowerCase()} avec succès`,
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: "Erreur!",
        text: `Impossible de ${newStatus.toLowerCase()} le rapport`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const ValidateButtons: React.FC<{ id: number }> = ({ id }) => (
    <div className="d-flex justify-content-end mt-5">
      <button
        className="btn btn-icon btn-light-success btn-sm me-2"
        onClick={() => handleStatusUpdate(id, "Validé")}
      >
        <i className="bi bi-check-lg fs-2"></i>
      </button>
      <button
        className="btn btn-icon btn-light-danger btn-sm"
        onClick={() => handleStatusUpdate(id, "Réfusé")}
      >
        <i className="bi bi-x-lg fs-2"></i>
      </button>
    </div>
  );

  return (
    <>
      <PageTitle breadcrumbs={usersBreadcrumbs}>Validation des RJA</PageTitle>
      <div className="d-flex flex-wrap flex-stack mb-6">
        <h3 className="fw-bolder my-2">
          Rapports en attente de validation
          <span className="fs-6 text-gray-500 fw-bold ms-1">
            ({rapports.length})
          </span>
        </h3>
      </div>

      <div className="row g-6 g-xl-9">
        {rapports.map((rapport) => {
          const ordreFabrication =
            typeof rapport.ordre_fabrication === "string"
              ? null
              : rapport.ordre_fabrication;

          const tacheFacturable =
            typeof rapport.tache_facturable === "string"
              ? null
              : rapport.tache_facturable;

          return (
            <div className="col-md-6 col-xl-4" key={rapport.id}>
              <div className="card border border-2 border-gray-300 border-hover">
                <div className="card-body p-9">
                  <div className="d-flex justify-content-between align-items-start mb-5">
                    <div>
                      <div className="fs-3 fw-bold text-gray-900 mb-2">
                        {typeof ordreFabrication?.affaire === 'object' ? ordreFabrication?.affaire?.nom : ''}
                      </div>
                      <div className="fs-5 fw-semibold text-gray-600">
                        {ordreFabrication?.numero} - {ordreFabrication?.nom}
                      </div>
                    </div>
                    <span className="badge badge-light-warning fs-7">
                      {rapport.statut}
                    </span>
                  </div>

                  <div className="mb-5">
                    <div className="text-gray-800 mb-2">
                      <span className="fw-bold">Type d'activité:</span>{" "}
                      {rapport.type_activite}
                    </div>
                    <div className="text-gray-800 mb-2">
                      <span className="fw-bold">Tâche:</span>{" "}
                      {tacheFacturable
                        ? `${tacheFacturable.code} - ${tacheFacturable.nom}`
                        : "Non spécifié"}
                    </div>
                    <div className="text-gray-800">
                      <span className="fw-bold">Durée:</span> {rapport.duree}{" "}
                      heure(s)
                    </div>
                  </div>

                  <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 mb-3">
                    <div className="fs-6 text-gray-800 fw-bold">
                      Du{" "}
                      {new Date(rapport.date!).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  {/* {rapportFichiers[rapport.id!]?.length > 0 && (
                    <div className="mt-3">
                      <div className="fs-7 fw-bold text-gray-600 mb-2">
                        Pièces jointes:
                      </div>
                      <div className="d-flex flex-wrap gap-2">
                        {rapportFichiers[rapport.id!].map((fichier, index) => (
                          <span
                            key={index}
                            onClick={() =>
                              window.open(
                                `${import.meta.env.VITE_UPLOAD_URL}/uploads/${fichier.chemin}`,
                                "_blank"
                              )
                            }
                            className={`badge ${
                              fichier.mime_type.includes("image")
                                ? "badge-light-info"
                                : "badge-light-primary"
                            } d-inline-flex align-items-center gap-1 p-2`}
                            style={{ cursor: "pointer" }}
                          >
                            <KTIcon
                              iconName={
                                fichier.mime_type.includes("image")
                                  ? "image"
                                  : "file-doc"
                              }
                              className="fs-6"
                            />
                            {fichier.nom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )} */}
                  <div className="mt-3">
                    <div className="fs-7 fw-bold text-gray-600 mb-2">
                      Pièces jointes:
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {rapportFichiers[rapport.id!]?.length > 0 ? (
                        rapportFichiers[rapport.id!].map((fichier, index) => (
                          <span
                            key={index}
                            onClick={() =>
                              window.open(
                                `${import.meta.env.VITE_UPLOAD_URL}/uploads/${fichier.chemin}`,
                                "_blank"
                              )
                            }
                            className={`badge ${
                              fichier.mime_type.includes("image")
                                ? "badge-light-info"
                                : "badge-light-primary"
                            } d-inline-flex align-items-center gap-1 p-2`}
                            style={{ cursor: "pointer" }}
                          >
                            <KTIcon
                              iconName={
                                fichier.mime_type.includes("image")
                                  ? "image"
                                  : "file-doc"
                              }
                              className="fs-6"
                            />
                            {fichier.nom}
                          </span>
                        ))
                      ) : (
                        <span className="badge badge-light-secondary">
                          Aucun fichier
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-end mt-5 text-gray-600 fs-7">
                    Exécuté par :{" "}
                    <b>
                      {typeof rapport.executeur === 'object' ? `${rapport.executeur.prenoms} ${rapport.executeur.nom}` : ''}
                    </b>
                  </div>

                  <ValidateButtons id={rapport.id!} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default RJAValidate;
