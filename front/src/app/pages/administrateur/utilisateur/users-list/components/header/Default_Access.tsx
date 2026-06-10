import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { KTIcon } from "../../../../../../../_metronic/helpers";

interface MenuItem {
  id: string;
  name: string;
  checked: boolean;
  functions: { id: string; name: string; checked: boolean }[];
  subMenus: { id: string; name: string; checked: boolean }[];
}

const initialMenus: MenuItem[] = [
  {
    id: "menu1",
    name: "Menu 1",
    checked: false,
    functions: [
      { id: "create1", name: "Créer", checked: false },
      { id: "read1", name: "Lire", checked: false },
      { id: "update1", name: "Modifier", checked: false },
      { id: "delete1", name: "Supprimer", checked: false },
    ],
    subMenus: [
      { id: "submenu1_1", name: "Sous-menu 1.1", checked: false },
      { id: "submenu1_2", name: "Sous-menu 1.2", checked: false },
    ],
  },
  // Ajoutez les 6 autres menus de la même manière
];

const DefaultAccess: React.FC<{ show: boolean; onHide: () => void }> = ({
  show,
  onHide,
}) => {
  const [menus, setMenus] = useState<MenuItem[]>(initialMenus);

  const handleCheck = (
    menuId: string,
    type: "menu" | "function" | "submenu",
    itemId?: string
  ) => {
    setMenus((prevMenus) => {
      return prevMenus.map((menu) => {
        if (menu.id === menuId) {
          let newMenu = { ...menu };

          if (type === "menu") {
            const newChecked = !menu.checked;
            newMenu = {
              ...newMenu,
              checked: newChecked,
              functions: newMenu.functions.map((f) => ({
                ...f,
                checked: newChecked,
              })),
              subMenus: newMenu.subMenus.map((s) => ({
                ...s,
                checked: newChecked,
              })),
            };
          } else if (type === "function" || type === "submenu") {
            const targetArray =
              type === "function" ? newMenu.functions : newMenu.subMenus;
            const updatedArray = targetArray.map((item) =>
              item.id === itemId ? { ...item, checked: !item.checked } : item
            );

            if (type === "function") {
              newMenu.functions = updatedArray;
            } else {
              newMenu.subMenus = updatedArray;
              if (updatedArray.some((item) => item.checked)) {
                newMenu.functions = newMenu.functions.map((f) => ({
                  ...f,
                  checked: true,
                }));
              } else {
                // Si tous les sous-menus sont décochés, décocher toutes les fonctions
                newMenu.functions = newMenu.functions.map((f) => ({
                  ...f,
                  checked: false,
                }));
              }
            }

            const anyFunctionChecked = newMenu.functions.some((f) => f.checked);
            const anySubMenuChecked = newMenu.subMenus.some((s) => s.checked);
            newMenu.checked = anyFunctionChecked || anySubMenuChecked;
          }

          return newMenu;
        }
        return menu;
      });
    });
  };

  const handleSave = () => {
    // Logique pour sauvegarder les accès
    console.log("Accès sauvegardés:", menus);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Accès par défaut</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {menus.map((menu) => (
          <div key={menu.id} className="mb-6">
            <div className="form-check form-switch form-check-custom form-check-solid">
              <input
                className="form-check-input"
                type="checkbox"
                checked={menu.checked}
                onChange={() => handleCheck(menu.id, "menu")}
              />
              <label className="form-check-label fw-bold fs-5">
                {menu.name}
              </label>
            </div>
            <div className="ms-20 mt-3">
              <div className="d-flex flex-column">
                <div className="mb-3">
                  {menu.functions.map((func) => (
                    <div
                      key={func.id}
                      className="form-check form-switch form-check-custom form-check-solid me-15 d-inline-block"
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={func.checked}
                        onChange={() =>
                          handleCheck(menu.id, "function", func.id)
                        }
                      />
                      <label className="form-check-label">{func.name}</label>
                    </div>
                  ))}
                </div>
                <div className="ms-20 d-flex">
                  {menu.subMenus.map((subMenu) => (
                    <div
                      key={subMenu.id}
                      className="form-check form-switch form-check-custom form-check-solid me-8"
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={subMenu.checked}
                        onChange={() =>
                          handleCheck(menu.id, "submenu", subMenu.id)
                        }
                      />
                      <label className="form-check-label">{subMenu.name}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-primary" onClick={handleSave}>
          <KTIcon iconName="check" className="fs-2" />
          Enregistrer
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default DefaultAccess;
