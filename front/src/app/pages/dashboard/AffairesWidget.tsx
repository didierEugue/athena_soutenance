// import { FC } from "react";
// import { KTIcon } from "../../../_metronic/helpers";

// interface Props {
//   className: string;
//   title: string;
//   count: string | number;
//   color: string;
//   icon: string;
// }

// const AffairesWidget: FC<Props> = ({
//   className,
//   title,
//   count,
//   color,
//   icon,
// }) => {
//   return (
//     <div className={`card ${className}`}>
//       <div className={`card-body d-flex flex-column p-0 bg-${color}`}>
//         <div className="d-flex flex-stack flex-grow-1 card-p">
//           <div className="d-flex flex-column me-2">
//             <span className="text-white fw-bold fs-3 mb-1">{count}</span>
//             <span className="text-white fw-semibold fs-6">{title}</span>
//           </div>
//           <div className="symbol symbol-50px">
//             <span className="symbol-label bg-white bg-opacity-10">
//               <KTIcon iconName={icon} className="fs-2x text-white" />
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export { AffairesWidget };

// import { FC } from "react";
// import { KTIcon } from "../../../_metronic/helpers";

// interface Props {
//   className: string;
//   title: string;
//   count: string | number;
//   color: string;
//   icon: string;
//   onClick?: () => void;
// }

// const AffairesWidget: FC<Props> = ({
//   className,
//   title,
//   count,
//   color,
//   icon,
// }) => {
//   return (
//     // <div className={`card ${className}`}>
//     <div
//       className={`card ${className} ${onClick ? "cursor-pointer" : ""}`}
//       onClick={onClick} // Utilisation directe de la prop onClick
//     >
//       <div className={`card-body d-flex flex-column p-0 rounded-3 bg-${color}`}>
//         <div className="d-flex flex-stack flex-grow-1 card-p">
//           <div className="d-flex flex-column me-2">
//             <span className="text-white fw-bold fs-3 mb-1">{count}</span>
//             <span className="text-white fw-semibold fs-6">{title}</span>
//           </div>
//           <div className="symbol symbol-50px">
//             <span className="symbol-label bg-white bg-opacity-10 rounded-circle">
//               <KTIcon iconName={icon} className="fs-2x text-white" />
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export { AffairesWidget };

import { FC } from "react";
import { KTIcon } from "../../../_metronic/helpers";

interface Props {
  className: string;
  title: string;
  count: string | number;
  color: string;
  icon: string;
  onClick?: () => void;
}

const AffairesWidget: FC<Props> = ({
  className,
  title,
  count,
  color,
  icon,
  onClick,
}) => {
  return (
    <div
      className={`card ${className} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <div className={`card-body d-flex flex-column p-0 rounded-3 bg-${color}`}>
        <div className="d-flex flex-stack flex-grow-1 card-p">
          <div className="d-flex flex-column me-2">
            <span className="text-white fw-bold fs-3 mb-1">{count}</span>
            <span className="text-white fw-semibold fs-6">{title}</span>
          </div>
          <div className="symbol symbol-50px">
            <span className="symbol-label bg-white bg-opacity-10 rounded-circle">
              <KTIcon iconName={icon} className="fs-2x text-white" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AffairesWidget };
