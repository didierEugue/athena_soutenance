import { FC } from "react";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";

type Props = {
  color?: string;
  avatar?: string;
  online?: boolean;
  name: string;
  job: string;
};

const Card1: FC<Props> = ({
  color = "",
  avatar = "",
  online = false,
  name,
  job,
}) => {
  return (
    <div className="card w-75">
      <div className="card-body d-flex flex-center flex-column p-9">
        <div className="mb-5">
          <div className="symbol symbol-75px symbol-circle">
            {color ? (
              <span
                className={`symbol-label bg-light-${color} text-${color} fs-5 fw-bolder`}
              >
                {name.charAt(0)}
              </span>
            ) : (
              <img alt="Pic" src={toAbsoluteUrl(avatar)} />
            )}
            {online && (
              <div className="symbol-badge bg-success start-100 top-100 border-4 h-15px w-15px ms-n3 mt-n3"></div>
            )}
          </div>
        </div>

        <a
          href="#"
          className="fs-4 text-gray-800 text-hover-primary fw-bolder mb-0 text-center"
        >
          {name}
        </a>

        <div className="fw-bold text-gray-500 mb-6 text-center">{job}</div>

        {/* <button
          className="btn btn-sm btn-light-primary fw-bolder"
          id="kt_drawer_chat_toggle"
        >
          Discuter
        </button> */}
        <button
          className="btn btn-sm btn-light-primary fw-bolder"
          // Suppression de l'ID qui causait l'ouverture du drawer
        >
          Discuter
        </button>
      </div>
    </div>
  );
};

export { Card1 };
