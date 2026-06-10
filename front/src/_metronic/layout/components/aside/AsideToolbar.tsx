import { useAuth } from "../../../../app/modules/auth";
import { KTIcon, toAbsoluteUrl } from "../../../helpers";
import { HeaderUserMenu, Search } from "../../../partials";

const AsideToolbar = () => {
  const { currentUser } = useAuth();

  return (
    <>
      {/*begin::User*/}
      <div className="aside-user d-flex align-items-sm-center justify-content-center py-5">
        {/*begin::Symbol*/}
        {/* <div className="symbol symbol-50px">
          <img src={toAbsoluteUrl("media/avatars/300-1.jpg")} alt="" />
        </div> */}
        {/* <div className="symbol symbol-50px">
          {currentUser?.avatar_url ? (
            <img
              src={currentUser.avatar_url}
              alt={currentUser.nom}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = toAbsoluteUrl("media/avatars/blank.png");
              }}
            />
          ) : (
            <div className="symbol-label fs-3 bg-light-primary text-primary">
              {currentUser?.nom?.charAt(0).toUpperCase()}
            </div>
          )}
        </div> */}
        <div className="symbol symbol-50px">
          {currentUser?.avatar_url ? (
            <div className="symbol-label bg-white">
              {" "}
              {/* Ajout de bg-white */}
              <img
                src={currentUser.avatar_url}
                alt={currentUser.nom}
                className="w-100"
                style={{ borderRadius: "0.475rem" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = toAbsoluteUrl("media/avatars/blank.png");
                }}
              />
            </div>
          ) : (
            <div className="symbol-label fs-3 bg-light-primary text-primary">
              {currentUser?.nom?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        {/*end::Symbol*/}

        {/*begin::Wrapper*/}
        <div className="aside-user-info flex-row-fluid flex-wrap ms-5">
          {/*begin::Section*/}
          <div className="d-flex">
            {/*begin::Info*/}
            <div className="flex-grow-1 me-2">
              {/*begin::Username*/}
              <a
                href="#"
                className="text-white text-hover-primary fs-6 fw-bold"
              >
                {currentUser?.nom} {currentUser?.prenom}
              </a>
              {/*end::Username*/}

              {/*begin::Description*/}
              <span className="text-gray-600 fw-bold d-block fs-8 mb-1">
                {currentUser?.roles}
              </span>
              {/*end::Description*/}

              {/*begin::Label*/}
              <div className="d-flex align-items-center text-success fs-9">
                <span className="bullet bullet-dot bg-success me-1"></span>
                {currentUser?.actif} Actif
              </div>
              {/*end::Label*/}
            </div>
            {/*end::Info*/}

            {/*begin::User menu*/}
            <div className="me-n2">
              {/*begin::Action*/}
              <a
                href="#"
                className="btn btn-icon btn-sm btn-active-color-primary mt-n2"
                data-kt-menu-trigger="click"
                data-kt-menu-placement="bottom-start"
                data-kt-menu-overflow="false"
              >
                <KTIcon iconName="setting-2" className="text-muted fs-1" />
              </a>

              <HeaderUserMenu />
              {/*end::Action*/}
            </div>
            {/*end::User menu*/}
          </div>
          {/*end::Section*/}
        </div>
        {/*end::Wrapper*/}
      </div>
      {/*end::User*/}

      {/*begin::Aside search*/}
      <div className="aside-search py-5">
        {/* <?php Theme::getView('partials/search/_inline', array(
        'class' => 'w-100',
        'menu-placement' => 'bottom-start',
        'responsive' => 'false'
    ))?> */}
        <Search />
      </div>
      {/*end::Aside search*/}
    </>
  );
};

export { AsideToolbar };
