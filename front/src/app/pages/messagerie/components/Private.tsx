import { FC, useEffect, useState } from "react";
import { KTIcon, toAbsoluteUrl } from "../../../../_metronic/helpers";
import { ListAllUser } from "./ListAllUser";
import {
  getMessages,
  Message,
  getUtilisateurs,
  updateMessageStatus,
} from "../../../../services/api";
import { useAuth } from "../../../modules/auth";
import { ChatInner } from "./ChatInner";

const Private: FC = () => {
  const [showListAllUser, setShowListAllUser] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [conversations, setConversations] = useState<{
    [key: string]: any[];
  }>({});
  const { currentUser } = useAuth();
  const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>(
    {}
  );
  const COLORS = ["primary", "success", "info", "warning", "danger"];

  useEffect(() => {
    loadMessages();
  }, []);

  const getUserColor = (userId: number | string) => {
    const numericId =
      typeof userId === "string"
        ? parseInt(userId.replace("user_", ""))
        : userId;
    return COLORS[numericId % COLORS.length];
  };

  const loadMessages = async () => {
    try {
      const response = await getMessages() as any[];
      const userMessages = response.filter(
        (message: any) =>
          message.expediteur?.id === currentUser?.id ||
          message.destinataire?.id === currentUser?.id
      );

      const groupedMessages = userMessages.reduce(
        (acc: { [key: string]: any[] }, message: any) => {
          const otherUser =
            message.expediteur?.id === currentUser?.id
              ? message.destinataire
              : message.expediteur;

          const key = `user_${otherUser?.id}`;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(message);
          return acc;
        },
        {}
      );

      // Calculer les messages non lus
      const unreadMessageCounts = Object.entries(groupedMessages).reduce(
        (acc, [key, messages]) => {
          acc[key] = (messages as any[]).filter(
            (msg: any) => msg.destinataire?.id === currentUser?.id && !msg.statut
          ).length;
          return acc;
        },
        {} as { [key: string]: number }
      );

      setUnreadCounts(unreadMessageCounts);
      setConversations(groupedMessages);
      setMessages(userMessages);
    } catch (error) {
      console.error("Erreur lors du chargement des messages:", error);
    }
  };

  // const handleUserSelect = (user: any) => {
  //   setSelectedUser(user);
  //   // Charger les messages de la conversation sélectionnée
  // };

  const handleUserSelect = async (user: any) => {
    setSelectedUser(user);
    const conversationKey = `user_${user.id}`;

    // Mettre à jour le statut des messages
    if (conversations[conversationKey]) {
      const unreadMessages = conversations[conversationKey].filter(
        (msg: any) => msg.destinataire?.id === currentUser?.id && !msg.statut
      );

      // Mettre à jour le statut en base de données
      for (const message of unreadMessages) {
        try {
          await updateMessageStatus(message.id, true);
        } catch (error) {
          console.error("Erreur lors de la mise à jour du statut:", error);
        }
      }

      // Mettre à jour l'état local
      setUnreadCounts((prev) => ({ ...prev, [conversationKey]: 0 }));
      await loadMessages(); // Recharger les messages pour avoir les statuts à jour
    }
  };

  const renderConversations = () => {
    const sortedConversations = Object.entries(conversations).sort(
      ([, msgsA], [, msgsB]) => {
        const lastMessageA = msgsA[msgsA.length - 1];
        const lastMessageB = msgsB[msgsB.length - 1];
        return (
          new Date(lastMessageB.date_envoie).getTime() -
          new Date(lastMessageA.date_envoie).getTime()
        );
      }
    );

    return sortedConversations.map(([userId, msgs]) => {
      const lastMessage = msgs[msgs.length - 1];
      const otherUser: any =
        lastMessage.expediteur?.id === currentUser?.id
          ? lastMessage.destinataire
          : lastMessage.expediteur;
      const hasUnread = unreadCounts[userId] > 0;
      const color = getUserColor(otherUser.id);

      return (
        <div
          key={userId}
          className="d-flex flex-stack py-4 cursor-pointer"
          onClick={() => handleUserSelect(otherUser)}
        >
          <div className="d-flex align-items-center">
            <div className="symbol symbol-45px symbol-circle">
              <span
                className={`symbol-label bg-light-${color} text-${color} fs-6 fw-bolder`}
              >
                {otherUser.nom[0]}
              </span>
            </div>

            <div className="ms-5">
              <a
                href="#"
                className={`fs-5 fw-bolder text-gray-900 text-hover-primary mb-2 ${
                  hasUnread ? "fw-bold" : ""
                }`}
              >
                {`${otherUser.nom} ${otherUser.prenoms}`}
              </a>
              <div
                className={`fw-bold text-gray-500 ${
                  hasUnread ? "fw-bold" : ""
                }`}
              >
                {lastMessage.contenu.substring(0, 20)}...
              </div>
            </div>
          </div>

          <div className="d-flex flex-column align-items-end ms-2">
            <span
              className={`text-muted fs-7 mb-1 ${hasUnread ? "fw-bold" : ""}`}
            >
              {/* {new Date(lastMessage.date_envoie).toLocaleString()} */}
              {new Date(lastMessage.date_envoie).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
              })}{" "}
              à{" "}
              {new Date(lastMessage.date_envoie).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {hasUnread && (
              <span className="badge badge-sm badge-circle badge-light-success">
                {unreadCounts[userId]}
              </span>
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
                onClick={() => setShowListAllUser(true)}
              >
                <KTIcon iconName="plus" className="fs-2" />
                Nouveau message
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
                  placeholder="Rechercher par nom..."
                />
              </form>
            </div>

            <div className="card-body pt-5" id="kt_chat_contacts_body">
              <div
                className="scroll-y me-n5 pe-5 h-200px h-lg-auto"
                data-kt-scroll="true"
                data-kt-scroll-activate="{default: false, lg: true}"
                data-kt-scroll-max-height="auto"
                data-kt-scroll-dependencies="#kt_header, #kt_toolbar, #kt_footer, #kt_chat_contacts_header"
                data-kt-scroll-wrappers="#kt_content, #kt_chat_contacts_body"
                data-kt-scroll-offset="0px"
              >
                {renderConversations()}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-lg-row-fluid ms-lg-7 ms-xl-10">
          {selectedUser ? (
            // <div className="card" id="kt_chat_messenger">
            <div
              className="card"
              id="kt_chat_messenger"
              style={{ height: "calc(100vh - 150px)" }} // Ajout de cette ligne
            >
              <div className="card-header" id="kt_chat_messenger_header">
                <div className="card-title">
                  <div className="d-flex justify-content-center flex-column me-3">
                    <a
                      href="#"
                      className="fs-4 fw-bolder text-gray-900 text-hover-primary me-1 mb-2 lh-1"
                    >
                      {`${selectedUser.nom} ${selectedUser.prenoms}`}
                    </a>
                  </div>
                </div>
              </div>
              <ChatInner
                messages={conversations[`user_${selectedUser.id}`] || []}
                currentUser={currentUser}
                selectedUser={selectedUser}
                onMessageSent={loadMessages}
              />
            </div>
          ) : (
            <div className="card">
              <div className="card-body">
                <div className="text-center">
                  <h3>Sélectionnez une conversation</h3>
                </div>
              </div>
            </div>
          )}
        </div>

        <ListAllUser
          show={showListAllUser}
          onHide={() => setShowListAllUser(false)}
          onUserSelect={handleUserSelect}
        />
      </div>
    </>
  );
};

export { Private };
