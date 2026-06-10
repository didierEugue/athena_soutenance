// import React, {FC} from 'react'
// import {
//   StatisticsWidget1,
//   StatisticsWidget2,
//   StatisticsWidget3,
//   StatisticsWidget4,
//   StatisticsWidget5,
//   StatisticsWidget6,
// } from '../../../../_metronic/partials/widgets'

// const StatistiquesPage: FC = () => {
//   return (
//     <>
//       {/* begin::Row */}
//       <div className='row g-5 g-xl-8'>
//         <div className='col-xl-4'>
//           <StatisticsWidget1
//             className='card-xl-stretch mb-xl-8'
//             image='abstract-4.svg'
//             title='Meeting Schedule'
//             time='3:30PM - 4:20PM'
//             description='Create a headline that is informative<br/>and will capture readers'
//           />
//         </div>

//         <div className='col-xl-4'>
//           <StatisticsWidget1
//             className='card-xl-stretch mb-xl-8'
//             image='abstract-2.svg'
//             title='Meeting Schedule'
//             time='03 May 2020'
//             description='Great blog posts don’t just happen Even the best bloggers need it'
//           />
//         </div>

//         <div className='col-xl-4'>
//           <StatisticsWidget1
//             className='card-xl-stretch mb-5 mb-xl-8'
//             image='abstract-1.svg'
//             title='UI Conference'
//             time='10AM Jan, 2021'
//             description='AirWays - A Front-end solution for airlines build with ReactJS'
//           />
//         </div>
//       </div>
//       {/* end::Row */}

//       {/* begin::Row */}
//       <div className='row g-5 g-xl-8'>
//         <div className='col-xl-4'>
//           <StatisticsWidget2
//             className='card-xl-stretch mb-xl-8'
//             avatar='media/svg/avatars/029-boy-11.svg'
//             title='Arthur Goldstain'
//             description='System & Software Architect'
//           />
//         </div>

//         <div className='col-xl-4'>
//           <StatisticsWidget2
//             className='card-xl-stretch mb-xl-8'
//             avatar='media/svg/avatars/014-girl-7.svg'
//             title='Lisa Bold'
//             description='Marketing & Fanance Manager'
//           />
//         </div>

//         <div className='col-xl-4'>
//           <StatisticsWidget2
//             className='card-xl-stretch mb-5 mb-xl-8'
//             avatar='media/svg/avatars/004-boy-1.svg'
//             title='Nick Stone'
//             description='Customer Support Team'
//           />
//         </div>
//       </div>
//       {/* end::Row */}

//       {/* begin::Row */}
//       <div className='row g-5 g-xl-8'>
//         <div className='col-xl-4'>
//           <StatisticsWidget3
//             className='card-xl-stretch mb-xl-8'
//             color='success'
//             title='Weekly Sales'
//             description='Your Weekly Sales Chart'
//             change='+100'
//           />
//         </div>

//         <div className='col-xl-4'>
//           <StatisticsWidget3
//             className='card-xl-stretch mb-xl-8'
//             color='danger'
//             title='Authors Progress'
//             description='Marketplace Authors Chart'
//             change='-260'
//           />
//         </div>

//         <div className='col-xl-4'>
//           <StatisticsWidget3
//             className='card-xl-stretch mb-5 mb-xl-8'
//             color='primary'
//             title='Sales Progress'
//             description='Marketplace Sales Chart'
//             change='+180'
//           />
//         </div>
//       </div>
//       {/* end::Row */}

//       {/* begin::Row */}
//       <div className='row g-5 g-xl-8'>
//         <div className='col-xl-4'>
//           <StatisticsWidget4
//             className='card-xl-stretch mb-xl-8'
//             svgIcon='basket'
//             color='info'
//             description='Sales Change'
//             change='+256'
//           />
//         </div>

//         <div className='col-xl-4'>
//           <StatisticsWidget4
//             className='card-xl-stretch mb-xl-8'
//             svgIcon='element-11'
//             color='success'
//             description='Weekly Income'
//             change='750$'
//           />
//         </div>

//         <div className='col-xl-4'>
//           <StatisticsWidget4
//             className='card-xl-stretch mb-5 mb-xl-8'
//             svgIcon='briefcase'
//             color='primary'
//             description='New Users'
//             change='+6.6K'
//           />
//         </div>
//       </div>
//       {/* end::Row */}

//       {/* begin::Row */}
//       <div className='row g-5 g-xl-8'>
//         <div className='col-xl-4'>
//           <StatisticsWidget5
//             className='card-xl-stretch mb-xl-8'
//             svgIcon='basket'
//             color='danger'
//             iconColor='white'
//             title='Shopping Cart'
//             titleColor='white'
//             description='Lands, Houses, Ranchos, Farms'
//             descriptionColor='white'
//           />
//         </div>

//         <div className='col-xl-4'>
//           <StatisticsWidget5
//             className='card-xl-stretch mb-xl-8'
//             svgIcon='cheque'
//             color='primary'
//             iconColor='white'
//             title='Appartments'
//             titleColor='white'
//             description='Flats, Shared Rooms, Duplex'
//             descriptionColor='white'
//           />
//         </div>

//         <div className='col-xl-4'>
//           <StatisticsWidget5
//             className='card-xl-stretch mb-5 mb-xl-8'
//             svgIcon='chart-simple-3'
//             color='success'
//             iconColor='white'
//             title='Sales Stats'
//             titleColor='white'
//             description='50% Increased for FY20'
//             descriptionColor='white'
//           />
//         </div>
//       </div>
//       {/* end::Row */}

//       {/* begin::Row */}
//       <div className='row g-5 g-xl-8'>
//         <div className='col-xl-3'>
//           <StatisticsWidget5
//             className='card-xl-stretch mb-xl-8'
//             svgIcon='chart-simple'
//             color='white'
//             iconColor='primary'
//             title='500M$'
//             description='SAP UI Progress'
//           />
//         </div>

//         <div className='col-xl-3'>
//           <StatisticsWidget5
//             className='card-xl-stretch mb-xl-8'
//             svgIcon='cheque'
//             color='dark'
//             iconColor='white'
//             title='+3000'
//             titleColor='white'
//             description='New Customers'
//             descriptionColor='white'
//           />
//         </div>

//         <div className='col-xl-3'>
//           <StatisticsWidget5
//             className='card-xl-stretch mb-xl-8'
//             svgIcon='briefcase'
//             color='warning'
//             iconColor='white'
//             title='$50,000'
//             titleColor='white'
//             description='Milestone Reached'
//             descriptionColor='white'
//           />
//         </div>

//         <div className='col-xl-3'>
//           <StatisticsWidget5
//             className='card-xl-stretch mb-5 mb-xl-8'
//             svgIcon='chart-pie-simple'
//             color='info'
//             iconColor='white'
//             title='$50,000'
//             titleColor='white'
//             description='Milestone Reached'
//             descriptionColor='white'
//           />
//         </div>
//       </div>
//       {/* end::Row */}

//       {/* begin::Row */}
//       <div className='row g-5 g-xl-8'>
//         <div className='col-xl-4'>
//           <StatisticsWidget6
//             className='card-xl-stretch mb-xl-8'
//             color='success'
//             title='Avarage'
//             description='Project Progress'
//             progress='50%'
//           />
//         </div>

//         <div className='col-xl-4'>
//           <StatisticsWidget6
//             className='card-xl-stretch mb-xl-8'
//             color='warning'
//             title='48k Goal'
//             description='Company Finance'
//             progress='15%'
//           />
//         </div>

//         <div className='col-xl-4'>
//           <StatisticsWidget6
//             className='card-xl-stretch mb-xl-8'
//             color='primary'
//             title='400k Impressions'
//             description='Marketing Analysis'
//             progress='76%'
//           />
//         </div>
//       </div>
//       {/* end::Row */}
//     </>
//   )
// }

// export {StatistiquesPage}
// export default StatistiquesPage

import React, { useState, useEffect, useMemo } from "react";
import { getUsers, getAffaires } from "../../../../services/api";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { KTIcon } from "../../../../_metronic/helpers";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { toast } from "react-toastify";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [usersData, affairesData] = await Promise.all([
          getUsers(),
          getAffaires(),
        ]);

        setUsers(
          usersData.map((user: any) => ({
            value: user.id,
            label: `${user.nom} ${user.prenoms}`,
            ...user,
          }))
        );

        setAffaires(
          affairesData["hydra:member"].map((affaire: any) => ({
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
          coefficient: coefficient,
          total: total,
          typeActivite: tache.type_activite,
          statut: tache.statut,
        });
      }
    });

    return statistics;
  };

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

  const exportToExcel = (data: any[]) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Statistiques");
    XLSX.writeFile(
      wb,
      `statistiques_${activeView}_${new Date().toISOString()}.xlsx`
    );
  };

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
            />
          </div>
          <div className="col-lg-4 mb-4">
            <DatePicker
              selected={filters.endDate}
              onChange={(date) => setFilters({ ...filters, endDate: date })}
              className="form-control"
              placeholderText="Date fin"
            />
          </div>
        </div>
      </div>
    </div>
  );

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

  const renderStatisticsTable = () => {
    const statistics = filteredStatistics;
    const totalGeneral = statistics.reduce(
      (sum, stat) => sum + (activeView === "user" ? stat.total : stat.cout),
      0
    );

    return (
      <div className="card card-xl-stretch mb-xl-8">
        <div className="card-header border-0 pt-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bold fs-3 mb-1">
              Statistiques{" "}
              {activeView === "user" ? "par Utilisateur" : "par Affaire"}
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
                  {activeView === "user" ? (
                    <>
                      <th className="min-w-150px">Affaire</th>
                      <th className="min-w-140px">Ordre de fabrication</th>
                      <th className="min-w-140px">Tâche facturable</th>
                      <th className="min-w-120px">Coefficient</th>
                      <th className="min-w-120px">Total</th>
                    </>
                  ) : (
                    <>
                      <th className="min-w-150px">Utilisateur</th>
                      <th className="min-w-140px">Heures totales</th>
                      <th className="min-w-140px">Coût total MO</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {statistics.map((stat, index) => (
                  <tr key={index}>
                    {activeView === "user" ? (
                      <>
                        <td>{stat.affaire}</td>
                        <td>{stat.of}</td>
                        <td>{stat.tacheFacturable}</td>
                        <td>{stat.coefficient}</td>
                        <td>{stat.total.toFixed(2)} €</td>
                      </>
                    ) : (
                      <>
                        <td>{stat.nom}</td>
                        <td>{stat.heures.toFixed(2)} h</td>
                        <td>{stat.cout.toFixed(2)} €</td>
                      </>
                    )}
                  </tr>
                ))}
                <tr className="fw-bold">
                  <td
                    colSpan={activeView === "user" ? 4 : 2}
                    className="text-end"
                  >
                    Total Général:
                  </td>
                  <td>{totalGeneral.toFixed(2)} €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
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

        {activeView === "user" && (
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
        )}

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
          renderStatisticsTable()
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
                {activeView === "user" ? "un utilisateur" : "une affaire"} et la
                période pour afficher les statistiques
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default StatistiquesPage;
