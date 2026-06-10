import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import "moment/locale/fr";
import { KTIcon } from "../../../_metronic/helpers";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import Select from "react-select";
import UserSelectionModal from "../messagerie/components/UserSelectionModal";
import {
  getAgendas,
  createAgenda,
  updateAgenda,
  deleteAgenda,
  getUtilisateurs,
  Agenda,
} from "../../../services/api";
import Swal from "sweetalert2";
import { useAuth } from "../../modules/auth";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";

moment.locale("fr");

const AgendasPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Agenda | null>(null);
  const [events, setEvents] = useState<Agenda[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [newEvent, setNewEvent] = useState<Partial<Agenda>>({
    date_debut: moment().format("YYYY-MM-DDTHH:mm"),
    date_fin: moment().add(1, "hour").format("YYYY-MM-DDTHH:mm"),
    titre: "",
    description: "",
    type: "SAV",
    destinataire: [],
    importance: "non_important/non_urgent",
    statut: "standby",
  });

  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const calendrierRef = useRef<FullCalendar>(null);
  const [polling, setPolling] = useState<NodeJS.Timer | null>(null);

  useEffect(() => {
    loadEvents();
    loadUsers();
  }, []);

  useEffect(() => {
    const loadAgendaData = async () => {
      try {
        const response = await getAgendas();
        setEvents(response);
      } catch (error) {
        console.error("Erreur chargement agendas:", error);
      }
    };

    const handleStatusUpdate = async (eventId: number) => {
      try {
        await updateAgenda(eventId, { statut: "terminé" });
        setShowDetailModal(false);
        Swal.fire("Succès", "Statut mis à jour avec succès", "success");
      } catch (error) {
        Swal.fire("Erreur", "Impossible de mettre à jour le statut", "error");
      }
    };

    loadAgendaData();
    const interval = setInterval(loadAgendaData, 1000);
    setPolling(interval);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  // const loadEvents = async () => {
  //   try {
  //     const data = await getAgendas();
  //     setEvents(data);
  //   } catch (error) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Erreur",
  //       text: "Impossible de charger les événements",
  //     });
  //   }
  // };

  const loadEvents = async () => {
    try {
      const data = await getAgendas();
      // Filtre pour ne garder que les événements en standby
      const standbyEvents = data.filter((event: any) => event.statut === "standby");
      setEvents(standbyEvents);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Impossible de charger les événements",
      });
    }
  };

  const loadUsers = async () => {
    try {
      const data = await getUtilisateurs();
      const filteredUsers = data.filter((user: any) => user.id !== currentUser?.id);
      setUsers(filteredUsers);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Impossible de charger les utilisateurs",
      });
    }
  };

  const typeOptions = [
    { value: "SAV", label: "SAV" },
    { value: "Service Client", label: "Service Client" },
    { value: "GPA", label: "GPA" },
  ];

  const importanceOptions = [
    {
      value: "urgent/important",
      label: "Urgent et Important",
      color: "#FF0000",
    },
    {
      value: "important/non_urgent",
      label: "Important mais pas urgent",
      color: "#FFA500",
    },
    {
      value: "urgent/non_important",
      label: "Urgent mais pas important",
      color: "#FFFF00",
    },
    {
      value: "non_important/non_urgent",
      label: "Non urgent et non important",
      color: "#808080",
    },
  ];

  const getEventStyle = (importance: string) => {
    switch (importance) {
      case "urgent/important":
        return { backgroundColor: "#FFCCCB", dotColor: "#FF0000" };
      case "important/non_urgent":
        return { backgroundColor: "#FFE5B4", dotColor: "#FFA500" };
      case "urgent/non_important":
        return { backgroundColor: "#FFFACD", dotColor: "#FFFF00" };
      default:
        return { backgroundColor: "#F0F0F0", dotColor: "#808080" };
    }
  };

  const handleEventClick = (info: any) => {
    const event = events.find((e) => e.id === parseInt(info.event.id));
    if (event) {
      setSelectedEvent(event);
      setShowDetailModal(true);
    }
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setNewEvent({
      date_debut: moment().format("YYYY-MM-DDTHH:mm"),
      date_fin: moment().add(1, "hour").format("YYYY-MM-DDTHH:mm"),
      titre: "",
      description: "",
      type: "SAV",
      destinataire: [],
      importance: "non_important/non_urgent",
      statut: "standby",
    });
    setSelectedUsers([]);
    setShowModal(true);
  };

  const handleEditEvent = (event: any) => {
    const destinataireArray = Array.isArray(event.destinataire)
      ? event.destinataire
      : [event.destinataire];

    setNewEvent({
      ...event,
      destinataire: destinataireArray,
    });
    setSelectedUsers(
      destinataireArray.map((dest: any) => {
        if (typeof dest === "string") {
          const userId = dest.split("/").pop();
          return { id: userId };
        }
        return dest;
      })
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewEvent({
      date_debut: moment().format("YYYY-MM-DDTHH:mm"),
      date_fin: moment().add(1, "hour").format("YYYY-MM-DDTHH:mm"),
      titre: "",
      description: "",
      type: "SAV",
      destinataire: [],
      importance: "non_important/non_urgent",
      statut: "standby",
    });
    setSelectedUsers([]);
  };

  const handleSelectUsers = (users: any[]) => {
    setSelectedUsers(users);
    setNewEvent((prev) => ({ ...prev, destinataire: users }));
  };

  const validateForm = () => {
    if (!newEvent.titre?.trim()) {
      Swal.fire("Erreur", "Le titre est obligatoire", "error");
      return false;
    }
    if (!newEvent.date_debut || !newEvent.date_fin) {
      Swal.fire("Erreur", "Les dates sont obligatoires", "error");
      return false;
    }
    if (moment(newEvent.date_fin).isBefore(newEvent.date_debut)) {
      Swal.fire(
        "Erreur",
        "La date de fin doit être après la date de début",
        "error"
      );
      return false;
    }
    if (selectedUsers.length === 0) {
      Swal.fire("Erreur", "Sélectionnez au moins un destinataire", "error");
      return false;
    }
    return true;
  };

  const handleSaveEvent = async () => {
    if (!validateForm()) return;

    try {
      // Données de base de l'événement
      const baseEventData = {
        date_debut: moment(newEvent.date_debut).format("YYYY-MM-DDTHH:mm:ss"),
        date_fin: moment(newEvent.date_fin).format("YYYY-MM-DDTHH:mm:ss"),
        titre: newEvent.titre,
        description: newEvent.description,
        type: newEvent.type,
        importance: newEvent.importance,
        statut: newEvent.statut,
        expediteur: `/api/utilisateurs/${currentUser?.id}`,
      };

      // Création d'un événement pour chaque destinataire
      for (const user of selectedUsers) {
        const eventData = {
          ...baseEventData,
          destinataire: `/api/utilisateurs/${user.id}`,
        };

        if (selectedEvent) {
          await updateAgenda(selectedEvent.id!, eventData as any);
        } else {
          await createAgenda(eventData as any);
        }
      }

      Swal.fire("Succès", "Événements créés avec succès", "success");
      handleCloseModal();
      loadEvents();
    } catch (error) {
      console.error("Erreur:", error);
      Swal.fire(
        "Erreur",
        "Une erreur est survenue lors de la sauvegarde",
        "error"
      );
    }
  };

  const handleDeleteEvent = async (id: number) => {
    try {
      const result = await Swal.fire({
        title: "Êtes-vous sûr ?",
        text: "Cette action est irréversible",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimer",
        cancelButtonText: "Annuler",
      });

      if (result.isConfirmed) {
        await deleteAgenda(id);
        setShowDetailModal(false);
        loadEvents();
        Swal.fire("Supprimé", "L'événement a été supprimé", "success");
      }
    } catch (error) {
      Swal.fire(
        "Erreur",
        "Une erreur est survenue lors de la suppression",
        "error"
      );
    }
  };

  const handleStatusUpdate = async (eventId: number) => {
    try {
      await updateAgenda(eventId, { statut: "terminé" });
      setShowDetailModal(false);
      Swal.fire("Succès", "Statut mis à jour avec succès", "success");
    } catch (error) {
      Swal.fire("Erreur", "Impossible de mettre à jour le statut", "error");
    }
  };

  const usersBreadcrumbs: Array<PageLink> = [
    {
      title: "Calendrier des évènements",
      path: "/app/pages/administrateur/agendas",
      isSeparator: false,
      isActive: false,
    },
    {
      title: "",
      path: "",
      isSeparator: true,
      isActive: false,
    },
  ];

  return (
    <>
      <PageTitle breadcrumbs={usersBreadcrumbs}>Agenda</PageTitle>
      <div className="row">
        <div className="col-lg-12">
          <div className="card card-custom">
            <div className="card-header">
              <div className="card-title">
                <h3 className="card-label">Calendrier</h3>
              </div>
              <div className="card-toolbar">
                <button
                  className="btn btn-primary font-weight-bold"
                  onClick={handleAddEvent}
                >
                  <KTIcon iconName="plus" className="fs-2" />
                  Ajouter un événement
                </button>
              </div>
            </div>
            <div className="card-body">
              <FullCalendar
                ref={calendrierRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                initialView="dayGridMonth"
                editable={false}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                events={events.map((event) => ({
                  id: event.id?.toString(),
                  title: event.titre,
                  start: event.date_debut,
                  end: event.date_fin,
                  className: event.importance,
                  extendedProps: {
                    description: event.description,
                    type: event.type,
                    importance: event.importance,
                    statut: event.statut,
                  },
                }))}
                eventContent={(eventInfo) => {
                  const style = getEventStyle(eventInfo.event.classNames[0]);
                  return (
                    <div
                      style={{
                        backgroundColor: style.backgroundColor,
                        borderRadius: "5px",
                        padding: "2px 5px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: style.dotColor,
                          marginRight: "5px",
                        }}
                      ></span>
                      <span style={{ color: "black" }}>
                        {eventInfo.event.title}
                      </span>
                    </div>
                  );
                }}
                eventClick={handleEventClick}
                locale="fr"
              />
            </div>
          </div>
        </div>

        {/* Modal de création/modification */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedEvent ? "Modifier l'événement" : "Ajouter un événement"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                {/* <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date et heure de début</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="date_debut"
                    value={moment(newEvent.date_debut).format(
                      "YYYY-MM-DDTHH:mm"
                    )}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, date_debut: e.target.value })
                    }
                  />
                </Form.Group>
              </Col> */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date et heure de début</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="date_debut"
                      min={moment().format("YYYY-MM-DDTHH:mm")}
                      value={moment(newEvent.date_debut).format(
                        "YYYY-MM-DDTHH:mm"
                      )}
                      onChange={(e) => {
                        const newStartDate = e.target.value;
                        setNewEvent((prev) => ({
                          ...prev,
                          date_debut: newStartDate,
                          date_fin: moment(newStartDate).isAfter(prev.date_fin)
                            ? moment(newStartDate)
                                .add(1, "hour")
                                .format("YYYY-MM-DDTHH:mm")
                            : prev.date_fin,
                        }));
                      }}
                    />
                  </Form.Group>
                </Col>
                {/* <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date et heure de fin</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="date_fin"
                    value={moment(newEvent.date_fin).format("YYYY-MM-DDTHH:mm")}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, date_fin: e.target.value })
                    }
                  />
                </Form.Group>
              </Col> */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date et heure de fin</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="date_fin"
                      min={moment(newEvent.date_debut).format(
                        "YYYY-MM-DDTHH:mm"
                      )}
                      value={moment(newEvent.date_fin).format(
                        "YYYY-MM-DDTHH:mm"
                      )}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, date_fin: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Titre</Form.Label>
                <Form.Control
                  type="text"
                  name="titre"
                  value={newEvent.titre}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, titre: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <Select
                  options={typeOptions}
                  value={typeOptions.find(
                    (option) => option.value === newEvent.type
                  )}
                  onChange={(selected) =>
                    setNewEvent({ ...newEvent, type: selected?.value as any })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Importance</Form.Label>
                <Select
                  options={importanceOptions}
                  value={importanceOptions.find(
                    (option) => option.value === newEvent.importance
                  )}
                  onChange={(selected) =>
                    setNewEvent({ ...newEvent, importance: selected?.value as any })
                  }
                  formatOptionLabel={({ label, color }) => (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: color,
                          marginRight: 10,
                        }}
                      />
                      <span>{label}</span>
                    </div>
                  )}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Destinataires</Form.Label>
                <div className="d-flex align-items-center">
                  <Select
                    isMulti
                    options={selectedUsers.map((user) => ({
                      value: user.id,
                      label: user.nom
                        ? `${user.nom} ${user.prenoms}`
                        : `Utilisateur ${user.id}`,
                    }))}
                    value={selectedUsers.map((user) => ({
                      value: user.id,
                      label: user.nom
                        ? `${user.nom} ${user.prenoms}`
                        : `Utilisateur ${user.id}`,
                    }))}
                    onChange={(selected) =>
                      handleSelectUsers(
                        selected.map((option) => ({ id: option.value }))
                      )
                    }
                    className="flex-grow-1 me-2"
                  />
                  <Button
                    variant="light-primary"
                    className="btn-icon btn-sm"
                    onClick={() => setShowUserModal(true)}
                  >
                    <KTIcon iconName="plus" className="fs-2" />
                  </Button>
                </div>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button variant="primary" onClick={handleSaveEvent}>
              {selectedEvent ? "Modifier" : "Enregistrer"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal de détail */}
        <Modal
          show={showDetailModal}
          onHide={() => setShowDetailModal(false)}
          size="lg"
        >
          <Modal.Header closeButton className="border-0">
            <Modal.Title className="fs-2">
              <span
                className={`badge badge-light-${
                  selectedEvent?.statut === "standby" ? "warning" : "success"
                } me-2`}
              >
                {selectedEvent?.statut}
              </span>
              {selectedEvent?.titre}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedEvent && (
              <div className="card card-flush">
                <div className="card-body">
                  <div className="row mb-6">
                    <div className="col-lg-6">
                      <div className="mb-4">
                        <div className="fw-bold text-gray-600 mb-1">
                          Date de début
                        </div>
                        <div className="fs-5">
                          <KTIcon
                            iconName="calendar-8"
                            className="fs-4 me-1 text-primary"
                          />
                          {moment(selectedEvent.date_debut).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-4">
                        <div className="fw-bold text-gray-600 mb-1">
                          Date de fin
                        </div>
                        <div className="fs-5">
                          <KTIcon
                            iconName="calendar-8"
                            className="fs-4 me-1 text-primary"
                          />
                          {moment(selectedEvent.date_fin).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="separator separator-dashed my-5"></div>

                  <div className="mb-4">
                    <div className="fw-bold text-gray-600 mb-1">
                      Description
                    </div>
                    <div className="fs-6 text-gray-800">
                      {selectedEvent.description}
                    </div>
                  </div>

                  <div className="row mb-6">
                    <div className="col-lg-6">
                      <div className="mb-4">
                        <div className="fw-bold text-gray-600 mb-1">Type</div>
                        <div className="badge badge-light-info fs-7">
                          {selectedEvent.type}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-4">
                        <div className="fw-bold text-gray-600 mb-1">
                          Importance
                        </div>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: getEventStyle(
                              selectedEvent.importance
                            ).backgroundColor,
                            color: getEventStyle(selectedEvent.importance)
                              .dotColor,
                            padding: "8px 12px",
                          }}
                        >
                          {selectedEvent.importance}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="separator separator-dashed my-5"></div>

                  <div className="mb-4">
                    <div className="fw-bold text-gray-600 mb-1">Créé par</div>
                    <div className="d-flex align-items-center">
                      <div className="symbol symbol-35px me-3">
                        <span className="symbol-label bg-light-primary">
                          <KTIcon
                            iconName="user"
                            className="fs-4 text-primary"
                          />
                        </span>
                      </div>
                      <div className="fs-5">
                        {typeof selectedEvent.expediteur === "object"
                          ? `${selectedEvent.expediteur.nom} ${selectedEvent.expediteur.prenoms}`
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>

          {selectedEvent && (
            <Modal.Footer className="border-0">
              {selectedEvent.destinataire &&
                typeof selectedEvent.destinataire === "object" &&
                !Array.isArray(selectedEvent.destinataire) &&
                (selectedEvent.destinataire as any).id === currentUser?.id && (
                  <>
                    {/* {selectedEvent.statut === "standby" && (
                      <Button
                        variant="light-success"
                        className="me-2"
                        onClick={() => {
                          updateAgenda(selectedEvent.id!, { statut: "terminé" })
                            .then(() => {
                              loadEvents();
                              setShowDetailModal(false);
                              Swal.fire(
                                "Succès",
                                "Statut mis à jour avec succès",
                                "success"
                              );
                            })
                            .catch(() => {
                              Swal.fire(
                                "Erreur",
                                "Impossible de mettre à jour le statut",
                                "error"
                              );
                            });
                        }}
                      >
                        <KTIcon iconName="check" className="fs-2 me-2" />
                        Marquer comme terminé
                      </Button>
                    )} */}
                    {selectedEvent.statut === "standby" && (
                      <Button
                        variant="light-success"
                        className="me-2"
                        onClick={() => handleStatusUpdate(selectedEvent.id!)}
                      >
                        <KTIcon iconName="check" className="fs-2 me-2" />
                        Marquer comme terminé
                      </Button>
                    )}
                  </>
                )}
              {selectedEvent &&
                typeof selectedEvent.expediteur === "object" &&
                selectedEvent.expediteur.id === currentUser?.id && (
                  <>
                    <Button
                      variant="light-primary"
                      className="me-2"
                      onClick={() => {
                        setNewEvent(selectedEvent);
                        setSelectedUsers(
                          Array.isArray(selectedEvent.destinataire)
                            ? selectedEvent.destinataire.filter(
                                (dest) => typeof dest === "object"
                              )
                            : []
                        );
                        setShowDetailModal(false);
                        setShowModal(true);
                      }}
                    >
                      <KTIcon iconName="pencil" className="fs-2 me-2" />
                      Modifier
                    </Button>
                    <Button
                      variant="light-danger"
                      onClick={() => handleDeleteEvent(selectedEvent.id!)}
                    >
                      <KTIcon iconName="trash" className="fs-2 me-2" />
                      Supprimer
                    </Button>
                  </>
                )}
              <Button variant="light" onClick={() => setShowDetailModal(false)}>
                <KTIcon iconName="cross" className="fs-2 me-2" />
                Fermer
              </Button>
            </Modal.Footer>
          )}
        </Modal>

        <UserSelectionModal
          show={showUserModal}
          onHide={() => setShowUserModal(false)}
          onSelectUsers={handleSelectUsers}
          selectedUsers={selectedUsers}
        />
      </div>
    </>
  );
};

export default AgendasPage;
