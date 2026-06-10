// import {FC} from 'react'
// import {User} from '../../core/_models'
// import {toAbsoluteUrl} from '../../../../../../../_metronic/helpers'

// type Props = {
//   user: User
// }
// const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'dark']

// const UserInfoCell: FC<Props> = ({user}) => (
//   <div className='d-flex align-items-center'>
//     {/* begin:: Avatar */}
//     <div className='symbol symbol-circle symbol-50px overflow-hidden me-3'>
//       <a href='#'>
//         {user.avatar ? (
//           <div className='symbol-label'>
//             <img src={toAbsoluteUrl(`media/${user.avatar}`)} alt={user.nom} className='w-100' />
//           </div>
//         ) : (
//           <div className='symbol-label fs-3 bg-light-danger text-danger'>
//             {user.nom.charAt(0)}
//           </div>
//         )}
//       </a>
//     </div>
//     <div className='d-flex flex-column'>
//       <a href='#' className='text-gray-800 text-hover-primary mb-1'>
//         {user.nom} {user.prenoms}
//       </a>
//       <span>{user.email}</span>
//     </div>
//   </div>
// )

// export {UserInfoCell}

import { FC, useMemo } from "react";
import { User } from "../../core/_models";
import { toAbsoluteUrl } from "../../../../../../../_metronic/helpers";

const colors = [
  "primary",
  "secondary",
  "success",
  "info",
  "warning",
  "danger",
  "dark",
];

type Props = {
  user: User;
};

const UserInfoCell: FC<{ user: User }> = ({ user }) => {
  console.log("User data:", user);

  const randomColor = useMemo(
    () => colors[Math.floor(Math.random() * colors.length)],
    []
  );

  return (
    <div className="d-flex align-items-center">
      <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
        {/* <a href="#">
          {user.avatar ? (
            <div className="symbol-label">
              <img
                src={toAbsoluteUrl(`media/${user.avatar}`)}
                alt={user.nom}
                className="w-100"
              />
            </div>
          ) : (
            <div
              className={`symbol-label fs-3 bg-light-${randomColor} text-${randomColor}`}
            >
              {user.nom.charAt(0)}
            </div>
          )}
        </a> */}
        {/* <a href="#">
          {user.avatar_url ? (
            <div className="symbol-label">
              <img
                src={user.avatar_url}
                alt={user.nom}
                className="w-100"
                onError={(e) => {
                  e.currentTarget.src = toAbsoluteUrl(
                    "media/avatars/blank.png"
                  );
                }}
              />
            </div>
          ) : (
            <div className={`symbol-label fs-3 bg-light-primary text-primary`}>
              {user.nom.charAt(0)}
            </div>
          )}
        </a> */}
        <a href="#">
          {user.avatar_url ? (
            <div className="symbol-label">
              <img
                src={user.avatar_url}
                alt={user.nom}
                className="w-100"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; // Éviter les boucles infinies
                  target.src = toAbsoluteUrl("media/avatars/blank.png");
                }}
              />
            </div>
          ) : (
            <div className="symbol-label fs-3 bg-light-primary text-primary">
              {user.nom.charAt(0).toUpperCase()}
            </div>
          )}
        </a>
      </div>
      <div className="d-flex flex-column">
        <a href="#" className="text-gray-800 text-hover-primary mb-1">
          {user.nom} {user.prenoms}
        </a>
        <span>{user.email}</span>
      </div>
    </div>
  );
};

export { UserInfoCell };
