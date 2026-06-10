import React, { FC, useState, useEffect, useRef } from 'react'
import { ErrorMessage, Field, useFormikContext } from 'formik'
import { KTIcon } from '../../../../../../_metronic/helpers'

const Step2: FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const { values, setFieldValue } = useFormikContext<any>()
  const [minDate, setMinDate] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setMinDate(today)
    setFieldValue('closingDate', today)
  }, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files)
      setSelectedFiles((prevFiles) => [...prevFiles, ...filesArray])
      setFieldValue('files', [...selectedFiles, ...filesArray])
    }
  }

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    setFieldValue('files', newFiles)
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className='w-100'>
      <div className='pb-10 pb-lg-15'>
        <h2 className='fw-bolder text-gray-900'>Informations de l'affaire</h2>
      </div>

      <div className='mb-10 fv-row'>
        <label className='form-label mb-3'>Nom complet du client</label>
        <Field
          type='text'
          className='form-control form-control-lg form-control-solid'
          name='fullName'
          disabled
        />
      </div>

      {/* <div className='mb-10 fv-row'>
        <label className='form-label mb-3 required'>Numéro de l'affaire</label>
        <Field
          type='text'
          className='form-control form-control-lg form-control-solid'
          name='affaireNumber'
          required
        />
        <div className='text-danger mt-2'>
          <ErrorMessage name='affaireNumber' />
        </div>
      </div> */}

      <div className='row mb-10'>
        <div className='col-md-4 fv-row'>
          <label className='form-label mb-3 required'>Numéro de l'affaire</label>
          <Field
            type='text'
            className='form-control form-control-lg form-control-solid'
            name='affaireNumber'
            required
          />
          <div className='text-danger mt-2'>
            <ErrorMessage name='affaireNumber' />
          </div>
        </div>

        <div className='col-md-8 fv-row'>
          <label className='form-label mb-3 required'>Nom de l'affaire</label>
          <Field
            type='text'
            className='form-control form-control-lg form-control-solid'
            name='affaireName'
            required
          />
          <div className='text-danger mt-2'>
            <ErrorMessage name='affaireName' />
          </div>
        </div>
      </div>

      <div className='mb-10 fv-row'>
        <label className='form-label mb-3 required'>Description de l'affaire</label>
        <Field
          as='textarea'
          className='form-control form-control-lg form-control-solid'
          name='affaireDescription'
          rows={4}
          required
        />
        <div className='text-danger mt-2'>
          <ErrorMessage name='affaireDescription' />
        </div>
      </div>

      <div className='row mb-10'>
        <div className='col-md-6 fv-row'>
          <label className='form-label mb-3 required'>Date de clôture</label>
          <Field
            type='date'
            className='form-control form-control-lg form-control-solid'
            name='closingDate'
            min={minDate}
            required
          />
          <div className='text-danger mt-2'>
            <ErrorMessage name='closingDate' />
          </div>
        </div>

        <div className='col-md-6 fv-row'>
          <label className='form-label mb-3 required'>Statut de l'affaire</label>
          <Field as='select' className='form-select form-select-lg form-select-solid' name='status' required>
            <option value=''>Sélectionnez un statut</option>
            <option value='standby'>En attente</option>
            <option value='en_cours'>En cours</option>
          </Field>
          <div className='text-danger mt-2'>
            <ErrorMessage name='status' />
          </div>
        </div>
      </div>

      <div className='mb-10 fv-row'>
        <label className='form-label mb-3'>Fichiers</label>
        <input
          ref={fileInputRef}
          type='file'
          className='form-control form-control-lg form-control-solid'
          onChange={handleFileChange}
          multiple
        />
        <div className='mt-2 d-flex flex-wrap'>
          {selectedFiles.map((file, index) => (
            <div key={index} className='d-flex align-items-center me-3 mb-2 bg-light-primary rounded p-2'>
              <span>{file.name}</span>
              <button
                type='button'
                className='btn btn-sm btn-icon btn-light-danger ms-2'
                onClick={() => removeFile(index)}
              >
                <KTIcon iconName='cross' className='fs-2' />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { Step2 }
