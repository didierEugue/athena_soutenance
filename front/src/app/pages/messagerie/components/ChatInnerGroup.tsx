import React, { FC, useEffect, useRef, useState } from "react";
import { KTIcon, toAbsoluteUrl } from "../../../../_metronic/helpers";
import {
  getMessageFichiers,
  getMessageGroupes,
  sendGroupMessage,
  uploadMessageFichiers,
} from "../../../../services/api";
import { useAuth } from "../../../modules/auth";

interface Props {
  messages: any[];
  currentUser: any;
  selectedDiscussion: any;
  participants: any[];
  onMessageSent: () => void;
  onProblemSolved: (reponse: string) => void;
}

const ChatInnerGroup: FC<Props> = ({
  // messages,
  currentUser,
  selectedDiscussion,
  participants,
  onMessageSent,
  onProblemSolved,
}) => {
  const [messageText, setMessageText] = useState<string>("");
  const [reponseText, setReponseText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [messageFichiers, setMessageFichiers] = useState<{
    [key: number]: any[];
  }>({});
  const [polling, setPolling] = useState<ReturnType<typeof setInterval> | null>(null);
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);
  useEffect(() => {
    const loadMessageFichiers = async () => {
      for (const message of messages) {
        if (message.id) {
          const fichiers = await getMessageFichiers(message.id);
          setMessageFichiers((prev) => ({
            ...prev,
            [message.id]: fichiers,
          }));
        }
      }
    };
    loadMessageFichiers();
    scrollToBottom();
  }, [messages]);

  // useEffect(() => {
  //   const loadMessages = async () => {
  //     if (selectedDiscussion?.objet?.id) {
  //       try {
  //         const response = await getMessageGroupes();
  //         const filteredMessages = response.filter(
  //           (msg: any) => msg.objet.id === selectedDiscussion.objet.id
  //         );
  //         setMessages(filteredMessages);

  //         // Chargement des fichiers
  //         for (const message of filteredMessages) {
  //           if (message.id) {
  //             const fichiers = await getMessageFichiers(message.id);
  //             setMessageFichiers((prev) => ({
  //               ...prev,
  //               [message.id]: fichiers,
  //             }));
  //           }
  //         }
  //       } catch (error) {
  //         console.error("Erreur chargement messages:", error);
  //       }
  //     }
  //   };

  //   loadMessages();
  //   const interval = setInterval(loadMessages, 1000);
  //   setPolling(interval);

  //   return () => {
  //     if (polling) {
  //       clearInterval(polling);
  //     }
  //   };
  // }, [selectedDiscussion]);

  // Ajout du nettoyage lors du changement de discussion

  useEffect(() => {
    const loadMessages = async () => {
      if (selectedDiscussion?.objet?.id) {
        try {
          const response = await getMessageGroupes();
          const filteredMessages = response.filter(
            (msg: any) => msg.objet.id === selectedDiscussion.objet.id
          );
          setMessages(filteredMessages); // Cette ligne était manquante

          // Chargement des fichiers
          for (const message of filteredMessages) {
            if (message.id) {
              const fichiers = await getMessageFichiers(message.id);
              setMessageFichiers((prev) => ({
                ...prev,
                [message.id]: fichiers,
              }));
            }
          }
          scrollToBottom();
        } catch (error) {
          console.error("Erreur chargement messages:", error);
        }
      }
    };

    // Premier chargement
    loadMessages();

    // Configuration du polling
    const interval = setInterval(loadMessages, 500);
    setPolling(interval);

    // Nettoyage
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [selectedDiscussion]);

  useEffect(() => {
    return () => {
      if (polling) {
        clearInterval(polling);
      }
    };
  }, []);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const handleSendMessage = async () => {
    if ((!messageText.trim() && selectedFiles.length === 0) || isSubmitting)
      return;

    setIsSubmitting(true);
    try {
      const newMessage = {
        objet: selectedDiscussion.objet["@id"],
        expediteur: `/api/utilisateurs/${currentUser.id}`,
        role: selectedDiscussion.role["@id"],
        contenu: messageText,
        date_envoi: new Date().toISOString(),
        participant: selectedDiscussion.participant["@id"],
      };

      const messageResponse = await sendGroupMessage(newMessage);

      if (selectedFiles.length > 0) {
        await uploadMessageFichiers(messageResponse.id, selectedFiles);
      }

      setMessageText("");
      setSelectedFiles([]);
      onMessageSent();
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSolveProblem = async () => {
    if (!reponseText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onProblemSolved(reponseText);
      setReponseText("");
      setShowResolutionModal(false);
    } catch (error) {
      console.error("Erreur lors de la résolution du problème:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  return (
    <>
      <div className="card-header" id="kt_chat_messenger_header">
        <div className="card-title">
          <div className="d-flex justify-content-center flex-column me-3">
            <div className="symbol-group symbol-hover mb-3">
              {participants.slice(0, 3).map((participant, index) => (
                <div key={index} className="symbol symbol-35px symbol-circle">
                  {participant.utilisateur.photo ? (
                    <img
                      alt="Pic"
                      src={toAbsoluteUrl(
                        `/media/${participant.utilisateur.photo}`
                      )}
                    />
                  ) : (
                    <span
                      className={`symbol-label bg-light-${
                        ["primary", "success", "warning"][index]
                      } text-${
                        ["primary", "success", "warning"][index]
                      } fs-6 fw-bolder`}
                    >
                      {participant.utilisateur.nom.charAt(0)}
                    </span>
                  )}
                </div>
              ))}
              {participants.length > 3 && (
                <div className="symbol symbol-35px symbol-circle">
                  <span className="symbol-label bg-light-primary fs-8 fw-bolder">
                    +{participants.length - 3}
                  </span>
                </div>
              )}
            </div>

            <a
              href="#"
              className="fs-4 fw-bolder text-gray-900 text-hover-primary me-1 mb-2 lh-1"
            >
              {selectedDiscussion.objet.objet_discussion}
            </a>

            <div className="mb-0 lh-1">
              <span className="badge badge-success badge-circle w-10px h-10px me-1"></span>
              <span className="fs-7 fw-bold text-gray-400">
                {selectedDiscussion.objet.nature}
              </span>
            </div>
          </div>
        </div>

        {/* <div className="card-toolbar">
          <div className="me-n3 position-relative">
            <button
              className="btn btn-sm btn-icon btn-active-light-primary"
              data-kt-menu-trigger="click"
              data-kt-menu-placement="bottom-end"
              data-kt-menu-flip="top-end"
            >
              <i className="bi bi-three-dots fs-2"></i>
            </button>
            <div
              className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-bold w-200px py-3"
              data-kt-menu="true"
            >
              <div className="menu-item px-3">
                <div className="menu-content text-muted pb-2 px-3 fs-7 text-uppercase">
                  Résolution du problème
                </div>
              </div>
              <div className="separator mb-3 opacity-75"></div>
              <div className="menu-item px-3">
                <textarea
                  className="form-control form-control-solid mb-3"
                  rows={3}
                  placeholder="Description de la solution..."
                  value={reponseText}
                  onChange={(e) => setReponseText(e.target.value)}
                ></textarea>
                <button
                  className="btn btn-light-primary btn-sm w-100"
                  onClick={handleSolveProblem}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "En cours..." : "Marquer comme résolu"}
                </button>
              </div>
            </div>
          </div>
        </div> */}
        <div className="card-toolbar">
          <div className="me-n3">
            <div className="dropdown">
              <button
                type="button"
                className="btn btn-sm btn-icon btn-active-light-primary"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <KTIcon iconName="setting-3" className="fs-2" />
              </button>

              <div
                className="dropdown-menu dropdown-menu-end p-5"
                style={{ minWidth: "300px" }}
              >
                <div className="menu-item px-3">
                  <div className="menu-content text-muted pb-2 px-3 fs-7 text-uppercase">
                    Résolution du problème
                  </div>
                </div>
                <div className="separator mb-3 opacity-75"></div>
                <div className="menu-item px-3">
                  <textarea
                    className="form-control form-control-solid mb-3"
                    rows={4}
                    placeholder="Description de la solution..."
                    value={reponseText}
                    onChange={(e) => setReponseText(e.target.value)}
                  ></textarea>
                  <button
                    className="btn btn-light-primary btn-sm w-100"
                    onClick={handleSolveProblem}
                  >
                    Marquer comme résolu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="card-body"
        ref={chatContainerRef}
        style={{
          height: "calc(100vh - 280px)",
          overflow: "auto",
          paddingRight: "0.5rem",
        }}
      >
        <div className="d-flex flex-column">
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
                  <div className="d-flex align-items-center mb-2">
                    {!isCurrentUser && (
                      <a
                        href="#"
                        className="fs-5 fw-bolder text-gray-900 text-hover-primary me-1"
                      >
                        {message.expediteur.prenoms}
                      </a>
                    )}
                    <span className="text-muted fs-7">
                      {new Date(message.date_envoi).toLocaleTimeString(
                        "fr-FR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}{" "}
                      à{" "}
                      {new Date(message.date_envoi).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "2-digit",
                          month: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                  <div
                    className={`p-5 rounded bg-light-${
                      isCurrentUser ? "primary" : "info"
                    } text-dark fw-bold mw-lg-400px text-start`}
                  >
                    {message.contenu}
                    {/* {message.fichiers && message.fichiers.length > 0 && (
                      <div className="mt-2">
                        {message.fichiers.map((fichier: any, index: number) => (
                          <span
                            key={index}
                            onClick={() => window.open(fichier.url, "_blank")}
                            className={`badge ${
                              fichier.mime_type.includes("image")
                                ? "badge-light-info"
                                : "badge-light-primary"
                            } me-2 mb-1`}
                            style={{ cursor: "pointer" }}
                          >
                            <KTIcon
                              iconName={
                                fichier.mime_type.includes("image")
                                  ? "image"
                                  : "file-doc"
                              }
                              className="fs-6 me-1"
                            />
                            {fichier.nom}
                          </span>
                        ))}
                      </div>
                    )} */}
                    {messageFichiers[message.id] &&
                      messageFichiers[message.id].length > 0 && (
                        <div className="mt-2">
                          {messageFichiers[message.id].map(
                            (fichier: any, index: number) => (
                              <span
                                key={index}
                                onClick={() =>
                                  window.open(fichier.url, "_blank")
                                }
                                className={`badge ${
                                  fichier.mime_type.includes("image")
                                    ? "badge-light-info"
                                    : "badge-light-primary"
                                } me-2 mb-1`}
                                style={{ cursor: "pointer" }}
                              >
                                <KTIcon
                                  iconName={
                                    fichier.mime_type.includes("image")
                                      ? "image"
                                      : "file-doc"
                                  }
                                  className="fs-6 me-1"
                                />
                                {fichier.nom}
                              </span>
                            )
                          )}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card-footer pt-4">
        <textarea
          className="form-control form-control-flush mb-3"
          rows={1}
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
          {/* <div className="d-flex align-items-center me-2">
            <button
              className="btn btn-sm btn-icon btn-active-light-primary me-1"
              type="button"
              data-bs-toggle="tooltip"
              title="Coming soon"
            >
              <i className="bi bi-paperclip fs-3"></i>
            </button>
          </div> */}
          <div className="d-flex align-items-center me-2">
            <input
              type="file"
              multiple
              className="d-none"
              id="chat-files"
              onChange={handleFileSelect}
            />
            <label
              htmlFor="chat-files"
              className="btn btn-sm btn-icon btn-active-light-primary me-1"
              data-bs-toggle="tooltip"
              title="Ajouter des fichiers"
            >
              <i className="bi bi-paperclip fs-3"></i>
            </label>
            {selectedFiles.length > 0 && (
              <span className="badge badge-circle badge-primary">
                {selectedFiles.length}
              </span>
            )}
          </div>

          <button
            className="btn btn-primary"
            type="button"
            onClick={handleSendMessage}
            disabled={isSubmitting}
          >
            Envoyer
          </button>
        </div>
      </div>
    </>
  );
};

export { ChatInnerGroup };
