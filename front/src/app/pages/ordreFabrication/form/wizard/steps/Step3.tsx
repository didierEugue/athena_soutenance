import React, { FC, useState, useEffect } from 'react'
import { Field, ErrorMessage, useFormikContext } from 'formik'
import { KTIcon } from '../../../../../../_metronic/helpers'

interface OF {
  numero: string
  nom: string
  dateCloture: string
  indice: number
  commentaire: string
}

const Step3: FC = () => {
  const [ofs, setOfs] = useState<OF[]>([])
  const [currentOF, setCurrentOF] = useState<OF>({ numero: '', nom: '', dateCloture: '', indice: 1, commentaire: '' })
  const { setFieldValue } = useFormikContext<any>()
  const [minDate, setMinDate] = useState('')

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setMinDate(today)
    setCurrentOF(prev => ({ ...prev, dateCloture: today }))
  }, [])

  const handleAddOF = () => {
    setOfs([...ofs, currentOF])
    setCurrentOF({ numero: '', nom: '', dateCloture: minDate, indice: 1, commentaire: '' })
    setFieldValue('ordresFabrication', [...ofs, currentOF])
  }

  const handleModifyOF = (index: number) => {
    setCurrentOF(ofs[index])
    const newOfs = ofs.filter((_, i) => i !== index)
    setOfs(newOfs)
    setFieldValue('ordresFabrication', newOfs)
  }

  const handleDeleteOF = (index: number) => {
    const newOfs = ofs.filter((_, i) => i !== index)
    setOfs(newOfs)
    setFieldValue('ordresFabrication', newOfs)
  }

  return (
    <div className='w-100'>
      <div className='pb-10 pb-lg-12'>
        <h2 className='fw-bolder text-gray-900'>Ordres de Fabrication</h2>
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

      <div className='mb-10 fv-row'>
        <label className='form-label'>Commentaire</label>
        <textarea
          className='form-control form-control-lg form-control-solid'
          value={currentOF.commentaire}
          onChange={(e) => setCurrentOF({ ...currentOF, commentaire: e.target.value })}
          rows={3}
        />
      </div>

      <div className='text-center mb-10'>
        <button type='button' className='btn btn-primary' onClick={handleAddOF}>
          Ajouter l'OF
        </button>
      </div>

      {/* {ofs.length > 0 && (
        // <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
        //   <thead>
        //     <tr className='fw-bold text-muted'>
        //       <th>Numéro</th>
        //       <th>Nom</th>
        //       <th>Date de clôture</th>
        //       <th>Indice</th>
        //       <th>Actions</th>
        //     </tr>
        //   </thead>
        //   <tbody>
        //     {ofs.map((of, index) => (
        //       <tr key={index}>
        //         <td>{of.numero}</td>
        //         <td>{of.nom}</td>
        //         <td>{of.dateCloture}</td>
        //         <td>{of.indice}</td>
        //         <td>
        //           <button type='button' className='btn btn-icon btn-light btn-sm me-1' onClick={() => handleModifyOF(index)}>
        //             <KTIcon iconName='pencil' className='fs-3' />
        //           </button>
        //           <button type='button' className='btn btn-icon btn-light btn-sm' onClick={() => handleDeleteOF(index)}>
        //             <KTIcon iconName='trash' className='fs-3' />
        //           </button>
        //         </td>
        //       </tr>
        //     ))}
        //   </tbody>
        // </table>
        
      )} */}
      {/* Tableau toujours affiché avec design moderne Metronic */}
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

    </div>
  )
}

export { Step3 }
