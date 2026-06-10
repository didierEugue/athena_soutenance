import React, { useState, useEffect } from 'react'
import { Fournisseur, createFournisseur, updateFournisseur } from '../../../../../services/api'

interface Props {
  fournisseur?: Fournisseur
  onSubmit: () => void
}

const FournisseurForm: React.FC<Props> = ({ fournisseur, onSubmit }) => {
  const [formData, setFormData] = useState<Fournisseur>({
    nom: '',
    telephone: '',
    email: '',
    adresse: '',
  })

  useEffect(() => {
    if (fournisseur) {
      setFormData(fournisseur)
    }
  }, [fournisseur])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (fournisseur?.id) {
      await updateFournisseur(fournisseur.id, formData)
    } else {
      await createFournisseur(formData)
    }
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-10">
        <label className="form-label required">Nom</label>
        <input type="text" className="form-control form-control-solid" name="nom" value={formData.nom} onChange={handleChange} required />
      </div>
      <div className="mb-10">
        <label className="form-label required">Téléphone</label>
        <input type="tel" className="form-control form-control-solid" name="telephone" value={formData.telephone} onChange={handleChange} required />
      </div>
      <div className="mb-10">
        <label className="form-label required">Email</label>
        <input type="email" className="form-control form-control-solid" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div className="mb-10">
        <label className="form-label">Adresse</label>
        <textarea className="form-control form-control-solid" rows={3} name="adresse" value={formData.adresse} onChange={handleChange}></textarea>
      </div>
      <div className="text-center">
        <button type="submit" className="btn btn-primary">{fournisseur?.id ? 'Modifier' : 'Ajouter'}</button>
      </div>
    </form>
  )
}

export default FournisseurForm
