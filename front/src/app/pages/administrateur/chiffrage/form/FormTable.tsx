import React, { useState, useEffect } from "react";
import { KTIcon } from "../../../../../_metronic/helpers";
import { ValidateBtn } from "./ValidateBtn";
import { ListLoading } from "./ListLoading";
import { AddChiffrage } from "./AddChiffrage";
import {
  getChiffrages,
  deleteChiffrage,
  getAffaires,
  getFournisseurs,
  TypeChiffrage,
  getTypeChiffrages,
} from "../../../../../services/api";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

const FormTable: React.FC = () => {
  const [chiffrages, setChiffrages] = useState<any[]>([]);
  const [affaires, setAffaires] = useState<any[]>([]);
  const [fournisseurs, setFournisseurs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAffaire, setSelectedAffaire] = useState<any | null>(null);
  const [editingChiffrage, setEditingChiffrage] = useState<any | null>(null);
  const [typeChiffrages, setTypeChiffrages] = useState<TypeChiffrage[]>([]);

  // const [validatedAffaires, setValidatedAffaires] = useState<number[]>([])

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [
        chiffragesData,
        affairesData,
        fournisseursData,
        typeChiffragesData,
      ] = await Promise.all([
        getChiffrages(),
        getAffaires(),
        getFournisseurs(),
        getTypeChiffrages(),
      ]);
      console.log("Types de chiffrage chargés:", typeChiffragesData);
      console.log("Types de chiffrage chargés:", typeChiffragesData);

      setChiffrages(chiffragesData);
      setAffaires(affairesData);
      setFournisseurs(fournisseursData);
      setTypeChiffrages(typeChiffragesData);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        await deleteChiffrage(id);
        await loadData();
        Swal.fire(
          "Supprimé !",
          "Le chiffrage a été supprimé avec succès.",
          "success"
        );
      } catch (error) {
        Swal.fire(
          "Erreur !",
          "Une erreur est survenue lors de la suppression.",
          "error"
        );
      }
    }
  };

  const handleAffaireValidation = async (affaireId: number) => {
    try {
      await loadData(); // Recharger les données après validation
    } catch (error) {
      console.error("Erreur lors du rechargement des données:", error);
    }
  };

  const openModal = (affaireId?: number, chiffrage?: any) => {
    if (affaireId) {
      const affaire = affaires.find((a) => a.id === affaireId);
      setSelectedAffaire(affaire);
    }
    setEditingChiffrage(chiffrage || null);
    setIsAddModalOpen(true);
  };

  const groupedChiffrages = chiffrages.reduce((acc: any, chiffrage: any) => {
    const affaireId = chiffrage.affaire.id;
    if (!acc[affaireId]) {
      acc[affaireId] = [];
    }
    acc[affaireId].push(chiffrage);
    return acc;
  }, {});

  const exportExcel = () => {
    // Filtrer uniquement les chiffrages des affaires validées
    const validatedChiffrages = chiffrages.filter(
      (chiffrage) => chiffrage.affaire.statut === "en_cours"
    );

    // Calculer le total
    const total = validatedChiffrages.reduce(
      (sum, chiffrage) => sum + chiffrage.cout,
      0
    );

    // Préparer les données pour l'export
    const data = validatedChiffrages.map((chiffrage) => ({
      "Numéro Affaire": chiffrage.affaire.numero,
      "Nom Affaire": chiffrage.affaire.nom,
      Type: chiffrage.type.nom,
      "Coût (€)": chiffrage.cout.toFixed(2),
      Fournisseur: chiffrage.fournisseur.nom,
    }));

    // Ajouter une ligne vide et le total
    data.push({
      "Numéro Affaire": "",
      "Nom Affaire": "",
      Type: "",
      "Coût (€)": "",
      Fournisseur: "",
    });
    data.push({
      "Numéro Affaire": "",
      "Nom Affaire": "",
      Type: "TOTAL",
      "Coût (€)": total.toFixed(2),
      Fournisseur: "",
    });

    // Créer le workbook et la worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Chiffrages");

    // Sauvegarder le fichier
    XLSX.writeFile(wb, "chiffrages_validés.xlsx");
  };

  return (
    <>
      <div className="card">
        {/* Header du tableau - reste identique */}
        <div className="card-header border-0 pt-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bold fs-3 mb-1">
              Chiffrages Estimatifs
            </span>
            <span className="text-muted mt-1 fw-semibold fs-7">
              Tableau des chiffrages par affaire
            </span>
          </h3>
          <div className="card-toolbar">
            <a href="#" className="btn btn-sm btn-light-primary me-2">
              <KTIcon iconName="filter" className="fs-1" />
              Filtrer
            </a>
            <a
              href="#"
              className="btn btn-sm btn-light-primary me-2"
              onClick={exportExcel}
            >
              <KTIcon iconName="exit-up" className="fs-1" />
              Exporter CSV
            </a>
            <a
              href="#"
              className="btn btn-sm btn-light-primary"
              onClick={() => openModal()}
            >
              <KTIcon iconName="plus" className="fs-1" />
              Ajouter
            </a>
          </div>
        </div>

        <div className="card-body py-3">
          <div className="table-responsive">
            <table className="table align-middle gs-0 gy-4">
              {/* En-tête du tableau - reste identique */}
              <thead>
                <tr className="fw-bold text-muted bg-light">
                  <th className="ps-4 min-w-90px rounded-start">Affaire</th>
                  <th className="min-w-100px">Total</th>
                  <th className="min-w-70px">Ajouter</th>
                  <th className="min-w-100px">Type</th>
                  <th className="min-w-100px text-center">Coût</th>
                  <th className="min-w-90px">Fournisseur</th>
                  <th className="min-w-100px text-center">Actions</th>
                  <th className="min-w-5px text-center rounded-end pe-3">
                    Valider
                  </th>
                </tr>
              </thead>

              <tbody>
                {(Object.entries(groupedChiffrages) as [string, any[]][]).map(
                  (
                    [affaireId, affaireChiffrages],
                    affaireIndex
                  ) => {
                    const totalCout = affaireChiffrages.reduce(
                      (sum, c) => sum + c.cout,
                      0
                    );
                    const isLastAffaire =
                      affaireIndex ===
                      Object.keys(groupedChiffrages).length - 1;
                    const rowCount =
                      affaireChiffrages.length + (affaireChiffrages.length - 1); // Nombre de lignes + séparateurs

                    return (
                      <React.Fragment key={affaireId}>
                        {affaireChiffrages.map((chiffrage, index) => {
                          console.log(chiffrage.affaire.statut);
                          const isLastChiffrage =
                            index === affaireChiffrages.length - 1;

                          return (
                            <React.Fragment key={chiffrage.id}>
                              <tr>
                                {index === 0 && (
                                  <>
                                    <td rowSpan={rowCount}>
                                      <div className="d-flex align-items-center">
                                        <div className="d-flex justify-content-start flex-column">
                                          <a
                                            href="#"
                                            className="text-gray-900 fw-bold text-hover-primary mb-1 fs-6"
                                          >
                                            {chiffrage.affaire.numero} -{" "}
                                            {chiffrage.affaire.nom}
                                          </a>
                                          <span className="text-muted fw-semibold text-muted d-block fs-7">
                                            {chiffrage.affaire.client?.nom ||
                                              "-"}
                                          </span>
                                        </div>
                                      </div>
                                    </td>
                                    <td rowSpan={rowCount}>
                                      <a
                                        href="#"
                                        className="text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6"
                                      >
                                        {totalCout.toFixed(2)}€
                                      </a>
                                      <span className="text-muted fw-semibold text-muted d-block fs-7">
                                        Total
                                      </span>
                                    </td>
                                    <td rowSpan={rowCount}>
                                      <a
                                        href="#"
                                        className={`btn btn-icon btn-bg-light ${
                                          chiffrage.affaire.statut ===
                                          "en_cours"
                                            ? "btn-disabled"
                                            : "btn-active-color-primary"
                                        } btn-sm me-1`}
                                        onClick={() =>
                                          chiffrage.affaire.statut !==
                                            "en_cours" &&
                                          openModal(Number(affaireId))
                                        }
                                        style={{
                                          cursor:
                                            chiffrage.affaire.statut ===
                                            "en_cours"
                                              ? "not-allowed"
                                              : "pointer",
                                          opacity:
                                            chiffrage.affaire.statut ===
                                            "en_cours"
                                              ? "0.6"
                                              : "1",
                                        }}
                                      >
                                        <KTIcon
                                          iconName="plus"
                                          className="fs-3"
                                        />
                                      </a>
                                    </td>
                                  </>
                                )}
                                <td className="text-start ps-0">
                                  <span className="text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6">
                                    {chiffrage.type.nom}
                                  </span>
                                </td>
                                <td className="text-end">
                                  <span className="badge badge-light-success fs-7 fw-semibold">
                                    {chiffrage.cout.toFixed(2)}€
                                  </span>
                                </td>
                                <td>
                                  <span className="badge badge-light-primary fs-7 fw-semibold">
                                    {chiffrage.fournisseur.nom}
                                  </span>
                                </td>
                                <td className="text-center pe-3">
                                  <a
                                    href="#"
                                    className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                                    onClick={() =>
                                      openModal(Number(affaireId), chiffrage)
                                    }
                                  >
                                    <KTIcon
                                      iconName="pencil"
                                      className="fs-3"
                                    />
                                  </a>
                                  <a
                                    href="#"
                                    className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
                                    onClick={() => handleDelete(chiffrage.id)}
                                  >
                                    <KTIcon iconName="trash" className="fs-3" />
                                  </a>
                                </td>

                                {index === 0 && (
                                  <td
                                    rowSpan={rowCount}
                                    className="text-center"
                                    style={{
                                      verticalAlign: "middle",
                                      position: "relative",
                                    }}
                                  >
                                    <div
                                      style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                      }}
                                    >
                                      <ValidateBtn
                                        affaireId={Number(affaireId)}
                                        statut={chiffrage.affaire.statut}
                                        onValidate={() =>
                                          handleAffaireValidation(
                                            Number(affaireId)
                                          )
                                        }
                                      />
                                    </div>
                                  </td>
                                )}
                              </tr>
                              {!isLastChiffrage && (
                                <tr>
                                  <td colSpan={4} className="p-0">
                                    <div className="separator separator-dashed"></div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                        {!isLastAffaire && (
                          <tr>
                            <td colSpan={8} className="p-0">
                              <div className="separator separator-dashed"></div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
        {isLoading && <ListLoading />}
      </div>

      <AddChiffrage
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedAffaire(null);
          setEditingChiffrage(null);
        }}
        affaires={affaires}
        fournisseurs={fournisseurs}
        typeChiffrages={typeChiffrages}
        selectedAffaire={selectedAffaire}
        editingChiffrage={editingChiffrage}
        onSuccess={loadData}
      />
    </>
  );
};

export { FormTable };
