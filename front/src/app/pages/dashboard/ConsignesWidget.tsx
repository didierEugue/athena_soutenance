// import { FC } from "react";
// import { KTIcon } from "./../../../_metronic/helpers";

// interface Props {
//   className: string;
//   title: string;
//   total: number;
//   priorities: {
//     important_urgent: number;
//     important_non_urgent: number;
//     urgent_non_important: number;
//     non_urgent_non_important: number;
//   };
//   showAddButton?: boolean;
//   onAdd?: () => void;
// }

// const ConsignesWidget: FC<Props> = ({
//   className,
//   title,
//   total,
//   priorities,
//   showAddButton,
//   onAdd,
// }) => {
//   return (
//     <div className={`card ${className}`}>
//       <div className="card-body d-flex flex-column p-0">
//         <div className="d-flex align-items-center justify-content-between card-header border-0 py-5">
//           <h3 className="fw-bold m-0">
//             {title} ({total})
//           </h3>
//           {showAddButton && (
//             <button className="btn btn-icon btn-primary" onClick={onAdd}>
//               <KTIcon iconName="plus" className="fs-2" />
//             </button>
//           )}
//         </div>
//         <div className="d-flex flex-wrap px-5 pb-5">
//           <div className="d-flex flex-center w-50px h-50px rounded bg-danger me-3 mb-3">
//             <span className="text-white fw-bold">
//               {priorities.important_urgent}
//             </span>
//           </div>
//           <div className="d-flex flex-center w-50px h-50px rounded bg-warning me-3 mb-3">
//             <span className="text-white fw-bold">
//               {priorities.important_non_urgent}
//             </span>
//           </div>
//           <div className="d-flex flex-center w-50px h-50px rounded bg-info me-3 mb-3">
//             <span className="text-white fw-bold">
//               {priorities.urgent_non_important}
//             </span>
//           </div>
//           <div className="d-flex flex-center w-50px h-50px rounded bg-gray-300 mb-3">
//             <span className="text-gray-800 fw-bold">
//               {priorities.non_urgent_non_important}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export { ConsignesWidget };

// import { FC } from "react";
// import { KTIcon, toAbsoluteUrl } from "../../../_metronic/helpers";

// interface Props {
//   className: string;
//   title: string;
//   total: number;
//   priorities: {
//     important_urgent: number;
//     important_non_urgent: number;
//     urgent_non_important: number;
//     non_urgent_non_important: number;
//   };
//   showAddButton?: boolean;
//   onAdd?: () => void;
//   image?: string;
// }

// const ConsignesWidget: FC<Props> = ({
//   className,
//   title,
//   total,
//   priorities,
//   showAddButton,
//   onAdd,
//   image = "abstract-1.svg",
// }) => {
//   //   return (
//   //     <div
//   //       className={`card bgi-no-repeat ${className}`}
//   //       style={{
//   //         backgroundPosition: "right top",
//   //         backgroundSize: "30% auto",
//   //         backgroundImage: `url(${toAbsoluteUrl("media/svg/shapes/" + image)})`,
//   //       }}
//   //     >
//   //       <div className="card-body d-flex flex-column p-0">
//   //         <div className="d-flex align-items-center justify-content-between card-header border-0 py-5">
//   //           <h3 className="fw-bold m-0">
//   //             {title} ({total})
//   //           </h3>
//   //           {showAddButton && (
//   //             <button className="btn btn-icon btn-primary" onClick={onAdd}>
//   //               <KTIcon iconName="plus" className="fs-2" />
//   //             </button>
//   //           )}
//   //         </div>
//   //         <div className="d-flex flex-wrap px-5 pb-5">
//   //           {/* Important/Urgent - Rouge */}
//   //           <div
//   //             className="d-flex flex-center w-50px h-50px rounded bg-danger me-3 mb-3"
//   //             data-bs-toggle="tooltip"
//   //             title="Important/Urgent"
//   //           >
//   //             <span className="text-white fw-bold">
//   //               {priorities.important_urgent}
//   //             </span>
//   //           </div>

//   //           {/* Important/Non Urgent - Orange */}
//   //           <div
//   //             className="d-flex flex-center w-50px h-50px rounded bg-warning me-3 mb-3"
//   //             data-bs-toggle="tooltip"
//   //             title="Important/Non Urgent"
//   //           >
//   //             <span className="text-white fw-bold">
//   //               {priorities.important_non_urgent}
//   //             </span>
//   //           </div>

//   //           <div
//   //             className="d-flex flex-center w-50px h-50px rounded bg-light-warning me-3 mb-3"
//   //             data-bs-toggle="tooltip"
//   //             title="Urgent/Non Important"
//   //           >
//   //             <span className="text-warning fw-bold">
//   //               {priorities.urgent_non_important}
//   //             </span>
//   //           </div>

//   //           {/* Non Urgent/Non Important - Gris */}
//   //           <div
//   //             className="d-flex flex-center w-50px h-50px rounded bg-gray-400 mb-3"
//   //             data-bs-toggle="tooltip"
//   //             title="Non Urgent/Non Important"
//   //           >
//   //             <span className="text-white fw-bold">
//   //               {priorities.non_urgent_non_important}
//   //             </span>
//   //           </div>
//   //         </div>
//   //       </div>
//   //     </div>
//   //   );
//   return (
//     <div
//       className={`card bgi-no-repeat ${className}`}
//       style={{
//         backgroundPosition: "right top",
//         backgroundSize: "30% auto",
//         backgroundImage: `url(${toAbsoluteUrl("media/svg/shapes/" + image)})`,
//       }}
//     >
//       <div className="card-body d-flex flex-column p-0">
//         <div className="d-flex align-items-center justify-content-between card-header border-0 py-5">
//           <h3 className="fw-bold m-0">
//             {title} ({total})
//           </h3>
//           {showAddButton && (
//             <button className="btn btn-icon btn-primary" onClick={onAdd}>
//               <KTIcon iconName="plus" className="fs-2" />
//             </button>
//           )}
//         </div>
//         <div className="d-flex flex-wrap px-5 pb-5">
//           <div
//             className="d-flex flex-center w-50px h-50px rounded bg-danger me-3 mb-3 cursor-pointer"
//             onClick={() => onPriorityClick?.("important/urgent")}
//             data-bs-toggle="tooltip"
//             title="Important/Urgent"
//           >
//             <span className="text-white fw-bold">
//               {priorities.important_urgent}
//             </span>
//           </div>
//           <div
//             className="d-flex flex-center w-50px h-50px rounded bg-warning me-3 mb-3 cursor-pointer"
//             onClick={() => onPriorityClick?.("important/non_urgent")}
//             data-bs-toggle="tooltip"
//             title="Important/Non Urgent"
//           >
//             <span className="text-white fw-bold">
//               {priorities.important_non_urgent}
//             </span>
//           </div>
//           <div
//             className="d-flex flex-center w-50px h-50px rounded bg-light-warning me-3 mb-3 cursor-pointer"
//             onClick={() => onPriorityClick?.("urgent/non_important")}
//             data-bs-toggle="tooltip"
//             title="Urgent/Non Important"
//           >
//             <span className="text-warning fw-bold">
//               {priorities.urgent_non_important}
//             </span>
//           </div>
//           <div
//             className="d-flex flex-center w-50px h-50px rounded bg-gray-400 mb-3 cursor-pointer"
//             onClick={() => onPriorityClick?.("non_urgent/non_important")}
//             data-bs-toggle="tooltip"
//             title="Non Urgent/Non Important"
//           >
//             <span className="text-white fw-bold">
//               {priorities.non_urgent_non_important}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export { ConsignesWidget };

import { FC } from "react";
import { KTIcon, toAbsoluteUrl } from "../../../_metronic/helpers";

// interface Props {
//   className: string;
//   title: string;
//   total: number | string;
//   priorities: {
//     important_urgent: number;
//     important_non_urgent: number;
//     urgent_non_important: number;
//     non_urgent_non_important: number;
//   };
//   showAddButton?: boolean;
//   onAdd?: () => void;
//   image?: string;
//   onPriorityClick?: (priority: string) => void;
// }

// const ConsignesWidget: FC<Props> = ({
//   className,
//   title,
//   total,
//   priorities,
//   showAddButton,
//   onAdd,
//   image = "abstract-1.svg",
//   onPriorityClick,
// }) => {
//   const handlePriorityClick = (priority: string) => {
//     if (onPriorityClick) {
//       onPriorityClick(priority);
//     }
//   };

//   return (
//     <div
//       className={`card bgi-no-repeat ${className}`}
//       style={{
//         backgroundPosition: "right top",
//         backgroundSize: "30% auto",
//         backgroundImage: `url(${toAbsoluteUrl("media/svg/shapes/" + image)})`,
//       }}
//     >
//       <div className="card-body d-flex flex-column p-0">
//         <div className="d-flex align-items-center justify-content-between card-header border-0 py-5">
//           <h3 className="fw-bold m-0">
//             {title} ({total})
//           </h3>
//           {showAddButton && (
//             <button className="btn btn-icon btn-primary" onClick={onAdd}>
//               <KTIcon iconName="plus" className="fs-2" />
//             </button>
//           )}
//         </div>
//         <div className="d-flex flex-wrap px-5 pb-5">
//           <div
//             className="d-flex flex-center w-50px h-50px rounded bg-danger me-3 mb-3 cursor-pointer"
//             onClick={() => handlePriorityClick("important/urgent")}
//             data-bs-toggle="tooltip"
//             title="Important/Urgent"
//           >
//             <span className="text-white fw-bold">
//               {priorities.important_urgent}
//             </span>
//           </div>
//           <div
//             className="d-flex flex-center w-50px h-50px rounded bg-warning me-3 mb-3 cursor-pointer"
//             onClick={() => handlePriorityClick("important/non_urgent")}
//             data-bs-toggle="tooltip"
//             title="Important/Non Urgent"
//           >
//             <span className="text-white fw-bold">
//               {priorities.important_non_urgent}
//             </span>
//           </div>
//           <div
//             className="d-flex flex-center w-50px h-50px rounded bg-light-warning me-3 mb-3 cursor-pointer"
//             onClick={() => handlePriorityClick("urgent/non_important")}
//             data-bs-toggle="tooltip"
//             title="Urgent/Non Important"
//           >
//             <span className="text-warning fw-bold">
//               {priorities.urgent_non_important}
//             </span>
//           </div>
//           <div
//             className="d-flex flex-center w-50px h-50px rounded bg-gray-400 mb-3 cursor-pointer"
//             onClick={() => handlePriorityClick("non_urgent/non_important")}
//             data-bs-toggle="tooltip"
//             title="Non Urgent/Non Important"
//           >
//             <span className="text-white fw-bold">
//               {priorities.non_urgent_non_important}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
interface Props {
  className: string;
  title: string;
  total: string | number;
  showFinalized?: boolean;
  finalized?: {
    received: number;
    sent: number;
  };
  priorities?: {
    important_urgent: number;
    important_non_urgent: number;
    urgent_non_important: number;
    non_urgent_non_important: number;
  };
  showAddButton?: boolean;
  onAdd?: () => void;
  image?: string;
  onPriorityClick?: (priority: string) => void;
  onFinalizedClick?: (type: "received" | "sent") => void;
}

const ConsignesWidget: FC<Props> = ({
  className,
  title,
  total,
  showFinalized = false,
  finalized,
  priorities,
  showAddButton,
  onAdd,
  image = "abstract-1.svg",
  onPriorityClick,
  onFinalizedClick,
}) => {
  return (
    <div
      className={`card bgi-no-repeat ${className}`}
      style={{
        backgroundPosition: "right top",
        backgroundSize: "30% auto",
        backgroundImage: `url(${toAbsoluteUrl("media/svg/shapes/" + image)})`,
      }}
    >
      <div className="card-body d-flex flex-column p-0">
        <div className="d-flex align-items-center justify-content-between card-header border-0 py-5">
          <h3 className="fw-bold m-0">
            {title} ({total})
          </h3>
          {showAddButton && (
            <button className="btn btn-icon btn-primary" onClick={onAdd}>
              <KTIcon iconName="plus" className="fs-2" />
            </button>
          )}
        </div>
        <div className="d-flex flex-wrap px-5 pb-5">
          {!showFinalized && priorities && (
            <>
              <div
                className="d-flex flex-center w-50px h-50px rounded bg-danger me-3 mb-3 cursor-pointer"
                onClick={() => onPriorityClick?.("important/urgent")}
                data-bs-toggle="tooltip"
                title="Important/Urgent"
              >
                <span className="text-white fw-bold">
                  {priorities.important_urgent}
                </span>
              </div>
              <div
                className="d-flex flex-center w-50px h-50px rounded bg-warning me-3 mb-3 cursor-pointer"
                onClick={() => onPriorityClick?.("important/non_urgent")}
                data-bs-toggle="tooltip"
                title="Important/Non Urgent"
              >
                <span className="text-white fw-bold">
                  {priorities.important_non_urgent}
                </span>
              </div>
              <div
                className="d-flex flex-center w-50px h-50px rounded bg-light-warning me-3 mb-3 cursor-pointer"
                onClick={() => onPriorityClick?.("urgent/non_important")}
                data-bs-toggle="tooltip"
                title="Urgent/Non Important"
              >
                <span className="text-warning fw-bold">
                  {priorities.urgent_non_important}
                </span>
              </div>
              <div
                className="d-flex flex-center w-50px h-50px rounded bg-gray-400 mb-3 cursor-pointer"
                onClick={() => onPriorityClick?.("non_urgent/non_important")}
                data-bs-toggle="tooltip"
                title="Non Urgent/Non Important"
              >
                <span className="text-white fw-bold">
                  {priorities.non_urgent_non_important}
                </span>
              </div>
            </>
          )}

          {showFinalized && finalized && (
            <div className="d-flex justify-content-between w-100">
              <button
                className="btn btn-lg btn-light-primary me-3"
                onClick={() => onFinalizedClick?.("received")}
              >
                <span className="fw-bold">
                  Consignes Reçues ({finalized.received})
                </span>
              </button>
              <button
                className="btn btn-lg btn-light-success"
                onClick={() => onFinalizedClick?.("sent")}
              >
                <span className="fw-bold">
                  Consignes Envoyées ({finalized.sent})
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { ConsignesWidget };
