import React, { useState, useEffect } from "react";
import { KTIcon } from "../../../../_metronic/helpers";
import { ValidateBtn } from "./ValidateBtn";
import { ListLoading } from "./ListLoading";
import { getAffaires, getOFFichiers } from "../../../../services/api";
import { useAuth } from "../../../modules/auth";

const FormTable: React.FC = () => {
  const [affaires, setAffaires] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ofFichiers, setOfFichiers] = useState<{ [key: number]: any[] }>({});
  const { currentUser } = useAuth();

  const hasValidationAccess = () => {
    return currentUser?.role?.code === "RP";
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await getAffaires();
      // Filtrer uniquement les affaires en cours
      const affairesEnCours = response.filter(
        (affaire: any) => affaire.statut === "en_cours"
      );

      for (const affaire of affairesEnCours) {
        for (const of of affaire.ordreFabrications) {
          if (of.id) {
            const fichiers = await getOFFichiers(of.id);
            setOfFichiers((prev) => ({
              ...prev,
              [of.id]: fichiers,
            }));
          }
        }
      }

      setAffaires(affairesEnCours);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const calculateProgress = (ordreFabrications: any[]) => {
    if (!ordreFabrications.length) return 0;
    const completedOFs = ordreFabrications.filter(
      (of) => of.statut === "terminé"
    ).length;
    return Math.round((completedOFs / ordreFabrications.length) * 100);
  };

  const isImageFile = (mimeType: string) => {
    return ["image/jpeg", "image/png", "image/jpg"].includes(mimeType);
  };

  const handleFileClick = (fichier: any) => {
    const fileUrl = `${import.meta.env.VITE_UPLOAD_URL}/uploads/${
      fichier.chemin
    }`;

    if (isImageFile(fichier.mime_type)) {
      window.open(fileUrl, "_blank");
    } else {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fichier.nom;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const areAllOFsCompleted = (ordreFabrications: any[]) => {
    return ordreFabrications.every((of) => of.statut === "terminé");
  };

  return (
    <div className="card">
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">
            Ordres de Fabrication
          </span>
          <span className="text-muted mt-1 fw-semibold fs-7">
            Suivi des ordres de fabrication par affaire
          </span>
        </h3>
      </div>

      <div className="card-body py-3">
        <div className="table-responsive">
          <table className="table align-middle gs-0 gy-4">
            <thead>
              <tr className="fw-bold text-muted bg-light">
                <th className="ps-4 min-w-200px rounded-start">Affaire</th>
                <th className="min-w-100px">Progression</th>
                <th className="min-w-200px">Ordre de fabrication</th>
                <th className="min-w-100px">Fichiers</th>
                {/* <th className="min-w-100px text-center">Actions</th>
                <th className="min-w-50px text-center rounded-end">Valider</th> */}
                {hasValidationAccess() && (
                  <>
                    <th className="min-w-100px text-center">Actions</th>
                    <th className="min-w-50px text-center rounded-end">
                      Valider
                    </th>
                  </>
                )}
              </tr>
            </thead>

            {/* <tbody>
              {affaires.map((affaire, affaireIndex) => {
                const progress = calculateProgress(affaire.ordreFabrications);
                const allOFsCompleted = areAllOFsCompleted(
                  affaire.ordreFabrications
                );
                const rowCount = affaire.ordreFabrications.length;

                return (
                  <React.Fragment key={affaire.id}>
                    {affaire.ordreFabrications.map(
                      (of: any, ofIndex: number) => (
                        <tr key={of.id}>
                          {ofIndex === 0 && (
                            <>
                              <td rowSpan={rowCount}>
                                <div className="d-flex align-items-center">
                                  <div className="d-flex justify-content-start flex-column">
                                    <span className="text-gray-900 fw-bold text-hover-primary mb-1 fs-6">
                                      {affaire.numero}
                                    </span>
                                    <span className="text-muted fw-semibold text-muted d-block fs-7">
                                      {affaire.nom}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td rowSpan={rowCount}>
                                <div className="d-flex align-items-center">
                                  <div className="progress w-100px h-20px">
                                    <div
                                      className="progress-bar bg-primary"
                                      role="progressbar"
                                      style={{ width: `${progress}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-muted fw-semibold text-muted ms-3">
                                    {progress}%
                                  </span>
                                </div>
                              </td>
                            </>
                          )}

                          <td className="py-3 px-6">
                            <span className="text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6">
                              {of.nom}
                            </span>
                          </td>

                          <td>
                            <div className="d-flex flex-wrap gap-2">
                              {ofFichiers[of.id]?.map(
                                (fichier: any, index: number) => (
                                  <span
                                    key={index}
                                    onClick={() => handleFileClick(fichier)}
                                    className={`badge ${
                                      isImageFile(fichier.mime_type)
                                        ? "badge-light-info"
                                        : "badge-light-primary"
                                    } d-inline-flex align-items-center gap-1 p-2`}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <KTIcon
                                      iconName={
                                        isImageFile(fichier.mime_type)
                                          ? "image"
                                          : "file-doc"
                                      }
                                      className="fs-6"
                                    />
                                    {fichier.nom}
                                    <KTIcon
                                      iconName={
                                        isImageFile(fichier.mime_type)
                                          ? "eye"
                                          : "download"
                                      }
                                      className="fs-8 ms-1"
                                    />
                                  </span>
                                )
                              )}
                              {(!ofFichiers[of.id] ||
                                ofFichiers[of.id].length === 0) && (
                                <span className="badge badge-light-secondary">
                                  Aucun fichier
                                </span>
                              )}
                            </div>
                          </td>

                          <td
                            className="text-center px-6"
                            style={{ verticalAlign: "middle" }}
                          >
                            <div className="d-flex justify-content-center align-items-center">
                              <ValidateBtn
                                id={of.id}
                                type="of"
                                statut={of.statut}
                                onValidate={loadData}
                              />
                            </div>
                          </td>

                          {ofIndex === 0 && (
                            <td
                              rowSpan={rowCount}
                              style={{ verticalAlign: "middle" }}
                            >
                              <div className="d-flex justify-content-center align-items-center h-100">
                                <ValidateBtn
                                  id={affaire.id}
                                  type="affaire"
                                  statut={affaire.statut}
                                  allOFCompleted={allOFsCompleted}
                                  onValidate={loadData}
                                />
                              </div>
                            </td>
                          )}
                        </tr>
                      )
                    )}
                    {affaireIndex < affaires.length - 1 && (
                      <tr>
                        <td colSpan={6} style={{ padding: "0.5rem 0" }}>
                          <div className="separator border-gray-300 border-2"></div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody> */}
            <tbody>
              {affaires.map((affaire, affaireIndex) => {
                const progress = calculateProgress(affaire.ordreFabrications);
                const allOFsCompleted = areAllOFsCompleted(
                  affaire.ordreFabrications
                );
                const rowCount = affaire.ordreFabrications.length;

                return (
                  <React.Fragment key={affaire.id}>
                    {affaire.ordreFabrications.map(
                      (of: any, ofIndex: number) => (
                        <tr key={of.id}>
                          {ofIndex === 0 && (
                            <>
                              <td rowSpan={rowCount}>
                                <div className="d-flex align-items-center">
                                  <div className="d-flex justify-content-start flex-column">
                                    <span className="text-gray-900 fw-bold text-hover-primary mb-1 fs-6">
                                      {affaire.numero}
                                    </span>
                                    <span className="text-muted fw-semibold text-muted d-block fs-7">
                                      {affaire.nom}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td rowSpan={rowCount}>
                                <div className="d-flex align-items-center">
                                  <div className="progress w-100px h-20px">
                                    <div
                                      className="progress-bar bg-primary"
                                      role="progressbar"
                                      style={{ width: `${progress}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-muted fw-semibold text-muted ms-3">
                                    {progress}%
                                  </span>
                                </div>
                              </td>
                            </>
                          )}

                          <td className="py-3 px-6">
                            <span className="text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6">
                              {of.nom}
                            </span>
                          </td>
                          <td className="text-left">
                            {ofFichiers[of.id]?.map((fichier: any) => (
                              <span
                                key={fichier.id}
                                className="badge badge-light-primary me-2"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  window.open(fichier.url, "_blank")
                                }
                              >
                                {fichier.nom}
                              </span>
                            ))}
                          </td>

                          {hasValidationAccess() && (
                            <>
                              <td
                                className="text-center px-6"
                                style={{ verticalAlign: "middle" }}
                              >
                                <div className="d-flex justify-content-center align-items-center">
                                  <ValidateBtn
                                    id={of.id}
                                    type="of"
                                    statut={of.statut}
                                    onValidate={loadData}
                                  />
                                </div>
                              </td>

                              {ofIndex === 0 && (
                                <td
                                  rowSpan={rowCount}
                                  style={{ verticalAlign: "middle" }}
                                >
                                  <div className="d-flex justify-content-center align-items-center h-100">
                                    <ValidateBtn
                                      id={affaire.id}
                                      type="affaire"
                                      statut={affaire.statut}
                                      allOFCompleted={allOFsCompleted}
                                      onValidate={loadData}
                                    />
                                  </div>
                                </td>
                              )}
                            </>
                          )}
                        </tr>
                      )
                    )}
                    {affaireIndex < affaires.length - 1 && (
                      <tr>
                        <td
                          colSpan={hasValidationAccess() ? 6 : 4}
                          style={{ padding: "0.5rem 0" }}
                        >
                          <div className="separator border-gray-300 border-2"></div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {isLoading && <ListLoading />}
    </div>
  );
};

export { FormTable };
