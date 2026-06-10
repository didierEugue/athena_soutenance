// import { useIntl } from "react-intl";
// import { KTIcon } from "../../../helpers";
// import { AsideMenuItemWithSub } from "./AsideMenuItemWithSub";
// import { AsideMenuItem } from "./AsideMenuItem";

// export function AsideMenuMain() {
//   const intl = useIntl();

//   return (
//     <>
//       <AsideMenuItem
//         to="/dashboard"
//         icon="element-11"
//         title={intl.formatMessage({ id: "MENU.DASHBOARD" })}
//       />
//       {/* <AsideMenuItem to='/builder' icon='switch' title='Layout Builder' /> */}
//       <div className="menu-item">
//         <div className="menu-content pt-8 pb-2">
//           <span className="menu-section text-muted text-uppercase fs-8 ls-1">
//             Menu
//           </span>
//         </div>
//       </div>

//       {/* Menu Administrateur  */}
//       <AsideMenuItemWithSub
//         to="/app/pages/administrateur"
//         title="Administrateur"
//         icon="security-user"
//       >
//         <AsideMenuItem
//           to="/app/pages/administrateur/utilisateurs"
//           icon="user"
//           title="Utilisateur"
//           hasBullet={true}
//         />
//         <AsideMenuItem
//           to="/app/pages/administrateur/statistiques"
//           icon="chart-simple"
//           title="Statistique"
//           hasBullet={true}
//         />
//         <AsideMenuItem
//           to="/app/pages/administrateur/chiffrages"
//           icon="euro"
//           title="Chiffrage"
//           hasBullet={true}
//         />
//       </AsideMenuItemWithSub>

//       {/* Menu Paramètre Intranet  */}
//       <AsideMenuItemWithSub
//         to="/app/pages/parametreIntranet"
//         title="Paramètre Intranet"
//         icon="setting-3"
//       >
//         {/* <AsideMenuItem to='/app/pages/parametreIntranet/collaborateurs' icon='people' title='Collaborateur' hasBullet={true} /> */}
//         <AsideMenuItem
//           to="/app/pages/parametreIntranet/ateliers"
//           icon="wrench"
//           title="Atelier"
//           hasBullet={true}
//         />
//       </AsideMenuItemWithSub>

//       {/* Menu Ordre de Fabrication  */}
//       <AsideMenuItem
//         to="/app/pages/ordreFabrication"
//         icon="frame"
//         title="Ordre de Fabrications"
//       />

//       {/* Menu Rapport Journalier d'Activité  */}
//       <AsideMenuItem
//         to="/app/pages/rja"
//         icon="questionnaire-tablet"
//         title="Rapport Journalier"
//       />

//       {/* Menu Messagerie */}
//       <AsideMenuItemWithSub
//         to="/app/pages/messageries"
//         title="Messagerie Interne"
//         icon="directbox-default"
//       >
//         <AsideMenuItem
//           to="/app/pages/messageries/message-privee"
//           icon="message-text-2"
//           title="Messages Privés"
//           hasBullet={true}
//         />
//         <AsideMenuItem
//           to="/app/pages/messageries/message-groupee"
//           icon="messages"
//           title="Messages Groupés"
//           hasBullet={true}
//         />
//         {/* <AsideMenuItem to='/app/pages/messageries/contact' icon='address-book' title='Contact' hasBullet={true} /> */}
//       </AsideMenuItemWithSub>

//       {/* Menu Agenda */}
//       <AsideMenuItem to="/app/pages/agenda" icon="calendar" title="Agendas" />

//       {/* <AsideMenuItemWithSub to='/crafted/pages' title='Pages' icon='gift'>
//         <AsideMenuItemWithSub to='/crafted/pages/profile' title='Profile' hasBullet={true}>
//           <AsideMenuItem to='/crafted/pages/profile/overview' title='Overview' hasBullet={true} />
//           <AsideMenuItem to='/crafted/pages/profile/projects' title='Projects' hasBullet={true} />
//           <AsideMenuItem to='/crafted/pages/profile/campaigns' title='Campaigns' hasBullet={true} />
//           <AsideMenuItem to='/crafted/pages/profile/documents' title='Documents' hasBullet={true} />
//           <AsideMenuItem
//             to='/crafted/pages/profile/connections'
//             title='Connections'
//             hasBullet={true}
//           />
//         </AsideMenuItemWithSub>

//         <AsideMenuItemWithSub to='/crafted/pages/wizards' title='Wizards' hasBullet={true}>
//           <AsideMenuItem
//             to='/crafted/pages/wizards/horizontal'
//             title='Horizontal'
//             hasBullet={true}
//           />
//           <AsideMenuItem to='/crafted/pages/wizards/vertical' title='Vertical' hasBullet={true} />
//         </AsideMenuItemWithSub>
//       </AsideMenuItemWithSub>
//       <AsideMenuItemWithSub to='/crafted/accounts' title='Accounts' icon='profile-circle'>
//         <AsideMenuItem to='/crafted/account/overview' title='Overview' hasBullet={true} />
//         <AsideMenuItem to='/crafted/account/settings' title='Settings' hasBullet={true} />
//       </AsideMenuItemWithSub>
//       <AsideMenuItemWithSub to='/error' title='Errors' icon='cross-circle'>
//         <AsideMenuItem to='/error/404' title='Error 404' hasBullet={true} />
//         <AsideMenuItem to='/error/500' title='Error 500' hasBullet={true} />
//       </AsideMenuItemWithSub>*/}
//       {/* <AsideMenuItemWithSub
//         to="/crafted/widgets"
//         title="Widgets"
//         icon="element-plus"
//       >
//         <AsideMenuItem
//           to="/crafted/widgets/lists"
//           title="Lists"
//           hasBullet={true}
//         />
//         <AsideMenuItem
//           to="/crafted/widgets/statistics"
//           title="Statistics"
//           hasBullet={true}
//         />
//         <AsideMenuItem
//           to="/crafted/widgets/charts"
//           title="Charts"
//           hasBullet={true}
//         />
//         <AsideMenuItem
//           to="/crafted/widgets/mixed"
//           title="Mixed"
//           hasBullet={true}
//         />
//         <AsideMenuItem
//           to="/crafted/widgets/tables"
//           title="Tables"
//           hasBullet={true}
//         />
//         <AsideMenuItem
//           to="/crafted/widgets/feeds"
//           title="Feeds"
//           hasBullet={true}
//         />
//       </AsideMenuItemWithSub> */}
//       {/*<div className='menu-item'>
//         <div className='menu-content pt-8 pb-2'>
//           <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Apps</span>
//         </div>
//       </div>
//       <AsideMenuItemWithSub to='/apps/chat' title='Chat' icon='message-text-2'>
//         <AsideMenuItem to='/apps/chat/private-chat' title='Private Chat' hasBullet={true} />
//         <AsideMenuItem to='/apps/chat/group-chat' title='Group Chart' hasBullet={true} />
//         <AsideMenuItem to='/apps/chat/drawer-chat' title='Drawer Chart' hasBullet={true} />
//       </AsideMenuItemWithSub>
//       <AsideMenuItem to='/apps/user-management/users' icon='shield-tick' title='User management' />
//       <div className='menu-item'>
//         <div className='menu-content'>
//           <div className='separator mx-1 my-4'></div>
//         </div>
//       </div>
//       <div className='menu-item'>
//         <a
//           target='_blank'
//           className='menu-link'
//           href={import.meta.env.VITE_APP_PREVIEW_DOCS_URL + '/changelog'}
//         >
//           <span className='menu-icon'>
//             <KTIcon iconName='document' className='fs-2' />
//           </span>
//           <span className='menu-title'>Changelog {import.meta.env.VITE_APP_VERSION}</span>
//         </a>
//       </div> */}
//     </>
//   );
// }
import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { KTIcon } from "../../../helpers";
import { AsideMenuItemWithSub } from "./AsideMenuItemWithSub";
import { AsideMenuItem } from "./AsideMenuItem";
import { AuthModel, useAuth } from "../../../../app/modules/auth";

export const AsideMenuMain: FC = () => {
  const intl = useIntl();
  const { currentUser, setCurrentUser } = useAuth();

  // const hasAdminAccess = () => {
  //   console.log("Current user:", currentUser);
  //   console.log("Current user role:", currentUser?.role);
  //   const allowedRoles = ["Dir", "BET"];
  //   const hasAccess =
  //     currentUser?.role?.code && allowedRoles.includes(currentUser.role.code);
  //   console.log("Has access:", hasAccess);
  //   return hasAccess;
  // };
  const hasAdminAccess = () => {
    if (!currentUser?.role?.code) {
      console.log("Pas de rôle trouvé");
      return false;
    }

    const allowedRoles = ["Dir", "BET"];
    const hasAccess = allowedRoles.includes(currentUser.role.code);
    console.log("Rôle actuel:", currentUser.role.code);
    console.log("Accès autorisé:", hasAccess);

    return hasAccess;
  };

  const setAuth = (auth: AuthModel | undefined) => {
    if (auth && auth.user) {
      console.log("Setting auth with user:", auth.user);
      setCurrentUser(auth.user);
      localStorage.setItem("auth", JSON.stringify(auth));
    } else {
      setCurrentUser(undefined);
      localStorage.removeItem("auth");
    }
  };

  return (
    <>
      <AsideMenuItem
        to="/dashboard"
        icon="element-11"
        title={intl.formatMessage({ id: "MENU.DASHBOARD" })}
      />

      <div className="menu-item">
        <div className="menu-content pt-8 pb-2">
          <span className="menu-section text-muted text-uppercase fs-8 ls-1">
            Menu
          </span>
        </div>
      </div>

      {hasAdminAccess() && (
        <>
          <AsideMenuItemWithSub
            to="/app/pages/administrateur"
            title="Administrateur"
            icon="security-user"
          >
            <AsideMenuItem
              to="/app/pages/administrateur/utilisateurs"
              icon="user"
              title="Utilisateur"
              hasBullet={true}
            />
            <AsideMenuItem
              to="/app/pages/administrateur/statistiques"
              icon="chart-simple"
              title="Statistique"
              hasBullet={true}
            />
            <AsideMenuItem
              to="/app/pages/administrateur/chiffrages"
              icon="euro"
              title="Chiffrage"
              hasBullet={true}
            />
          </AsideMenuItemWithSub>

          <AsideMenuItemWithSub
            to="/app/pages/parametreIntranet"
            title="Paramètre Intranet"
            icon="setting-3"
          >
            <AsideMenuItem
              to="/app/pages/parametreIntranet/ateliers"
              icon="wrench"
              title="Atelier"
              hasBullet={true}
            />
          </AsideMenuItemWithSub>
        </>
      )}

      <AsideMenuItem
        to="/app/pages/ordreFabrication"
        icon="frame"
        title="Ordre de Fabrications"
      />

      <AsideMenuItem
        to="/app/pages/rja"
        icon="questionnaire-tablet"
        title="Rapport Journalier"
      />

      <AsideMenuItemWithSub
        to="/app/pages/messageries"
        title="Messagerie Interne"
        icon="directbox-default"
      >
        <AsideMenuItem
          to="/app/pages/messageries/message-privee"
          icon="message-text-2"
          title="Messages Privés"
          hasBullet={true}
        />
        <AsideMenuItem
          to="/app/pages/messageries/message-groupee"
          icon="messages"
          title="Messages Groupés"
          hasBullet={true}
        />
      </AsideMenuItemWithSub>

      <AsideMenuItem to="/app/pages/agenda" icon="calendar" title="Agendas" />
    </>
  );
};
