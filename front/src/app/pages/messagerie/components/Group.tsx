import { FC, useEffect, useState } from "react";
import { KTIcon } from "../../../../_metronic/helpers";
import { Modal } from "react-bootstrap";
import AddGroupeMessage from "./AddGroupeMessage";
import { ChatInnerGroup } from "./ChatInnerGroup";
import { useAuth } from "../../../modules/auth";
import {
  getMessageGroupes,
  getParticipantsGroupes,
  createParticipant,
  createParticipantGroupe,
  createObjet,
  sendGroupMessage,
  updateObjetStatus,
} from "../../../../services/api";

const Group: FC = () => {
  const { currentUser } = useAuth();
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState<any>(null);
  const [discussions, setDiscussions] = useState<{ [key: string]: any[] }>({});
  const [participants, setParticipants] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const response = await getMessageGroupes();
      const allMessages = response;

      // Grouper les messages par objet de discussion
      const groupedMessages = allMessages.reduce(
        (acc: { [key: string]: any[] }, message: any) => {
          const key = `objet_${message.objet.id}`;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(message);
          return acc;
        },
        {}
      );

      setDiscussions(groupedMessages);
      setMessages(allMessages);

      // Charger les participants si une discussion est sélectionnée
      if (selectedDiscussion) {
        loadParticipants(selectedDiscussion.participant.id);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des messages:", error);
    }
  };

  const loadParticipants = async (participantId: number) => {
    try {
      const response = await getParticipantsGroupes();
      const discussionParticipants = response
        .filter((p: any) => p.participant.id === participantId)
        .map((p: any) => p.utilisateur);
      setParticipants(discussionParticipants);
    } catch (error) {
      console.error("Erreur lors du chargement des participants:", error);
    }
  };

  const handleCreateDiscussion = async (formData: any) => {
    try {
      // 1. Créer l'objet
      const newObjet = await createObjet({
        objet_discussion: formData.objet.objet_discussion,
        nature: formData.objet.nature,
        statut: "Actif",
        reponse: "",
        archiver: false,
      });

      // 2. Créer le participant
      const newParticipant = await createParticipant();

      // 3. Créer les participants du groupe
      await Promise.all([
        // Ajouter l'utilisateur courant
        createParticipantGroupe({
          participant: newParticipant["@id"],
          utilisateur: `/api/utilisateurs/${currentUser?.id}`,
        }),
        // Ajouter les autres participants
        ...formData.participants.map((user: any) =>
          createParticipantGroupe({
            participant: newParticipant["@id"],
            utilisateur: `/api/utilisateurs/${user.id}`,
          })
        ),
      ]);

      // 4. Créer le premier message
      await sendGroupMessage({
        objet: newObjet["@id"],
        expediteur: `/api/utilisateurs/${currentUser?.id}`,
        role: `/api/roles/${formData.role.id}`,
        contenu: "Bonjour tout le monde !",
        date_envoi: new Date().toISOString(),
        participant: newParticipant["@id"],
      });

      // 5. Recharger les messages
      await loadMessages();
      setShowNewGroupModal(false);
    } catch (error) {
      console.error("Erreur lors de la création de la discussion:", error);
    }
  };

  const handleSelectDiscussion = async (discussion: any) => {
    setSelectedDiscussion(discussion);
    await loadParticipants(discussion.participant.id);
  };

  const handleProblemSolved = async (reponse: string) => {
    if (selectedDiscussion) {
      try {
        await updateObjetStatus(selectedDiscussion.objet.id, reponse);
        await loadMessages();
      } catch (error) {
        console.error("Erreur lors de la mise à jour du statut:", error);
      }
    }
  };

  const filterDiscussions = () => {
    return Object.entries(discussions)
      .filter(([_, msgs]) => {
        const lastMessage = msgs[msgs.length - 1];
        return (
          lastMessage.objet.objet_discussion
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          lastMessage.objet.nature
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      })
      .sort(([_, a], [__, b]) => {
        const dateA = new Date(a[a.length - 1].date_envoi).getTime();
        const dateB = new Date(b[b.length - 1].date_envoi).getTime();
        return dateB - dateA;
      });
  };

  const renderDiscussions = () => {
    const colors = ["primary", "success", "warning", "danger", "info"];

    return filterDiscussions().map(([key, msgs]) => {
      const lastMessage = msgs[msgs.length - 1];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      return (
        <div
          key={key}
          className={`d-flex flex-stack py-4 cursor-pointer ${
            selectedDiscussion?.objet.id === lastMessage.objet.id
              ? "bg-light-primary"
              : ""
          }`}
          onClick={() => handleSelectDiscussion(lastMessage)}
        >
          <div className="d-flex align-items-center">
            <div className="symbol symbol-45px symbol-circle">
              <span
                className={`symbol-label bg-light-${randomColor} text-${randomColor} fs-6 fw-bolder`}
              >
                {lastMessage.objet.objet_discussion[0]}
              </span>
            </div>

            <div className="ms-5">
              <a
                href="#"
                className="fs-5 fw-bolder text-gray-900 text-hover-primary mb-2"
              >
                {lastMessage.objet.objet_discussion}
              </a>
              {/* <div className="fw-bold text-gray-400">
                {lastMessage.objet.nature}
              </div> */}
              <div className="fw-bold text-gray-500">
                {lastMessage.contenu.substring(0, 30)}...
              </div>
            </div>
          </div>

          <div className="d-flex flex-column align-items-end ms-2">
            {/* <span className="text-muted fs-7 mb-1">
              {new Date(lastMessage.date_envoi).toLocaleString()}
            </span> */}
            {/* <span className="text-muted fs-7 mb-1">
              {new Date(lastMessage.date_envoi).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span> */}
            <span className="text-muted fs-7 mb-1">
              {new Date(lastMessage.date_envoi).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
              })}{" "}
              à{" "}
              {new Date(lastMessage.date_envoi).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>

            {lastMessage.objet.statut === "Résolue" && (
              <span className="badge badge-light-success">Résolue</span>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <div className="d-flex flex-column flex-lg-row">
        <div className="flex-column flex-lg-row-auto w-100 w-lg-300px w-xl-400px mb-10 mb-lg-0">
          <div className="card card-flush">
            <div className="card-header pt-7" id="kt_chat_contacts_header">
              <button
                type="button"
                className="btn btn-primary mb-5 w-100"
                onClick={() => setShowNewGroupModal(true)}
              >
                <KTIcon iconName="plus" className="fs-2" />
                Nouvelle discussion
              </button>

              <form className="w-100 position-relative" autoComplete="off">
                <KTIcon
                  iconName="magnifier"
                  className="fs-2 text-lg-1 text-gray-500 position-absolute top-50 ms-5 translate-middle-y"
                />
                <input
                  type="text"
                  className="form-control form-control-solid px-15"
                  name="search"
                  placeholder="Rechercher une discussion..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
            </div>

            <div className="card-body pt-5" id="kt_chat_contacts_body">
              <div
                className="scroll-y me-n5 pe-5"
                data-kt-scroll="true"
                data-kt-scroll-activate="{default: false, lg: true}"
                data-kt-scroll-max-height="auto"
                data-kt-scroll-dependencies="#kt_header, #kt_toolbar, #kt_footer, #kt_chat_contacts_header"
                data-kt-scroll-wrappers="#kt_content, #kt_chat_contacts_body"
                data-kt-scroll-offset="0px"
              >
                {renderDiscussions()}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-lg-row-fluid ms-lg-7 ms-xl-10">
          {selectedDiscussion ? (
            <div
              className="card"
              id="kt_chat_messenger"
              style={{ height: "calc(100vh - 150px)" }}
            >
              <ChatInnerGroup
                messages={
                  discussions[`objet_${selectedDiscussion.objet.id}`] || []
                }
                currentUser={currentUser}
                selectedDiscussion={selectedDiscussion}
                participants={participants}
                onMessageSent={loadMessages}
                onProblemSolved={handleProblemSolved}
              />
            </div>
          ) : (
            <div className="card">
              <div className="card-body">
                <div className="text-center">
                  <h3>Sélectionnez une discussion</h3>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        show={showNewGroupModal}
        onHide={() => setShowNewGroupModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Nouvelle discussion de groupe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddGroupeMessage
            onClose={() => setShowNewGroupModal(false)}
            onSubmit={handleCreateDiscussion}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export { Group };
