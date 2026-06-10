import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import { KTIcon } from '../../../../_metronic/helpers'
import Select from 'react-select'

interface OF {
  numero: string
  nom: string
  dateCloture: string
  indice: number
  commentaire: string
}

const AddOF: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [ofs, setOfs] = useState<OF[]>([])
  const [currentOF, setCurrentOF] = useState<OF>({ numero: '', nom: '', dateCloture: '', indice: 1, commentaire: '' })
  const [minDate, setMinDate] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [selectedAffaire, setSelectedAffaire] = useState<{ value: string; label: string } | null>(null)

  const selectStyles = {
    control: (provided: any) => ({
      ...provided,
      minHeight: '48px',
      backgroundColor: '#f5f8fa',
      border: '1px solid #e4e6ef',
      borderRadius: '0.475rem',
      boxShadow: 'none',
      '&:hover': {
        border: '1px solid #e4e6ef',
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999,
    }),
  }

  const affaireOptions = [
    { value: 'affaire1', label: 'Affaire 1' },
    { value: 'affaire2', label: 'Affaire 2' },
    { value: 'affaire3', label: 'Affaire 3' },
  ]

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setMinDate(today)
    setCurrentOF(prev => ({ ...prev, dateCloture: today }))
  }, [])

  const handleAddOF = () => {
    setOfs([...ofs, currentOF])
    setCurrentOF({ numero: '', nom: '', dateCloture: minDate, indice: 1, commentaire: '' })
  }

  const handleModifyOF = (index: number) => {
    setCurrentOF(ofs[index])
    const newOfs = ofs.filter((_, i) => i !== index)
    setOfs(newOfs)
  }

  const handleDeleteOF = (index: number) => {
    const newOfs = ofs.filter((_, i) => i !== index)
    setOfs(newOfs)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Traitement des données ici
    onClose()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files)
      setSelectedFiles(prevFiles => [...prevFiles, ...newFiles])
    }
  }

  const handleRemoveFile = (fileToRemove: File) => {
    setSelectedFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove))
  }

  return (
    <Modal show={isOpen} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Ajouter une tâche à un OF</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          {/* Champs pour l'OF courant */}
          <div className='row mb-10'>
            <div className='col-md-12 fv-row'>
              <label className='form-label required'>Affaire</label>
              <Select
                options={affaireOptions}
                value={selectedAffaire}
                onChange={(selected) => setSelectedAffaire(selected)}
                styles={selectStyles}
                placeholder="Sélectionnez une affaire"
                className="form-select-solid"
              />
            </div>
          </div>
          <div className='row mb-10'>
            <div className='col-md-4 fv-row'>
              <label className='form-label required'>Numéro de l'OF</label>
              <input
                type='text'
                className='form-control form-control-lg form-control-solid'
                value={currentOF.numero}
                onChange={(e) => setCurrentOF({ ...currentOF, numero: e.target.value })}
                required
              />
            </div>
            <div className='col-md-8 fv-row'>
              <label className='form-label required'>Nom de l'OF</label>
              <input
                type='text'
                className='form-control form-control-lg form-control-solid'
                value={currentOF.nom}
                onChange={(e) => setCurrentOF({ ...currentOF, nom: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Autres champs pour l'OF */}
          <div className='row mb-10'>
            <div className='col-md-6 fv-row'>
              <label className='form-label required'>Date de clôture</label>
              <input
                type='date'
                className='form-control form-control-lg form-control-solid'
                value={currentOF.dateCloture}
                onChange={(e) => setCurrentOF({ ...currentOF, dateCloture: e.target.value })}
                min={minDate}
                required
              />
            </div>
            <div className='col-md-6 fv-row'>
              <label className='form-label required'>Indice</label>
              <input
                type='number'
                className='form-control form-control-lg form-control-solid'
                value={currentOF.indice}
                onChange={(e) => setCurrentOF({ ...currentOF, indice: Math.max(1, parseInt(e.target.value)) })}
                min={1}
                required
              />
            </div>
          </div>

          {/* <div className='mb-10 fv-row'>
            <label className='form-label'>Commentaire</label>
            <textarea
              className='form-control form-control-lg form-control-solid'
              value={currentOF.commentaire}
              onChange={(e) => setCurrentOF({ ...currentOF, commentaire: e.target.value })}
              rows={3}
            />
          </div> */}
          <div className='mb-10 fv-row'>
        <label className='form-label'>Pièces jointes</label>
        <div className="d-flex align-items-center">
          <Select
            isMulti
            options={selectedFiles.map(file => ({ value: file.name, label: file.name }))}
            value={selectedFiles.map(file => ({ value: file.name, label: file.name }))}
            onChange={(selected) => setSelectedFiles(selected.map(option => selectedFiles.find(file => file.name === option.value)!))}
            className="flex-grow-1 me-2"
            styles={{
              multiValue: (base) => ({
                ...base,
                backgroundColor: '#f3f6f9',
                borderRadius: '0.475rem',
                padding: '2px 6px',
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: '#7e8299',
                fontWeight: 'bold',
              }),
              multiValueRemove: (base) => ({
                ...base,
                color: '#7e8299',
                ':hover': {
                  backgroundColor: '#e4e6ef',
                  color: '#3f4254',
                },
              }),
            }}
          />
          <label htmlFor="file-upload" className="btn btn-light-primary btn-icon btn-sm">
            <KTIcon iconName='plus' className='fs-2' />
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>

          <div className='text-center mb-10'>
            <button type='button' className='btn btn-primary' onClick={handleAddOF}>
              Ajouter l'OF
            </button>
          </div>

          {/* Tableau des OF */}
          <div className='table-responsive'>
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
              <thead>
                <tr className='fw-bold text-muted bg-light'>
                  <th className='min-w-100px text-center'>Numéro</th>
                  <th className='min-w-150px text-center'>Nom</th>
                  <th className='min-w-150px text-center'>Date de clôture</th>
                  <th className='min-w-50px text-center'>Indice</th>
                  <th className='min-w-100px text-center'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ofs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className='text-center'>
                      Aucun ordre de fabrication ajouté
                    </td>
                  </tr>
                ) : (
                  ofs.map((of, index) => (
                    <tr key={index}>
                      <td className='ps-3'>{of.numero}</td>
                      <td className='ps-3'>{of.nom}</td>
                      <td className='ps-3 text-center'>{of.dateCloture}</td>
                      <td className='ps-3 text-center'>{of.indice}</td>
                      <td className='text-center'>
                        <button
                          type='button'
                          className='btn btn-icon btn-bg-light btn-active-color-success btn-sm me-1'
                          onClick={() => handleModifyOF(index)}
                        >
                          <KTIcon iconName='pencil' className='fs-3' />
                        </button>
                        <button
                          type='button'
                          className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm'
                          onClick={() => handleDeleteOF(index)}
                        >
                          <KTIcon iconName='trash' className='fs-3' />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className='text-center pt-15'>
            <button type='reset' className='btn btn-light me-3' onClick={onClose}>
              Annuler
            </button>
            <button type='submit' className='btn btn-primary'>
              <span className='indicator-label'>Enregistrer</span>
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export { AddOF }
