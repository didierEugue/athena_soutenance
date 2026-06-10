import React from 'react'
import {Modal} from 'react-bootstrap'
import {KTIcon} from '../../../../_metronic/helpers'

interface FilePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  files: {name: string, content: string}[]
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({isOpen, onClose, files}) => {
  const handleDownload = (content: string, fileName: string) => {
    const blob = new Blob([content], {type: 'text/plain'})
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      aria-labelledby="file-preview-modal"
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="file-preview-modal">Fichiers disponibles</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="card">
          <div className="card-body">
            {files.map((file, index) => (
              <div key={index} className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold fs-6">{file.name}</span>
                <button
                  type="button"
                  className="btn btn-icon btn-light btn-sm"
                  onClick={() => handleDownload(file.content, file.name)}
                >
                  <KTIcon iconName='file-down' className='fs-2' />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="btn btn-light"
          onClick={onClose}
        >
          Fermer
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export {FilePreviewModal}
