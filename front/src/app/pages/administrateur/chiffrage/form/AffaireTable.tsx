import React, { useState, useEffect } from "react";
import { KTIcon } from "../../../../../_metronic/helpers";
import { Modal } from "react-bootstrap";
import { ClientsPage } from "../Client/ClientsPage";
import { FournisseursPage } from "../fournisseur/FournisseursPage";
import AddAffaire from "../affaire/AddAffaire";
import {
  getAffaires,
  deleteAffaire,
  Affaire,
} from "../../../../../services/api";
import Swal from "sweetalert2";
import { Dropdown } from "react-bootstrap";
import { getOFFichiers } from "../../../../../services/api";
import { Portal } from "../../../../../_metronic/partials/content/portal/Portal";

type Props = {
  className: string;
};

const AffaireTable: React.FC<Props> = ({ className }) => {
  const [showModal, setShowModal] = useState(false);
  const [showClientsModal, setShowClientsModal] = useState(false);
  const [showFournisseursModal, setShowFournisseursModal] = useState(false);
  const [affaires, setAffaires] = useState<Affaire[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAffaireId, setSelectedAffaireId] = useState<
    number | undefined
  >(undefined);
  const [selectedAffaireOFs, setSelectedAffaireOFs] = useState<number | null>(
    null
  );
  const [ofFichiers, setOfFichiers] = useState<{ [key: number]: any[] }>({});
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // const dropdownStyle = {
  //   position: "absolute",
  //   backgroundColor: "#ffffff",
  //   border: "1px solid #E4E6EF",
  //   borderRadius: "8px",
  //   boxShadow: "0 0 50px 0 rgb(82 63 105 / 15%)",
  //   padding: "1rem",
  //   zIndex: 1000,
  //   minWidth: "300px",
  //   maxWidth: "400px",
  //   right: "100%",
  //   top: "-10px",
  //   marginRight: "10px",
  // };
  const dropdownStyle = {
    position: "fixed" as const,
    backgroundColor: "#ffffff",
    border: "1px solid #E4E6EF",
    borderRadius: "8px",
    boxShadow: "0 0 50px 0 rgb(82 63 105 / 15%)",
    padding: "1rem",
    zIndex: 9999,
    minWidth: "300px",
    maxWidth: "400px",
    ...dropdownPosition,
  };

  const ofItemStyle = {
    padding: "0.75rem",
    borderBottom: "1px dashed #E4E6EF",
    transition: "all 0.2s ease",
  };

  const ofHeaderStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.5rem",
  };

  const loadAffaires = async () => {
    try {
      const data = await getAffaires();
      setAffaires(data);
    } catch (error) {
      console.error("Erreur lors du chargement des affaires:", error);
      Swal.fire({
        title: "Erreur!",
        text: "Impossible de charger les affaires",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const loadOFFichiers = async (ofId: number) => {
    try {
      const fichiers = await getOFFichiers(ofId);
      setOfFichiers((prev) => ({
        ...prev,
        [ofId]: fichiers,
      }));
    } catch (error) {
      console.error("Erreur chargement fichiers:", error);
    }
  };

  useEffect(() => {
    loadAffaires();
  }, []);

  const handleEdit = (id: number) => {
    setSelectedAffaireId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAffaireId(undefined);
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await Swal.fire({
        title: "Êtes-vous sûr?",
        text: "Cette action est irréversible!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimer!",
        cancelButtonText: "Annuler",
      });

      if (result.isConfirmed) {
        await deleteAffaire(id);
        await loadAffaires();
        Swal.fire(
          "Supprimé!",
          "L'affaire a été supprimée avec succès.",
          "success"
        );
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      Swal.fire(
        "Erreur!",
        "Une erreur est survenue lors de la suppression.",
        "error"
      );
    }
  };

  const filteredAffaires = affaires.filter(
    (affaire) =>
      affaire.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affaire.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affaire.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`card ${className}`}>
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">
            Liste des Affaires
          </span>
          <span className="text-muted mt-1 fw-semibold fs-7">
            Nombre d'affaires : {affaires.length}
          </span>
        </h3>

        <div className="d-flex align-items-center flex-grow-1 mx-4">
          <div className="position-relative w-100">
            <KTIcon
              iconName="magnifier"
              className="fs-2 text-gray-500 position-absolute top-50 translate-middle-y ms-4"
            />
            <input
              type="text"
              className="form-control form-control-solid ps-12"
              placeholder="Rechercher une affaire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="card-toolbar">
          <a
            href="#"
            className="btn btn-sm btn-light-info me-2"
            onClick={() => setShowClientsModal(true)}
          >
            <KTIcon iconName="user" className="fs-2" />
            Liste des clients
          </a>
          <a
            href="#"
            className="btn btn-sm btn-light-success me-2"
            onClick={() => setShowFournisseursModal(true)}
          >
            <KTIcon iconName="truck" className="fs-2" />
            Liste des fournisseurs
          </a>
          <a
            href="#"
            className="btn btn-sm btn-light-primary"
            onClick={() => setShowModal(true)}
          >
            <KTIcon iconName="plus" className="fs-2" />
            Ajouter une affaire
          </a>
        </div>
      </div>

      <div className="card-body py-3">
        <div className="table-responsive">
          <table className="table align-middle gs-0 gy-4">
            <thead>
              <tr className="fw-bold text-muted bg-light">
                <th className="ps-4 min-w-200px rounded-start">Affaire</th>
                <th className="min-w-150px">Client</th>
                <th className="min-w-225px">Description</th>
                <th className="min-w-150px text-center">Statut</th>
                <th className="min-w-40px text-center">Nb OF</th>
                <th className="min-w-100px text-center rounded-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAffaires.map((affaire) => (
                <tr key={affaire.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="d-flex justify-content-start flex-column">
                        <a
                          href="#"
                          className="text-gray-900 fw-bold text-hover-primary mb-1 fs-6"
                        >
                          {affaire.numero}
                        </a>
                        <span className="text-muted fw-semibold text-muted d-block fs-7">
                          {affaire.nom}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-gray-900 fw-bold">
                      {affaire.client ? (affaire.client as any).nom : "Aucun client"}
                    </span>
                  </td>
                  <td>
                    <span className="text-gray-900">{affaire.description}</span>
                  </td>
                  <td className="text-center">
                    <span
                      className={`badge badge-light-${
                        affaire.statut === "standby" ? "warning" : "success"
                      } fs-7 fw-bold`}
                    >
                      {affaire.statut}
                    </span>
                  </td>
                  {/* <td>
                    <span className="badge badge-light-primary fs-7 fw-bold">
                      {affaire.ordreFabrications?.length || 0}
                    </span>
                  </td> */}
                  {/* <td className="position-relative">
                    <span
                      className="badge badge-light-primary fs-7 fw-bold"
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAffaireOFs(
                          selectedAffaireOFs === affaire.id ? null : (affaire.id ?? null)
                        );
                        if (affaire.id !== selectedAffaireOFs) {
                          affaire.ordreFabrications?.forEach((of) => {
                            if (of.id) loadOFFichiers(of.id);
                          });
                        }
                      }}
                    >
                      {affaire.ordreFabrications?.length || 0}
                    </span>

                    {selectedAffaireOFs === affaire.id &&
                      affaire.ordreFabrications && (
                        <div style={dropdownStyle}>
                          <div className="fw-bold fs-6 text-dark mb-3">
                            Ordres de fabrication
                          </div>
                          {affaire.ordreFabrications.map((of: any) => (
                            <div key={of.id} style={ofItemStyle}>
                              <div style={ofHeaderStyle}>
                                <KTIcon
                                  iconName="gear"
                                  className="fs-4 text-primary"
                                />
                                <span className="fw-semibold text-gray-800">
                                  {of.numero}
                                </span>
                                <span className="badge badge-light-info">
                                  {of.statut}
                                </span>
                              </div>
                              <div className="text-gray-600 mb-2">{of.nom}</div>
                              <div className="d-flex flex-wrap gap-2">
                                {ofFichiers[of.id]?.map(
                                  (fichier: any, index: number) => (
                                    <span
                                      key={index}
                                      className="badge badge-light-success d-inline-flex align-items-center gap-1"
                                      style={{
                                        cursor: "pointer",
                                        padding: "0.5rem 0.75rem",
                                      }}
                                      onClick={() =>
                                        window.open(fichier.url, "_blank")
                                      }
                                    >
                                      <KTIcon
                                        iconName="file-doc"
                                        className="fs-6"
                                      />
                                      {fichier.nom}
                                    </span>
                                  )
                                )}
                                {(!ofFichiers[of.id] ||
                                  ofFichiers[of.id].length === 0) && (
                                  <span className="badge badge-light text-muted">
                                    Aucun fichier attaché
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                  </td> */}
                  <td className="text-center">
                    <span
                      className="badge badge-light-primary fs-7 fw-bold"
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        setDropdownPosition({
                          top: rect.top,
                          left: rect.left - 420, // 400px (maxWidth) + 20px (marge)
                        });
                        setSelectedAffaireOFs(
                          selectedAffaireOFs === affaire.id ? null : (affaire.id ?? null)
                        );
                        if (affaire.id !== selectedAffaireOFs) {
                          affaire.ordreFabrications?.forEach((of) => {
                            if (of.id) loadOFFichiers(of.id);
                          });
                        }
                      }}
                    >
                      {affaire.ordreFabrications?.length || 0}
                    </span>
                  </td>
                  {selectedAffaireOFs === affaire.id &&
                    affaire.ordreFabrications && (
                      <Portal>
                        <div style={dropdownStyle}>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="fw-bold fs-6 text-dark">
                              Ordres de fabrication
                            </div>
                            <button
                              type="button"
                              className="btn btn-sm btn-icon btn-light"
                              onClick={() => setSelectedAffaireOFs(null)}
                            >
                              <KTIcon iconName="cross" className="fs-2" />
                            </button>
                          </div>
                          <div
                            className="overflow-auto"
                            style={{ maxHeight: "500px" }}
                          >
                            {affaire.ordreFabrications.map((of: any) => (
                              <div
                                key={of.id}
                                className="card card-flush shadow-none mb-3"
                              >
                                <div className="card-header align-items-center border-0">
                                  <div className="d-flex align-items-center">
                                    <KTIcon
                                      iconName="gear"
                                      className="fs-2 text-primary me-2"
                                    />
                                    <div>
                                      <div className="fw-bold">{of.numero}</div>
                                      <div className="text-gray-600">
                                        {of.nom}
                                      </div>
                                    </div>
                                  </div>
                                  <span
                                    className={`badge badge-light-${
                                      of.statut === "standby"
                                        ? "warning"
                                        : "success"
                                    } ms-2`}
                                  >
                                    {of.statut}
                                  </span>
                                </div>
                                <div className="card-body pt-0">
                                  <div className="d-flex flex-wrap gap-2">
                                    {ofFichiers[of.id]?.map(
                                      (fichier: any, index: number) => (
                                        <span
                                          key={index}
                                          className="badge badge-light-success d-inline-flex align-items-center gap-1 p-2"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            window.open(fichier.url, "_blank")
                                          }
                                        >
                                          <KTIcon
                                            iconName="file-doc"
                                            className="fs-6"
                                          />
                                          {fichier.nom}
                                        </span>
                                      )
                                    )}
                                    {(!ofFichiers[of.id] ||
                                      ofFichiers[of.id].length === 0) && (
                                      <span className="badge badge-light text-muted">
                                        Aucun fichier attaché
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Portal>
                    )}
                  <td className="text-center">
                    <a
                      href="#"
                      className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                    >
                      <KTIcon iconName="book-open" className="fs-3" />
                    </a>
                    <a
                      href="#"
                      className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                      onClick={() => affaire.id && handleEdit(affaire.id)}
                    >
                      <KTIcon iconName="pencil" className="fs-3" />
                    </a>
                    <a
                      href="#"
                      className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
                      onClick={() => affaire.id && handleDelete(affaire.id)}
                    >
                      <KTIcon iconName="trash" className="fs-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* <AddAffaire show={showModal} handleClose={() => setShowModal(false)} onSuccess={loadAffaires} /> */}
      <AddAffaire
        show={showModal}
        handleClose={handleCloseModal}
        onSuccess={loadAffaires}
        affaireId={selectedAffaireId}
      />

      <Modal
        show={showClientsModal}
        onHide={() => setShowClientsModal(false)}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Gestion des Clients</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ClientsPage className="" />
        </Modal.Body>
      </Modal>

      <Modal
        show={showFournisseursModal}
        onHide={() => setShowFournisseursModal(false)}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Liste des Fournisseurs</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FournisseursPage className="" />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export { AffaireTable };
export default AffaireTable;
