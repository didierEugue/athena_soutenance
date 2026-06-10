import React from "react";
import { AffaireTable } from "./AffaireTable";

const Affaire: React.FC = () => {
  return (
    <div className="card-body">
      <AffaireTable className="table-row-dashed table-row-gray-300 align-middle gs-0 gy-4" />
    </div>
  );
};

export { Affaire };
export default Affaire;
