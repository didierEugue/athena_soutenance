import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { PageTitle } from "../../../_metronic/layout/core";
import { ConsignesWidget } from "./ConsignesWidget";
import { AffairesWidget } from "./AffairesWidget";
import {
  getConsignes,
  getAffaires,
  updateConsigneStatus,
  createConsigne,
  updateConsigne,
  deleteConsigne,
  updateAffaire,
} from "../../../services/api";
import { useAuth } from "../../modules/auth";
import { ConsignesModal } from "./ConsignesModal";
import Swal from "sweetalert2";
import { ConsignesFormModal } from "./ConsignesFormModal";
import { ConsignesEnvoyeesModal } from "./ConsignesEnvoyeesModal";
import { Modal } from "react-bootstrap";
import { AffairesListModal } from "./Affaire/AffairesListModal";

const DashboardPage = () => {
  // Initialisation avec des tableaux vides
  const [consignes, setConsignes] = useState<any[]>([]);
  const [affaires, setAffaires] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConsignesModal, setShowConsignesModal] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState("");
  const [filteredConsignes, setFilteredConsignes] = useState<any[]>([]);
  const [showConsignesEnvoyeesModal, setShowConsignesEnvoyeesModal] =
    useState(false);
  const [showConsignesFormModal, setShowConsignesFormModal] = useState(false);
  const [selectedConsigne, setSelectedConsigne] = useState<any>(null);
  const [filteredConsignesEnvoyees, setFilteredConsignesEnvoyees] = useState<
    any[]
  >([]);
  const [showFinalizedModal, setShowFinalizedModal] = useState(false);
  const [finalizedType, setFinalizedType] = useState<"received" | "sent">(
    "received"
  );
  const [showAffairesModal, setShowAffairesModal] = useState(false);
  const [selectedAffairesStatus, setSelectedAffairesStatus] =
    useState<string>("");
  const [filteredAffaires, setFilteredAffaires] = useState<any[]>([]);

  const { currentUser } = useAuth();

  const handleAffairesClick = (status: string) => {
    let filtered;
    if (status === "final") {
      filtered = affaires.filter(
        (affaire) =>
          affaire.statut === "cloture" || affaire.statut === "archive"
      );
    } else {
      filtered = affaires.filter((affaire) => affaire.statut === status);
    }
    setFilteredAffaires(filtered);
    setSelectedAffairesStatus(status);
    setShowAffairesModal(true);
  };

  const getModalTitle = (status: string) => {
    switch (status) {
      case "standby":
        return "Nouvelles Affaires";
      case "en_cours":
        return "Affaires en cours";
      case "terminé":
        return "Affaires terminées";
      case "final":
        return "Affaires clôturées/archivées";
      default:
        return "Affaires";
    }
  };

  const handlePriorityClick = (priority: string) => {
    const filtered = consignesRecues.filter(
      (consigne) =>
        consigne.priorite === priority &&
        (consigne.etat === "standby" || consigne.etat === "en_cours")
    );
    setFilteredConsignes(filtered);
    setSelectedPriority(priority);
    setShowConsignesModal(true);
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await updateConsigneStatus(id, newStatus);

      Swal.fire({
        title: "Succès!",
        text: `La consigne a été mise à jour avec le statut "${newStatus}"`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      // Rafraîchir les données
      const consignesData = await getConsignes();
      setConsignes(consignesData["hydra:member"] || []);

      // Filtrer à nouveau les consignes avec le même critère de priorité
      const newFiltered = consignesData["hydra:member"].filter(
        (consigne: any) =>
          consigne.destinataire?.id === currentUser?.id &&
          consigne.priorite === selectedPriority &&
          (consigne.etat === "standby" || consigne.etat === "en_cours")
      );
      setFilteredConsignes(newFiltered);

      // Si plus aucune consigne à afficher, fermer le modal
      if (newFiltered.length === 0) {
        setShowConsignesModal(false);
      }
    } catch (error) {
      Swal.fire({
        title: "Erreur!",
        text: "Une erreur est survenue lors de la mise à jour",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [consignesData, affairesData] = await Promise.all([
          getConsignes(),
          getAffaires(),
        ]);
        console.log(affairesData); // Pour vérifier les données reçues
        setConsignes(consignesData["hydra:member"] || []);
        setAffaires(affairesData || []); // Modification ici - les données sont déjà un tableau
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getPriorityCounts = (items: any[]) => ({
    important_urgent: items.filter(
      (item) => item.priorite === "important/urgent"
    ).length,
    important_non_urgent: items.filter(
      (item) => item.priorite === "important/non_urgent"
    ).length,
    urgent_non_important: items.filter(
      (item) => item.priorite === "urgent/non_important"
    ).length,
    non_urgent_non_important: items.filter(
      (item) => item.priorite === "non_urgent/non_important"
    ).length,
  });

  const getAffairesCount = (statut: string): number => {
    if (!affaires || !Array.isArray(affaires)) return 0;
    return affaires.filter((affaire) => affaire.statut === statut).length;
  };

  const getAffairesDoubleCount = (): string => {
    if (!affaires || !Array.isArray(affaires)) return "0/0";
    const cloturees = affaires.filter(
      (affaire) => affaire.statut === "cloture"
    ).length;
    const archivees = affaires.filter(
      (affaire) => affaire.statut === "archive"
    ).length;
    return `${cloturees}/${archivees}`;
  };

  // if (isLoading) {
  //   return <div>Chargement...</div>;
  // }

  const consignesRecues = consignes.filter(
    (consigne) =>
      consigne.destinataire?.id === currentUser?.id &&
      (consigne.etat === "standby" || consigne.etat === "en_cours")
  );

  const consignesEnvoyees = consignes.filter(
    (consigne) =>
      consigne.expediteur?.id === currentUser?.id && consigne.etat !== "archive"
  );

  const consignesTerminees = consignes.filter(
    (consigne) =>
      consigne.destinataire?.id === currentUser?.id &&
      (consigne.etat === "termine" || consigne.etat === "archive")
  );

  const handleConsigneSubmit = async (values: any) => {
    try {
      if (selectedConsigne) {
        await updateConsigne(selectedConsigne.id, values);
        Swal.fire({
          title: "Succès!",
          text: "La consigne a été modifiée",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await createConsigne(values);
        Swal.fire({
          title: "Succès!",
          text: "La consigne a été créée",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      // Rafraîchir les données
      const consignesData = await getConsignes();
      setConsignes(consignesData["hydra:member"] || []);
      setShowConsignesFormModal(false);
      setSelectedConsigne(null);
    } catch (error) {
      Swal.fire({
        title: "Erreur!",
        text: "Une erreur est survenue",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const handlePriorityClickEnvoyees = (priority: string) => {
    const filtered = consignesEnvoyees.filter(
      (consigne) => consigne.priorite === priority
    );
    setFilteredConsignesEnvoyees(filtered);
    setSelectedPriority(priority);
    setShowConsignesEnvoyeesModal(true);
  };

  const handleArchive = async (id: number) => {
    try {
      await updateConsigneStatus(id, "archive");
      Swal.fire({
        title: "Succès!",
        text: "La consigne a été archivée",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      // Rafraîchir les données
      const consignesData = await getConsignes();
      setConsignes(consignesData["hydra:member"] || []);

      // Mettre à jour la liste filtrée
      const newFiltered = filteredConsignesEnvoyees.filter((c) => c.id !== id);
      setFilteredConsignesEnvoyees(newFiltered);

      if (newFiltered.length === 0) {
        setShowConsignesEnvoyeesModal(false);
      }
    } catch (error) {
      Swal.fire({
        title: "Erreur!",
        text: "Une erreur est survenue",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const handleArchiveAffaire = async (id: number, newStatus: any) => {
    try {
      const result = await Swal.fire({
        title: "Êtes-vous sûr ?",
        text: `Voulez-vous ${
          newStatus === "cloture" ? "clôturer" : "archiver"
        } cette affaire ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui",
        cancelButtonText: "Non",
      });

      if (result.isConfirmed) {
        await updateAffaire(id, { statut: newStatus });

        // Rafraîchir les données
        const affairesData = await getAffaires();
        setAffaires(affairesData);

        // Mettre à jour filteredAffaires
        let filtered;
        if (selectedAffairesStatus === "final") {
          filtered = affairesData.filter(
            (affaire: any) =>
              affaire.statut === "cloture" || affaire.statut === "archive"
          );
        } else {
          filtered = affairesData.filter(
            (affaire: any) => affaire.statut === selectedAffairesStatus
          );
        }
        setFilteredAffaires(filtered);

        Swal.fire({
          title: "Succès !",
          text: `L'affaire a été ${
            newStatus === "cloture" ? "clôturée" : "archivée"
          } avec succès`,
          icon: "success",
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'archivage:", error);
      Swal.fire({
        title: "Erreur",
        text: "Une erreur est survenue lors de l'opération",
        icon: "error",
      });
    }
  };

  const handleEdit = (consigne: any) => {
    setSelectedConsigne(consigne);
    setShowConsignesFormModal(true);
    // setShowConsignesEnvoyeesModal(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteConsigne(id);
      Swal.fire({
        title: "Succès!",
        text: "La consigne a été supprimée",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      // Rafraîchir les données
      const consignesData = await getConsignes();
      setConsignes(consignesData["hydra:member"] || []);

      // Mettre à jour la liste filtrée
      const newFiltered = filteredConsignesEnvoyees.filter((c) => c.id !== id);
      setFilteredConsignesEnvoyees(newFiltered);

      if (newFiltered.length === 0) {
        setShowConsignesEnvoyeesModal(false);
      }
    } catch (error) {
      Swal.fire({
        title: "Erreur!",
        text: "Une erreur est survenue",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const consignesTermineesRecues = consignes.filter(
    (consigne) =>
      consigne.destinataire?.id === currentUser?.id &&
      consigne.etat === "termine"
  );

  const consignesArchiveesEnvoyees = consignes.filter(
    (consigne) =>
      consigne.expediteur?.id === currentUser?.id && consigne.etat === "archive"
  );

  const handleFinalizedClick = (type: "received" | "sent") => {
    setFinalizedType(type);
    setShowFinalizedModal(true);
  };

  return (
    <>
      {/* Consignes Section */}
      <div className="row g-5 g-xl-8 mb-5">
        <div className="col-xl-4">
          <ConsignesWidget
            className="card-xl-stretch mb-xl-8"
            title="Consignes Reçues"
            total={consignesRecues.length}
            priorities={getPriorityCounts(consignesRecues)}
            image="abstract-1.svg"
            onPriorityClick={handlePriorityClick}
          />
        </div>

        <div className="col-xl-4">
          <ConsignesWidget
            className="card-xl-stretch mb-xl-8"
            title="Consignes Envoyées"
            total={consignesEnvoyees.length}
            priorities={getPriorityCounts(consignesEnvoyees)}
            showAddButton={true}
            onAdd={() => {
              setSelectedConsigne(null);
              setShowConsignesFormModal(true);
            }}
            onPriorityClick={handlePriorityClickEnvoyees}
            image="abstract-2.svg"
          />
        </div>

        <div className="col-xl-4">
          <ConsignesWidget
            className="card-xl-stretch mb-xl-8"
            title="Consignes Finalisées"
            total={`${consignesTermineesRecues.length}/${consignesArchiveesEnvoyees.length}`}
            showFinalized={true}
            finalized={{
              received: consignesTermineesRecues.length,
              sent: consignesArchiveesEnvoyees.length,
            }}
            image="abstract-4.svg"
            onFinalizedClick={handleFinalizedClick}
          />
        </div>
      </div>

      {/* Affaires Section */}

      <div className="row g-5 g-xl-8">
        <div className="col-xl-3">
          <AffairesWidget
            className="card-xl-stretch mb-xl-8"
            title="Nouvelles Affaires"
            count={getAffairesCount("standby")}
            color="primary"
            icon="element-11"
            onClick={() => handleAffairesClick("standby")}
          />
        </div>

        <div className="col-xl-3">
          <AffairesWidget
            className="card-xl-stretch mb-xl-8"
            title="Affaires en cours"
            count={getAffairesCount("en_cours")}
            color="success"
            icon="chart-simple"
            onClick={() => handleAffairesClick("en_cours")}
          />
        </div>

        <div className="col-xl-3">
          <AffairesWidget
            className="card-xl-stretch mb-xl-8"
            title="Affaires terminées"
            count={getAffairesCount("terminé")}
            color="info"
            icon="check-circle"
            onClick={() => handleAffairesClick("terminé")}
          />
        </div>

        <div className="col-xl-3">
          <AffairesWidget
            className="card-xl-stretch mb-xl-8"
            title="Affaires clôturées/archivées"
            count={`${getAffairesCount("cloture")}/${getAffairesCount(
              "archive"
            )}`}
            color="dark"
            icon="archive"
            onClick={() => handleAffairesClick("final")}
          />
        </div>
      </div>

      <ConsignesModal
        show={showConsignesModal}
        handleClose={() => setShowConsignesModal(false)}
        consignes={filteredConsignes}
        priorityTitle={selectedPriority}
        onUpdateStatus={handleUpdateStatus}
      />
      <ConsignesEnvoyeesModal
        show={showConsignesEnvoyeesModal}
        handleClose={() => setShowConsignesEnvoyeesModal(false)}
        consignes={filteredConsignesEnvoyees}
        priorityTitle={selectedPriority}
        onArchive={handleArchive}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ConsignesFormModal
        show={showConsignesFormModal}
        handleClose={() => {
          setShowConsignesFormModal(false);
          setSelectedConsigne(null);
        }}
        onSubmit={handleConsigneSubmit}
        initialValues={selectedConsigne}
      />

      <AffairesListModal
        show={showAffairesModal}
        handleClose={() => setShowAffairesModal(false)}
        affaires={filteredAffaires}
        title={getModalTitle(selectedAffairesStatus)}
      />

      <Modal
        show={showFinalizedModal}
        onHide={() => setShowFinalizedModal(false)}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {finalizedType === "received"
              ? "Consignes Reçues Terminées"
              : "Consignes Envoyées Archivées"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row g-5 g-xl-8">
            {(finalizedType === "received"
              ? consignesTermineesRecues
              : consignesArchiveesEnvoyees
            ).map((consigne) => (
              <div key={consigne.id} className="col-xl-4">
                <div className="card card-xl-stretch mb-xl-8">
                  <div className="card-header border-0">
                    <h3 className="card-title fw-bold text-dark">
                      {consigne.titre}
                    </h3>
                    <div className="card-toolbar">
                      <span
                        className={`badge badge-light-${
                          finalizedType === "received" ? "success" : "info"
                        }`}
                      >
                        {consigne.etat}
                      </span>
                    </div>
                  </div>
                  <div className="card-body pt-0">
                    <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
                      <p className="text-gray-800 mb-0">
                        Type :{" "}
                        {consigne.type === "personnel"
                          ? "Consigne Personnel"
                          : "Consigne de Direction"}
                      </p>
                    </div>
                    <p className="text-gray-800 mb-5">{consigne.contenu}</p>
                    <div className="d-flex align-items-center">
                      <div className="d-flex align-items-center flex-grow-1">
                        <div className="d-flex flex-column">
                          <span className="text-muted fw-semibold">
                            {finalizedType === "received" ? "De: " : "À: "}
                            {(finalizedType === "received"
                              ? consigne.expediteur?.id
                              : consigne.destinataire?.id) === currentUser?.id
                              ? "Moi même"
                              : `${
                                  finalizedType === "received"
                                    ? consigne.expediteur?.nom
                                    : consigne.destinataire?.nom
                                } ${
                                  finalizedType === "received"
                                    ? consigne.expediteur?.prenoms
                                    : consigne.destinataire?.prenoms
                                }`}
                          </span>
                          <span className="text-muted fw-semibold">
                            Échéance:{" "}
                            {new Date(
                              consigne.date_echeance
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
      <AffairesListModal
        show={showAffairesModal}
        handleClose={() => setShowAffairesModal(false)}
        affaires={filteredAffaires}
        title={getModalTitle(selectedAffairesStatus)}
        onArchive={handleArchiveAffaire}
      />
    </>
  );
};

const DashboardWrapper = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.DASHBOARD" })}
      </PageTitle>
      <DashboardPage />
    </>
  );
};

export { DashboardWrapper };
