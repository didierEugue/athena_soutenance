import React, { FC, useEffect, useRef, useState } from "react";
import { KTIcon } from "../../../../_metronic/helpers";
import { getMessages, sendMessage } from "../../../../services/api";

interface Message {
  id?: number;
  expediteur: any;
  destinataire: any;
  contenu: string;
  date_envoie: string;
  statut: boolean;
}

interface Props {
  messages: Message[];
  currentUser: any;
  selectedUser: any;
  onMessageSent: () => void;
}

const ChatInner: FC<Props> = ({
  // messages,
  currentUser,
  selectedUser,
  onMessageSent,
}) => {
  const [messageText, setMessageText] = useState<string>("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [polling, setPolling] = useState<NodeJS.Timer | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await getMessages();
        const filteredMessages = response.filter(
          (message: Message) =>
            (message.expediteur.id === currentUser?.id &&
              message.destinataire.id === selectedUser?.id) ||
            (message.expediteur.id === selectedUser?.id &&
              message.destinataire.id === currentUser?.id)
        );
        setMessages(filteredMessages);
        scrollToBottom();
      } catch (error) {
        console.error("Erreur chargement messages:", error);
      }
    };

    loadMessages();
    const interval = setInterval(loadMessages, 500);
    setPolling(interval);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [currentUser, selectedUser]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      const newMessage = {
        expediteur: `/api/utilisateurs/${currentUser.id}`,
        destinataire: `/api/utilisateurs/${selectedUser.id}`,
        contenu: messageText,
        date_envoie: new Date().toISOString(),
        statut: false,
      };

      await sendMessage(newMessage);
      setMessageText("");
      onMessageSent();
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
  };

  return (
    <>
      <div
        className="card-body"
        ref={chatContainerRef}
        style={{
          height: "calc(100vh - 280px)",
          overflow: "auto",
          paddingRight: "0.5rem",
        }}
      >
        <div className="d-flex flex-column" data-kt-element="messages">
          {messages.map((message, index) => {
            const isCurrentUser = message.expediteur.id === currentUser.id;
            return (
              <div
                key={index}
                className={`d-flex justify-content-${
                  isCurrentUser ? "end" : "start"
                } mb-10`}
              >
                {!isCurrentUser && (
                  <div className="d-flex flex-column align-items-start">
                    <div className="symbol symbol-35px symbol-circle">
                      <span className="symbol-label bg-light-danger text-danger fs-6 fw-bolder">
                        {message.expediteur.nom[0]}
                      </span>
                    </div>
                  </div>
                )}

                <div
                  className={`d-flex flex-column align-items-${
                    isCurrentUser ? "end" : "start"
                  } ms-2`}
                >
                  <div
                    className={`rounded p-5 ${
                      isCurrentUser
                        ? "bg-light-primary text-dark"
                        : "bg-light-info text-dark"
                    }`}
                  >
                    {message.contenu}
                  </div>
                  <span className="text-muted fs-7 mb-1">
                    {/* {new Date(message.date_envoie).toLocaleString()} */}
                    {new Date(message.date_envoie).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                    })}{" "}
                    à{" "}
                    {new Date(message.date_envoie).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card-footer pt-4" id="kt_chat_messenger_footer">
        <textarea
          className="form-control form-control-flush mb-3"
          rows={1}
          data-kt-element="input"
          placeholder="Tapez un message"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        ></textarea>

        <div className="d-flex flex-stack">
          <div className="d-flex align-items-center me-2">
            <button
              className="btn btn-sm btn-icon btn-active-light-primary me-1"
              type="button"
              data-bs-toggle="tooltip"
              title="Coming soon"
            >
              <i className="bi bi-paperclip fs-3"></i>
            </button>
          </div>

          <button
            className="btn btn-primary"
            type="button"
            onClick={handleSendMessage}
          >
            Envoyer
          </button>
        </div>
      </div>
    </>
  );
};

export { ChatInner };
