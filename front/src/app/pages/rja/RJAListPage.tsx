import React, { useState, useEffect } from "react";
import { Card } from "./Card";
import { PageTitle } from "../../../_metronic/layout/core";
import { useAuth } from "../../modules/auth";
import RapportModal from "./RapportModal";
import {
  getTacheParActivites,
  deleteTacheParActivite,
  TacheParActivite,
} from "../../../services/api";
import Swal from "sweetalert2";

const usersBreadcrumbs = [
  {
    title: "Rapport Journalier d'Activité",
    path: "/app/pages/rja",
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

export function RJAListPage() {
  const { currentUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [rapports, setRapports] = useState<TacheParActivite[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [rapportToEdit, setRapportToEdit] = useState<TacheParActivite | null>(
    null
  );

  const fetchRapports = async () => {
    try {
      const data = await getTacheParActivites();
      // Filtrer les rapports pour l'utilisateur connecté
      const userRapports = data.filter(
        (rapport: any) =>
          typeof rapport.executeur === "object" &&
          rapport.executeur?.id === currentUser?.id
      );
      setRapports(userRapports);
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
  }, [currentUser]);

  const handleEdit = (id: number) => {
    const rapport = rapports.find((r) => r.id === id);
    if (rapport) {
      setRapportToEdit(rapport);
      setShowModal(true);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTacheParActivite(id);
      await fetchRapports();
      Swal.fire({
        title: "Succès!",
        text: "Le rapport a été supprimé avec succès",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: "Erreur!",
        text: "Impossible de supprimer le rapport",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const filteredRapports =
    selectedStatus === "all"
      ? rapports
      : rapports.filter((rapport) => rapport.statut === selectedStatus);

  return (
    <>
      <PageTitle breadcrumbs={usersBreadcrumbs}>RJA</PageTitle>
      <div className="d-flex flex-wrap flex-stack mb-6">
        <h3 className="fw-bolder my-2">
          Mes Rapports
          <span className="fs-6 text-gray-500 fw-bold ms-1">
            ({rapports.length})
          </span>
        </h3>

        <div className="d-flex flex-wrap my-2">
          <div className="me-4">
            <select
              name="status"
              className="form-select form-select-sm form-select-white w-125px"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Tous</option>
              <option value="Standby">En attente</option>
              <option value="Validé">Validés</option>
              <option value="Réfusé">Réfusés</option>
            </select>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              setRapportToEdit(null);
              setShowModal(true);
            }}
          >
            Faire un rapport
          </button>
        </div>
      </div>

      <div className="row g-6 g-xl-9">
        {filteredRapports.map((rapport) => {
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
              <Card
                id={rapport.id!}
                date={rapport.date!}
                typeActivite={rapport.type_activite}
                tacheFacturable={tacheFacturable as any}
                ordreFabrication={ordreFabrication as any}
                duree={rapport.duree}
                statut={rapport.statut as any}
                validateur={rapport.validateur as any}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          );
        })}
      </div>

      <RapportModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setRapportToEdit(null);
        }}
        onSuccess={() => {
          fetchRapports();
          setShowModal(false);
          setRapportToEdit(null);
        }}
        rapportToEdit={rapportToEdit}
      />
    </>
  );
}

export default RJAListPage;
