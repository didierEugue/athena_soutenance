import { FC } from "react";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";

type Props = {
  id: string;
  color?: string;
  avatar?: string;
  online?: boolean;
  name: string;
  job: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
};

const CardGroup: FC<Props> = ({
  id,
  color = "",
  avatar = "",
  online = false,
  name,
  job,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`card ${isSelected ? "border-primary" : ""}`}
      style={{ width: "200px", margin: "10px" }}
      onClick={() => onSelect(id)}
    >
      <div className="card-body d-flex flex-center flex-column p-9 text-center">
        <div className="mb-5">
          <div className="symbol symbol-75px symbol-circle">
            {avatar ? (
              <img alt="Pic" src={toAbsoluteUrl(avatar)} />
            ) : (
              <span
                className={`symbol-label bg-light-${color} text-${color} fs-5 fw-bolder`}
              >
                {name.charAt(0)}
              </span>
            )}
            {online && (
              <div className="symbol-badge bg-success start-100 top-100 border-4 h-15px w-15px ms-n3 mt-n3"></div>
            )}
          </div>
        </div>

        <a
          href="#"
          className="fs-4 text-gray-800 text-hover-primary fw-bolder mb-0"
        >
          {name}
        </a>

        <div className="fw-bold text-gray-500 mb-6">{job}</div>
      </div>
    </div>
  );
};

export { CardGroup };
