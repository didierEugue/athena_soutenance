// // AffaireDetailsModal.tsx
// import { FC, useEffect, useState } from "react";
// import { Modal } from "react-bootstrap";
// import { getChiffrages } from "../../../../services/api";

// interface Props {
//   show: boolean;
//   handleClose: () => void;
//   affaire: any;
// }

// const AffaireDetailsModal: FC<Props> = ({ show, handleClose, affaire }) => {
//   const [chiffrages, setChiffrages] = useState<any[]>([]);
//   const [totalChiffrages, setTotalChiffrages] = useState(0);
//   const [totalMainOeuvre, setTotalMainOeuvre] = useState(0);

//   useEffect(() => {
//     const fetchChiffrages = async () => {
//       if (affaire?.id) {
//         const response = await getChiffrages();
//         const affaireChiffrages = response.filter(
//           (chiffrage: any) => chiffrage.affaire.id === affaire.id
//         );
//         setChiffrages(affaireChiffrages);
//         calculerTotaux(affaireChiffrages);
//       }
//     };
//     fetchChiffrages();
//   }, [affaire]);

//   const calculerTotaux = (chiffragesData: any[]) => {
//     // Calcul du total des chiffrages
//     const totalChiff = chiffragesData.reduce(
//       (acc, chiffrage) => acc + parseFloat(chiffrage.cout),
//       0
//     );
//     setTotalChiffrages(totalChiff);

//     // Calcul du total de la main d'œuvre
//     let totalMO = 0;
//     affaire?.ordreFabrications?.forEach((of: any) => {
//       of.tacheParActivites?.forEach((tache: any) => {
//         if (tache.tache_facturable.facturable) {
//           const coefficient = parseFloat(
//             tache.executeur.role.coefficient_qualification
//           );
//           const heures = parseFloat(tache.duree);
//           const coutHoraire = parseFloat(tache.tache_facturable.cout_horaire);
//           totalMO += coefficient * heures * coutHoraire;
//         }
//       });
//     });
//     setTotalMainOeuvre(totalMO);
//   };

//   return (
//     <Modal show={show} onHide={handleClose} size="lg" centered>
//       <Modal.Header closeButton>
//         <Modal.Title>Détails de l'affaire {affaire?.numero}</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <div className="card mb-5">
//           <div className="card-body">
//             <h4 className="mb-4">Informations générales</h4>
//             <div className="row mb-2">
//               <div className="col-6">
//                 <strong>Nom:</strong> {affaire?.nom}
//               </div>
//               <div className="col-6">
//                 <strong>Client:</strong> {affaire?.client?.nom}
//               </div>
//             </div>
//             <div className="row">
//               <div className="col-6">
//                 <strong>Date création:</strong>{" "}
//                 {new Date(affaire?.date_creation).toLocaleDateString()}
//               </div>
//               <div className="col-6">
//                 <strong>Date clôture:</strong>{" "}
//                 {new Date(affaire?.date_cloture).toLocaleDateString()}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="card mb-5">
//           <div className="card-body">
//             <h4 className="mb-4">Détails des coûts</h4>

//             <h5 className="text-muted mb-3">Chiffrages</h5>
//             <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
//               <thead>
//                 <tr className="fw-bold text-muted">
//                   <th>Type</th>
//                   <th>Coût</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {chiffrages.map((chiffrage) => (
//                   <tr key={chiffrage.id}>
//                     <td>{chiffrage.type.nom}</td>
//                     <td>{parseFloat(chiffrage.cout).toFixed(2)} €</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <h5 className="text-muted mb-3 mt-5">Main d'œuvre</h5>
//             <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
//               <thead>
//                 <tr className="fw-bold text-muted">
//                   <th>OF</th>
//                   <th>Tâche</th>
//                   <th>Exécutant</th>
//                   <th>Durée</th>
//                   <th>Coût</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {affaire?.ordreFabrications?.map((of: any) =>
//                   of.tacheParActivites
//                     ?.filter((tache: any) => tache.tache_facturable.facturable)
//                     .map((tache: any) => {
//                       const cout =
//                         parseFloat(
//                           tache.executeur.role.coefficient_qualification
//                         ) *
//                         parseFloat(tache.duree) *
//                         parseFloat(tache.tache_facturable.cout_horaire);
//                       return (
//                         <tr key={tache.id}>
//                           <td>{of.numero}</td>
//                           <td>{tache.tache_facturable.nom}</td>
//                           <td>{`${tache.executeur.nom} ${tache.executeur.prenoms}`}</td>
//                           <td>{tache.duree}h</td>
//                           <td>{cout.toFixed(2)} €</td>
//                         </tr>
//                       );
//                     })
//                 )}
//               </tbody>
//             </table>

//             <div className="border-top pt-4 mt-4">
//               <div className="row">
//                 <div className="col-6">
//                   <h5>Total Chiffrages:</h5>
//                   <h3 className="text-primary">
//                     {totalChiffrages.toFixed(2)} €
//                   </h3>
//                 </div>
//                 <div className="col-6">
//                   <h5>Total Main d'œuvre:</h5>
//                   <h3 className="text-primary">
//                     {totalMainOeuvre.toFixed(2)} €
//                   </h3>
//                 </div>
//               </div>
//               <div className="text-end mt-4">
//                 <h4>
//                   Total Général:{" "}
//                   <span className="text-primary fw-bolder fs-1">
//                     {(totalChiffrages + totalMainOeuvre).toFixed(2)} €
//                   </span>
//                 </h4>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export { AffaireDetailsModal };

import { FC, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { KTIcon } from "../../../../_metronic/helpers";
import { getChiffrages } from "../../../../services/api";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface Props {
  show: boolean;
  handleClose: () => void;
  affaire: any;
}

const AffaireDetailsModal: FC<Props> = ({ show, handleClose, affaire }) => {
  const [chiffrages, setChiffrages] = useState<any[]>([]);
  const [totalChiffrages, setTotalChiffrages] = useState(0);
  const [totalMainOeuvre, setTotalMainOeuvre] = useState(0);

  useEffect(() => {
    const fetchChiffrages = async () => {
      if (affaire?.id) {
        const response = await getChiffrages();
        const affaireChiffrages = response.filter(
          (chiffrage: any) => chiffrage.affaire.id === affaire.id
        );
        setChiffrages(affaireChiffrages);
        calculerTotaux(affaireChiffrages);
      }
    };
    fetchChiffrages();
  }, [affaire]);

  const calculerTotaux = (chiffragesData: any[]) => {
    const totalChiff = chiffragesData.reduce(
      (acc, chiffrage) => acc + parseFloat(chiffrage.cout),
      0
    );
    setTotalChiffrages(totalChiff);

    let totalMO = 0;
    affaire?.ordreFabrications?.forEach((of: any) => {
      of.tacheParActivites?.forEach((tache: any) => {
        if (tache.tache_facturable.facturable) {
          const coefficient = parseFloat(
            tache.executeur.role.coefficient_qualification
          );
          const heures = parseFloat(tache.duree);
          const coutHoraire = parseFloat(tache.tache_facturable.cout_horaire);
          totalMO += coefficient * heures * coutHoraire;
        }
      });
    });
    setTotalMainOeuvre(totalMO);
  };

  //   const handlePrint = () => {
  //     const doc = new jsPDF();

  //     // En-tête - Informations société
  //     doc.setFontSize(12);
  //     doc.text("Société Athena-OI", 20, 20);
  //     doc.text("Siège : La Réunion", 20, 30);

  //     // En-tête - Informations client
  //     doc.text(`Doit à ${affaire?.client?.nom}`, 120, 20);
  //     doc.text(`Email: ${affaire?.client?.email}`, 120, 30);
  //     doc.text(`Tél: ${affaire?.client?.telephone}`, 120, 40);
  //     doc.text(`Adresse: ${affaire?.client?.adresse}`, 120, 50);

  //     // Date d'impression
  //     const dateOptions: Intl.DateTimeFormatOptions = {
  //       weekday: "long",
  //       year: "numeric",
  //       month: "long",
  //       day: "numeric",
  //     };
  //     const dateStr = new Date().toLocaleDateString("fr-FR", dateOptions);
  //     doc.text(dateStr, 20, 70);

  //     // Informations de l'affaire
  //     doc.setFontSize(14);
  //     doc.text(`Affaire N° ${affaire?.numero}`, 20, 90);

  //     // Tableau des chiffrages
  //     doc.setFontSize(12);
  //     doc.text("Détail des chiffrages", 20, 110);
  //     const chiffragesData = chiffrages.map((chiffrage) => [
  //       chiffrage.type.nom,
  //       `${parseFloat(chiffrage.cout).toFixed(2)} €`,
  //     ]);
  //     doc.autoTable({
  //       startY: 120,
  //       head: [["Type", "Coût"]],
  //       body: chiffragesData,
  //     });

  //     // Tableau de la main d'œuvre
  //     doc.text(
  //       "Détail de la main d'œuvre",
  //       20,
  //       doc.autoTable.previous.finalY + 20
  //     );
  //     const mainOeuvreData: any[] = [];
  //     affaire?.ordreFabrications?.forEach((of: any) => {
  //       of.tacheParActivites
  //         ?.filter((tache: any) => tache.tache_facturable.facturable)
  //         .forEach((tache: any) => {
  //           const cout =
  //             parseFloat(tache.executeur.role.coefficient_qualification) *
  //             parseFloat(tache.duree) *
  //             parseFloat(tache.tache_facturable.cout_horaire);
  //           mainOeuvreData.push([
  //             of.numero,
  //             tache.tache_facturable.nom,
  //             `${tache.executeur.nom} ${tache.executeur.prenoms}`,
  //             `${tache.duree}h`,
  //             `${cout.toFixed(2)} €`,
  //           ]);
  //         });
  //     });
  //     doc.autoTable({
  //       startY: doc.autoTable.previous.finalY + 30,
  //       head: [["OF", "Tâche", "Exécutant", "Durée", "Coût"]],
  //       body: mainOeuvreData,
  //     });

  //     // Totaux
  //     const finalY = doc.autoTable.previous.finalY + 20;
  //     doc.text(`Total Chiffrages: ${totalChiffrages.toFixed(2)} €`, 20, finalY);
  //     doc.text(
  //       `Total Main d'œuvre: ${totalMainOeuvre.toFixed(2)} €`,
  //       20,
  //       finalY + 10
  //     );
  //     doc.setFontSize(14);
  //     doc.text(
  //       `Total Général: ${(totalChiffrages + totalMainOeuvre).toFixed(2)} €`,
  //       20,
  //       finalY + 30
  //     );

  //     doc.save(`Recu_${affaire?.numero}.pdf`);
  //   };

  const handlePrint = () => {
    const doc = new jsPDF();

    // Configuration de la police
    doc.setFont("times", "normal");
    doc.setFontSize(12);

    // En-tête avec logo et informations société
    doc.setFontSize(16);
    doc.setFont("times", "bold");
    doc.text("Société Athena-OI", 20, 20);
    doc.setFontSize(12);
    doc.setFont("times", "normal");
    doc.text("Siège : La Réunion", 20, 30);

    // Ligne de séparation décorative
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Informations client
    doc.setFont("times", "bold");
    doc.text("FACTURÉ À:", 120, 20);
    doc.setFont("times", "normal");
    doc.text(`${affaire?.client?.nom}`, 120, 30);
    doc.text(`Email: ${affaire?.client?.email}`, 120, 40);
    doc.text(`Tél: ${affaire?.client?.telephone}`, 120, 50);
    doc.text(`Adresse: ${affaire?.client?.adresse}`, 120, 60);

    // Date d'impression élégante
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const dateStr = new Date().toLocaleDateString("fr-FR", dateOptions);
    doc.text(`Date: ${dateStr}`, 20, 80);

    // Référence de l'affaire
    doc.setFontSize(14);
    doc.setFont("times", "bold");
    doc.text(`Affaire N° ${affaire?.numero}`, 20, 100);
    doc.text(`${affaire?.nom}`, 20, 110);

    // Tableau des chiffrages
    doc.setFontSize(12);
    doc.text("DÉTAIL DES CHIFFRAGES", 20, 130);
    const chiffragesData = chiffrages.map((chiffrage) => [
      chiffrage.type.nom,
      `${parseFloat(chiffrage.cout).toFixed(2)} €`,
    ]);
    (doc as any).autoTable({
      startY: 140,
      head: [["Description", "Montant"]],
      body: chiffragesData,
      styles: { font: "times", fontSize: 12 },
      headStyles: { fillColor: [60, 60, 60] },
    });

    // Tableau de la main d'œuvre
    doc.setFont("times", "bold");
    doc.text(
      "DÉTAIL DE LA MAIN D'ŒUVRE",
      20,
      (doc as any).autoTable.previous.finalY + 20
    );
    const mainOeuvreData: any[] = [];
    affaire?.ordreFabrications?.forEach((of: any) => {
      of.tacheParActivites
        ?.filter((tache: any) => tache.tache_facturable.facturable)
        .forEach((tache: any) => {
          const cout =
            parseFloat(tache.executeur.role.coefficient_qualification) *
            parseFloat(tache.duree) *
            parseFloat(tache.tache_facturable.cout_horaire);
          mainOeuvreData.push([
            of.nom,
            tache.tache_facturable.nom,
            `${tache.duree}h`,
            `${cout.toFixed(2)} €`,
          ]);
        });
    });
    (doc as any).autoTable({
      startY: (doc as any).autoTable.previous.finalY + 30,
      head: [["Ordre de fabrication", "Tâche", "Durée", "Montant"]],
      body: mainOeuvreData,
      styles: { font: "times", fontSize: 12 },
      headStyles: { fillColor: [60, 60, 60] },
    });

    // Résumé des totaux
    // const finalY = doc.autoTable.previous.finalY + 20;
    // doc.setDrawColor(200, 200, 200);
    // doc.setFillColor(250, 250, 250);
    // doc.rect(120, finalY, 70, 40, "F");
    const finalY = (doc as any).autoTable.previous.finalY + 20;
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(250, 250, 250);
    doc.rect(100, finalY, 90, 50, "F");

    // doc.setFont("times", "normal");
    // doc.text(`Total Chiffrages:`, 125, finalY + 10);
    // doc.text(`Total MO:`, 125, finalY + 20);
    doc.setFont("times", "normal");
    doc.text(`Total Chiffrages:`, 105, finalY + 15);
    doc.text(`Total Main d'œuvre:`, 105, finalY + 30);

    // doc.setFont("times", "bold");
    // doc.text(`${totalChiffrages.toFixed(2)} €`, 170, finalY + 10, {
    //   align: "right",
    // });
    // doc.text(`${totalMainOeuvre.toFixed(2)} €`, 170, finalY + 20, {
    //   align: "right",
    // });
    doc.setFont("times", "bold");
    doc.text(`${totalChiffrages.toFixed(2)} €`, 180, finalY + 15, {
      align: "right",
    });
    doc.text(`${totalMainOeuvre.toFixed(2)} €`, 180, finalY + 30, {
      align: "right",
    });

    // doc.setLineWidth(0.5);
    // doc.line(125, finalY + 25, 185, finalY + 25);
    doc.setLineWidth(0.5);
    doc.line(105, finalY + 35, 185, finalY + 35);

    // doc.setFontSize(14);
    // doc.text(`TOTAL:`, 125, finalY + 35);
    // doc.text(
    //   `${(totalChiffrages + totalMainOeuvre).toFixed(2)} €`,
    //   170,
    //   finalY + 35,
    //   { align: "right" }
    // );

    // Pied de page
    const pageHeight = doc.internal.pageSize.height;
    // doc.setFontSize(10);
    // doc.setFont("times", "italic");

    doc.setFontSize(14);
    doc.text(`TOTAL:`, 105, finalY + 45);
    doc.text(
      `${(totalChiffrages + totalMainOeuvre).toFixed(2)} €`,
      180,
      finalY + 45,
      { align: "right" }
    );

    doc.text("Merci de votre confiance", 50, pageHeight - 20, {
      align: "center",
    });

    doc.save(`Recu_${affaire?.numero}.pdf`);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Détails de l'affaire {affaire?.numero}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="card mb-5">
          <div className="card-body">
            <h4 className="mb-4">Informations générales</h4>
            <div className="row mb-2">
              <div className="col-6">
                <strong>Nom:</strong> {affaire?.nom}
              </div>
              <div className="col-6">
                <strong>Client:</strong> {affaire?.client?.nom}
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <strong>Date création:</strong>{" "}
                {new Date(affaire?.date_creation).toLocaleDateString()}
              </div>
              <div className="col-6">
                <strong>Date clôture:</strong>{" "}
                {new Date(affaire?.date_cloture).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-5">
          <div className="card-body">
            <h4 className="mb-4">Détails des coûts</h4>

            <h5 className="text-muted mb-3">Chiffrages</h5>
            <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
              <thead>
                <tr className="fw-bold text-muted">
                  <th>Type</th>
                  <th>Coût</th>
                </tr>
              </thead>
              <tbody>
                {chiffrages.map((chiffrage) => (
                  <tr key={chiffrage.id}>
                    <td>{chiffrage.type.nom}</td>
                    <td>{parseFloat(chiffrage.cout).toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h5 className="text-muted mb-3 mt-5">Main d'œuvre</h5>
            <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
              <thead>
                <tr className="fw-bold text-muted">
                  <th>OF</th>
                  <th>Tâche</th>
                  <th>Exécutant</th>
                  <th>Durée</th>
                  <th>Coût</th>
                </tr>
              </thead>
              <tbody>
                {affaire?.ordreFabrications?.map((of: any) =>
                  of.tacheParActivites
                    ?.filter((tache: any) => tache.tache_facturable.facturable)
                    .map((tache: any) => {
                      const cout =
                        parseFloat(
                          tache.executeur.role.coefficient_qualification
                        ) *
                        parseFloat(tache.duree) *
                        parseFloat(tache.tache_facturable.cout_horaire);
                      return (
                        <tr key={tache.id}>
                          <td>{of.numero}</td>
                          <td>{tache.tache_facturable.nom}</td>
                          <td>{`${tache.executeur.nom} ${tache.executeur.prenoms}`}</td>
                          <td>{tache.duree}h</td>
                          <td>{cout.toFixed(2)} €</td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>

            <div className="border-top pt-4 mt-4">
              <div className="row">
                <div className="col-6">
                  <h5>Total Chiffrages:</h5>
                  <h3 className="text-primary">
                    {totalChiffrages.toFixed(2)} €
                  </h3>
                </div>
                <div className="col-6">
                  <h5>Total Main d'œuvre:</h5>
                  <h3 className="text-primary">
                    {totalMainOeuvre.toFixed(2)} €
                  </h3>
                </div>
              </div>
              <div className="text-end mt-4">
                <h4>
                  Total Général:{" "}
                  <span className="text-primary fw-bolder fs-1">
                    {(totalChiffrages + totalMainOeuvre).toFixed(2)} €
                  </span>
                </h4>
              </div>
            </div>
          </div>
        </div>

        <div className="text-end mt-5">
          <button className="btn btn-primary" onClick={handlePrint}>
            <KTIcon iconName="printer" className="fs-2 me-2" />
            Imprimer le reçu
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export { AffaireDetailsModal };
