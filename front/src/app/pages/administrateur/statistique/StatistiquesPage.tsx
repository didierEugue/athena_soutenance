import React, { useState, useEffect, useMemo } from "react";
import { getUsers, getAffaires } from "../../../../services/api";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { KTIcon } from "../../../../_metronic/helpers";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { fr } from "date-fns/locale";
import { PageLink, PageTitle } from "../../../../_metronic/layout/core";

interface FilterState {
  selectedUser: any;
  selectedAffaire: any;
  startDate: Date | null;
  endDate: Date | null;
}

interface AdvancedFilters {
  statut: string;
  typeActivite: string;
  coutMin: string;
  coutMax: string;
}

const StatistiquesPage = () => {
  // États
  const [activeView, setActiveView] = useState<"user" | "affaire">("user");
  const [users, setUsers] = useState<any[]>([]);
  const [affaires, setAffaires] = useState<any[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    selectedUser: null,
    selectedAffaire: null,
    startDate: null,
    endDate: null,
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    statut: "",
    typeActivite: "",
    coutMin: "",
    coutMax: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Chargement initial des données
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const usersResponse = await getUsers();
        const affairesResponse = await getAffaires();

        const usersData = usersResponse?.["hydra:member"] || [];
        setUsers(
          usersData.map((user: any) => ({
            value: user.id,
            label: `${user.nom} ${user.prenoms}`,
            ...user,
          }))
        );

        // const affairesData = affairesResponse?.["hydra:member"] || [];
        // setAffaires(
        //   affairesData.map((affaire: any) => ({
        //     value: affaire.id,
        //     label: `${affaire.numero} - ${affaire.nom}`,
        //     ...affaire,
        //   }))
        // );
        const affairesData = affairesResponse || [];
        setAffaires(
          affairesData.map((affaire: any) => ({
            value: affaire.id,
            label: `${affaire.numero} - ${affaire.nom}`,
            ...affaire,
          }))
        );

        setError(null);
      } catch (err: any) {
        setError(`Erreur de chargement: ${err.message}`);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Calcul des statistiques par utilisateur
  const calculateUserStatistics = () => {
    if (!filters.selectedUser || !filters.startDate || !filters.endDate)
      return [];

    const startDate = new Date(filters.startDate);
    const endDate = new Date(filters.endDate);
    const userData = users.find(
      (u: any) => u.id === filters.selectedUser.value
    );

    let statistics: any[] = [];

    userData?.tacheParActivites.forEach((tache: any) => {
      const tacheDate = new Date(tache.date);
      if (tacheDate >= startDate && tacheDate <= endDate) {
        const coefficient = userData.role.coefficient_qualification;
        const coutHoraire = tache.tache_facturable.cout_horaire;
        const heures = parseFloat(tache.duree);
        const total = coefficient * coutHoraire * heures;

        statistics.push({
          affaire: tache.ordre_fabrication.numero.split("-")[1],
          of: tache.ordre_fabrication.numero,
          tacheFacturable: tache.tache_facturable.nom,
          coutHoraire: tache.tache_facturable.cout_horaire,
          heures: tache.duree,
          coefficient: coefficient,
          total: total,
          typeActivite: tache.type_activite,
          statut: tache.statut,
        });
      }
    });

    return statistics;
  };

  // Calcul des statistiques par affaire
  const calculateAffaireStatistics = () => {
    if (!filters.selectedAffaire || !filters.startDate || !filters.endDate)
      return [];

    const startDate = new Date(filters.startDate);
    const endDate = new Date(filters.endDate);
    const affaireData = affaires.find(
      (a: any) => a.id === filters.selectedAffaire.value
    );

    let userStats: {
      [key: string]: { heures: number; cout: number; nom: string };
    } = {};

    affaireData?.ordreFabrications.forEach((of: any) => {
      of.tacheParActivites.forEach((tache: any) => {
        const tacheDate = new Date(tache.date);
        if (tacheDate >= startDate && tacheDate <= endDate) {
          const executeur = tache.executeur;
          const coefficient = executeur.role?.coefficient_qualification || 1;
          const coutHoraire = tache.tache_facturable.cout_horaire;
          const heures = parseFloat(tache.duree);
          const cout = coefficient * coutHoraire * heures;

          if (!userStats[executeur.id]) {
            userStats[executeur.id] = {
              heures: 0,
              cout: 0,
              nom: `${executeur.nom} ${executeur.prenoms}`,
            };
          }

          userStats[executeur.id].heures += heures;
          userStats[executeur.id].cout += cout;
        }
      });
    });

    return Object.values(userStats);
  };

  // Filtrage des statistiques avec mémorisation
  const filteredStatistics = useMemo(() => {
    let stats =
      activeView === "user"
        ? calculateUserStatistics()
        : calculateAffaireStatistics();

    if (activeView === "user" && showAdvancedFilters) {
      if (advancedFilters.statut) {
        stats = stats.filter((stat) => stat.statut === advancedFilters.statut);
      }
      if (advancedFilters.typeActivite) {
        stats = stats.filter(
          (stat) => stat.typeActivite === advancedFilters.typeActivite
        );
      }
      if (advancedFilters.coutMin) {
        stats = stats.filter(
          (stat) => stat.total >= parseFloat(advancedFilters.coutMin)
        );
      }
      if (advancedFilters.coutMax) {
        stats = stats.filter(
          (stat) => stat.total <= parseFloat(advancedFilters.coutMax)
        );
      }
    }

    return stats;
  }, [filters, advancedFilters, activeView, showAdvancedFilters]);

  // Export Excel
  // const exportToExcel = (data: any[]) => {
  //   const ws = XLSX.utils.json_to_sheet(data);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Statistiques");
  //   XLSX.writeFile(
  //     wb,
  //     `statistiques_${activeView}_${new Date().toISOString()}.xlsx`
  //   );
  // };
  // const exportToExcel = (data: any[]) => {
  //   // Calcul des totaux
  //   const totalHeures = data.reduce(
  //     (sum, stat) => sum + parseFloat(stat.heures),
  //     0
  //   );
  //   const totalGeneral = data.reduce((sum, stat) => sum + stat.total, 0);

  //   // Ajout de la ligne des totaux
  //   const dataWithTotals = [
  //     ...data,
  //     {
  //       affaire: "TOTAUX",
  //       of: "",
  //       tacheFacturable: "",
  //       heures: totalHeures.toFixed(2),
  //       coefficient: "",
  //       total: totalGeneral.toFixed(2),
  //     },
  //   ];

  //   const ws = XLSX.utils.json_to_sheet(dataWithTotals);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Statistiques");
  //   XLSX.writeFile(
  //     wb,
  //     `statistiques_${activeView}_${new Date().toISOString()}.xlsx`
  //   );
  // };
  const exportToExcel = (data: any[]) => {
    let exportData;

    if (activeView === "user") {
      // Format pour les statistiques par utilisateur
      const totalHeures = data.reduce(
        (sum, stat) => sum + parseFloat(stat.heures),
        0
      );
      const totalGeneral = data.reduce((sum, stat) => sum + stat.total, 0);

      exportData = [
        ...data,
        {
          affaire: "TOTAUX",
          of: "",
          tacheFacturable: "",
          heures: totalHeures.toFixed(2),
          coefficient: "",
          total: totalGeneral.toFixed(2),
        },
      ];
    } else {
      // Format pour les statistiques par affaire
      const totalHeures = data.reduce((sum, stat) => sum + stat.heures, 0);
      const totalCout = data.reduce((sum, stat) => sum + stat.cout, 0);

      exportData = data.map((stat) => ({
        Utilisateur: stat.nom,
        "Heures totales": `${stat.heures.toFixed(2)} h`,
        "Coût total MO": `${stat.cout.toFixed(2)} €`,
      }));

      // Ajout de la ligne des totaux
      exportData.push({
        Utilisateur: "TOTAUX",
        "Heures totales": `${totalHeures.toFixed(2)} h`,
        "Coût total MO": `${totalCout.toFixed(2)} €`,
      });
    }

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Statistiques");
    XLSX.writeFile(
      wb,
      `statistiques_${activeView}_${new Date().toISOString()}.xlsx`
    );
  };

  // Rendu des filtres
  // const renderFilters = () => (
  //   <div className="card mb-5 mb-xl-8">
  //     <div className="card-body">
  //       <div className="row mb-6">
  //         <div className="col-lg-4 mb-4">
  //           <Select
  //             value={
  //               activeView === "user"
  //                 ? filters.selectedUser
  //                 : filters.selectedAffaire
  //             }
  //             onChange={(option) =>
  //               setFilters({
  //                 ...filters,
  //                 [activeView === "user" ? "selectedUser" : "selectedAffaire"]:
  //                   option,
  //               })
  //             }
  //             options={activeView === "user" ? users : affaires}
  //             placeholder={`Sélectionner ${
  //               activeView === "user" ? "un utilisateur" : "une affaire"
  //             }`}
  //             isClearable
  //           />
  //         </div>
  //         <div className="col-lg-4 mb-4">
  //           <DatePicker
  //             selected={filters.startDate}
  //             onChange={(date) => setFilters({ ...filters, startDate: date })}
  //             className="form-control"
  //             placeholderText="Date début"
  //           />
  //         </div>
  //         <div className="col-lg-4 mb-4">
  //           <DatePicker
  //             selected={filters.endDate}
  //             onChange={(date) => setFilters({ ...filters, endDate: date })}
  //             className="form-control"
  //             placeholderText="Date fin"
  //           />
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
  // Dans le composant renderFilters
  const renderFilters = () => (
    <div className="card mb-5 mb-xl-8">
      <div className="card-body">
        <div className="row mb-6">
          <div className="col-lg-4 mb-4">
            <Select
              value={
                activeView === "user"
                  ? filters.selectedUser
                  : filters.selectedAffaire
              }
              onChange={(option) =>
                setFilters({
                  ...filters,
                  [activeView === "user" ? "selectedUser" : "selectedAffaire"]:
                    option,
                })
              }
              options={activeView === "user" ? users : affaires}
              placeholder={`Sélectionner ${
                activeView === "user" ? "un utilisateur" : "une affaire"
              }`}
              isClearable
            />
          </div>
          <div className="col-lg-4 mb-4">
            <DatePicker
              selected={filters.startDate}
              onChange={(date) => setFilters({ ...filters, startDate: date })}
              className="form-control"
              placeholderText="Date début"
              dateFormat="dd MMM. yyyy"
              locale="fr"
            />
          </div>
          <div className="col-lg-4 mb-4">
            <DatePicker
              selected={filters.endDate}
              onChange={(date) => setFilters({ ...filters, endDate: date })}
              className="form-control"
              placeholderText="Date fin"
              dateFormat="dd MMM. yyyy"
              locale="fr"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Rendu des filtres avancés
  const renderAdvancedFilters = () => {
    if (!showAdvancedFilters) return null;

    return (
      <div className="card mb-5">
        <div className="card-body">
          <div className="row">
            <div className="col-md-3 mb-3">
              <label className="form-label">Statut</label>
              <select
                className="form-select"
                value={advancedFilters.statut}
                onChange={(e) =>
                  setAdvancedFilters({
                    ...advancedFilters,
                    statut: e.target.value,
                  })
                }
              >
                <option value="">Tous</option>
                <option value="Validé">Validé</option>
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
              </select>
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">Type d'activité</label>
              <select
                className="form-select"
                value={advancedFilters.typeActivite}
                onChange={(e) =>
                  setAdvancedFilters({
                    ...advancedFilters,
                    typeActivite: e.target.value,
                  })
                }
              >
                <option value="">Tous</option>
                <option value="Production">Production</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Étude">Étude</option>
              </select>
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">Coût minimum</label>
              <input
                type="number"
                className="form-control"
                value={advancedFilters.coutMin}
                onChange={(e) =>
                  setAdvancedFilters({
                    ...advancedFilters,
                    coutMin: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">Coût maximum</label>
              <input
                type="number"
                className="form-control"
                value={advancedFilters.coutMax}
                onChange={(e) =>
                  setAdvancedFilters({
                    ...advancedFilters,
                    coutMax: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // const renderUserStatisticsTable = () => {
  //   const statistics = calculateUserStatistics();
  //   const totalGeneral = statistics.reduce((sum, stat) => sum + stat.total, 0);
  //   const totalHeures = statistics.reduce(
  //     (sum, stat) => sum + parseFloat(stat.heures),
  //     0
  //   );

  //   // Grouper les statistiques par affaire
  //   const groupedByAffaire = statistics.reduce((acc: any, curr: any) => {
  //     if (!acc[curr.affaire]) {
  //       acc[curr.affaire] = [];
  //     }
  //     acc[curr.affaire].push(curr);
  //     return acc;
  //   }, {});

  //   const tableContent = (
  //     <div className="card card-xl-stretch mb-xl-8">
  //       <div className="card-header border-0 pt-5">
  //         <h3 className="card-title align-items-start flex-column">
  //           <span className="card-label fw-bold fs-3 mb-1">
  //             Statistiques par Utilisateur
  //           </span>
  //           <span className="text-muted mt-1 fw-semibold fs-7">
  //             Période du {filters.startDate?.toLocaleDateString()} au{" "}
  //             {filters.endDate?.toLocaleDateString()}
  //           </span>
  //         </h3>
  //         <div className="card-toolbar">
  //           <button
  //             className="btn btn-sm btn-light-primary"
  //             onClick={() => exportToExcel(statistics)}
  //           >
  //             <KTIcon iconName="file-down" className="fs-2" />
  //             Exporter Excel
  //           </button>
  //         </div>
  //       </div>
  //       <div className="card-body py-3">
  //         <div className="table-responsive">
  //           <table className="table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4">
  //             <thead>
  //               <tr className="fw-bold text-muted">
  //                 <th className="min-w-150px">Affaire</th>
  //                 <th className="min-w-140px">Ordre de fabrication</th>
  //                 <th className="min-w-200px">Tâche facturable</th>
  //                 <th className="min-w-100px">Heures</th>
  //                 <th className="min-w-100px">Coefficient</th>
  //                 <th className="min-w-120px">Total</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               {Object.entries(groupedByAffaire).map(
  //                 ([affaire, stats]: [string, any[]]) => {
  //                   let isFirstAffaire = true;
  //                   let isFirstCoefficient = true;
  //                   return stats.map((stat, index) => (
  //                     <tr key={index}>
  //                       {isFirstAffaire && (
  //                         <td rowSpan={stats.length}>{affaire}</td>
  //                       )}
  //                       <td>{stat.of}</td>
  //                       <td>
  //                         {stat.tacheFacturable} ({stat.coutHoraire}€/h)
  //                       </td>
  //                       <td>{parseFloat(stat.heures).toFixed(2)} h</td>
  //                       {isFirstCoefficient && (
  //                         <td rowSpan={statistics.length}>
  //                           {stat.coefficient}
  //                         </td>
  //                       )}
  //                       <td>{stat.total.toFixed(2)} €</td>
  //                     </tr>
  //                   ));
  //                 }
  //               )}
  //               <tr className="fw-bold">
  //                 <td colSpan={3} className="text-end">
  //                   Totaux :
  //                 </td>
  //                 <td>{totalHeures.toFixed(2)} h</td>
  //                 <td></td>
  //                 <td>{totalGeneral.toFixed(2)} €</td>
  //               </tr>
  //             </tbody>
  //           </table>
  //         </div>
  //       </div>
  //     </div>
  //   );

  //   return tableContent;
  // };

  const renderUserStatisticsTable = () => {
    const statistics = calculateUserStatistics();
    const totalGeneral = statistics.reduce((sum, stat) => sum + stat.total, 0);
    const totalHeures = statistics.reduce(
      (sum, stat) => sum + parseFloat(stat.heures),
      0
    );

    // Grouper les statistiques par affaire et OF
    const groupedStats = statistics.reduce((acc: any, curr: any) => {
      const affaireKey = curr.affaire;
      const ofKey = curr.of;

      if (!acc[affaireKey]) {
        acc[affaireKey] = {};
      }
      if (!acc[affaireKey][ofKey]) {
        acc[affaireKey][ofKey] = [];
      }

      acc[affaireKey][ofKey].push(curr);
      return acc;
    }, {});

    const tableContent = (
      <div className="card card-xl-stretch mb-xl-8">
        <div className="card-header border-0 pt-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bold fs-3 mb-1">
              Statistiques par Utilisateur
            </span>
            <span className="text-muted mt-1 fw-semibold fs-7">
              Période du {filters.startDate?.toLocaleDateString()} au{" "}
              {filters.endDate?.toLocaleDateString()}
            </span>
          </h3>
          <div className="card-toolbar">
            <button
              className="btn btn-sm btn-light-primary"
              onClick={() => exportToExcel(statistics)}
            >
              <KTIcon iconName="file-down" className="fs-2" />
              Exporter Excel
            </button>
          </div>
        </div>
        <div className="card-body py-3">
          <div className="table-responsive">
            <table className="table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4">
              {/* <thead>
                <tr className="fw-bold text-muted text-center">
                  <th className="min-w-150px text-start">Affaire</th>
                  <th className="min-w-140px text-start">Coefficient</th>
                  <th className="min-w-200px text-start">OF</th>
                  <th className="min-w-100px">Tâche facturable</th>
                  <th className="min-w-100px">Heures</th>
                  <th className="min-w-120px">Total</th>
                </tr>
              </thead> */}
              <thead>
                <tr className="fw-bold text-muted text-center">
                  <th className="min-w-150px text-start ps-4">Affaire</th>
                  <th className="min-w-140px text-start ps-4">Coefficient</th>
                  <th className="min-w-140px text-start ps-4">OF</th>
                  <th className="min-w-200px text-start">Tâche facturable</th>
                  <th className="min-w-100px">Heures</th>
                  <th className="min-w-120px">Total</th>
                </tr>
              </thead>
              <tbody>
                {(Object.entries(groupedStats) as [string, any][]).map(
                  ([affaire, ofs]) => {
                    const affaireRowSpan = Object.values(ofs).reduce(
                      (sum: number, tasks: any) => sum + tasks.length,
                      0
                    );
                    let affaireDisplayed = false;
                    let coefficientDisplayed = false;

                    return (Object.entries(ofs) as [string, any[]][])
                      .map(([of, tasks]) => {
                        return tasks.map((task, taskIndex) => {
                          const row = (
                            <tr key={`${affaire}-${of}-${taskIndex}`}>
                              {!affaireDisplayed && (
                                <>
                                  <td
                                    rowSpan={affaireRowSpan}
                                    className="align-middle"
                                  >
                                    {affaire}
                                  </td>
                                  <td
                                    rowSpan={affaireRowSpan}
                                    className="text-center align-middle"
                                  >
                                    {task.coefficient}
                                  </td>
                                </>
                              )}
                              <td className="align-middle">{of}</td>
                              <td className="align-middle">
                                {task.tacheFacturable} ({task.coutHoraire}€/h)
                              </td>
                              <td className="text-center align-middle">
                                {parseFloat(task.heures).toFixed(2)} h
                              </td>
                              <td className="text-center align-middle">
                                {task.total.toFixed(2)} €
                              </td>
                            </tr>
                          );

                          if (!affaireDisplayed) affaireDisplayed = true;

                          return row;
                        });
                      })
                      .flat();
                  }
                )}
                <tr className="fw-bold">
                  <td colSpan={4} className="text-end pe-5">
                    Totaux :
                  </td>
                  <td className="text-center">{totalHeures.toFixed(2)} h</td>
                  <td className="text-center">{totalGeneral.toFixed(2)} €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );

    return tableContent;
  };

  // Rendu du tableau des statistiques par affaire
  const renderAffaireStatisticsTable = () => {
    const statistics = calculateAffaireStatistics();
    const totalGeneral = statistics.reduce((sum, stat) => sum + stat.cout, 0);
    const totalHeures = statistics.reduce((sum, stat) => sum + stat.heures, 0);

    return (
      <div className="card card-xl-stretch mb-xl-8">
        <div className="card-header border-0 pt-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bold fs-3 mb-1">
              Statistiques par Affaire
            </span>
            <span className="text-muted mt-1 fw-semibold fs-7">
              Période du {filters.startDate?.toLocaleDateString()} au{" "}
              {filters.endDate?.toLocaleDateString()}
            </span>
          </h3>
          <div className="card-toolbar">
            <button
              className="btn btn-sm btn-light-primary"
              onClick={() => exportToExcel(statistics)}
            >
              <KTIcon iconName="file-down" className="fs-2" />
              Exporter Excel
            </button>
          </div>
        </div>
        <div className="card-body py-3">
          <div className="table-responsive">
            <table className="table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4">
              <thead>
                <tr className="fw-bold text-muted">
                  <th className="min-w-150px">Utilisateur</th>
                  <th className="min-w-140px">Heures totales</th>
                  <th className="min-w-140px">Coût total Main d'Oeuvre</th>
                </tr>
              </thead>
              <tbody>
                {statistics.map((stat, index) => (
                  <tr key={index}>
                    <td>{stat.nom}</td>
                    <td>{stat.heures.toFixed(2)} h</td>
                    <td>{stat.cout.toFixed(2)} €</td>
                  </tr>
                ))}
                <tr className="fw-bold">
                  <td className="text-end">Totaux :</td>
                  <td>{totalHeures.toFixed(2)} h</td>
                  <td>{totalGeneral.toFixed(2)} €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const usersBreadcrumbs: Array<PageLink> = [
    {
      title: "Edition Statistique par Utilisateurs et par Affaires",
      path: "/app/pages/administrateur/statistiques",
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

  // Rendu principal du composant
  return (
    <>
      <PageTitle breadcrumbs={usersBreadcrumbs}>Statistiques</PageTitle>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card mb-5 mb-xl-8">
            <div className="card-body">
              <div className="row">
                <div className="col-6">
                  <button
                    className={`btn btn-lg btn-light-primary w-100 ${
                      activeView === "user" ? "active" : ""
                    }`}
                    onClick={() => setActiveView("user")}
                  >
                    Statistique par Utilisateur
                  </button>
                </div>
                <div className="col-6">
                  <button
                    className={`btn btn-lg btn-light-primary w-100 ${
                      activeView === "affaire" ? "active" : ""
                    }`}
                    onClick={() => setActiveView("affaire")}
                  >
                    Statistique par Affaire
                  </button>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center p-5 mb-5">
              <KTIcon iconName="warning" className="fs-2hx text-danger me-4" />
              <div className="d-flex flex-column">
                <h4 className="mb-1 text-danger">Erreur</h4>
                <span>{error}</span>
              </div>
            </div>
          )}

          {renderFilters()}

          {/* {activeView === "user" && (
          <button
            className="btn btn-sm btn-light-primary mb-5"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <KTIcon
              iconName={showAdvancedFilters ? "minus" : "plus"}
              className="fs-2 me-2"
            />
            {showAdvancedFilters ? "Masquer" : "Afficher"} les filtres avancés
          </button>
        )} */}

          {showAdvancedFilters &&
            activeView === "user" &&
            renderAdvancedFilters()}

          {isLoading ? (
            <div className="d-flex justify-content-center align-items-center min-h-200px">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : (activeView === "user" &&
              filters.selectedUser &&
              filters.startDate &&
              filters.endDate) ||
            (activeView === "affaire" &&
              filters.selectedAffaire &&
              filters.startDate &&
              filters.endDate) ? (
            activeView === "user" ? (
              renderUserStatisticsTable()
            ) : (
              renderAffaireStatisticsTable()
            )
          ) : (
            <div className="alert alert-primary d-flex align-items-center p-5">
              <KTIcon
                iconName="information-5"
                className="fs-2hx text-primary me-4"
              />
              <div className="d-flex flex-column">
                <h4 className="mb-1 text-primary">
                  Veuillez remplir tous les filtres
                </h4>
                <span>
                  Sélectionnez{" "}
                  {activeView === "user" ? "un utilisateur" : "une affaire"} et
                  la période pour afficher les statistiques
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default StatistiquesPage;
