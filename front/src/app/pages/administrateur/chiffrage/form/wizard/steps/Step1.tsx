import {FC} from 'react'
import {KTIcon} from '../../../../../../../_metronic/helpers'
import {ErrorMessage, Field} from 'formik'

const Step1: FC = () => {
  return (
    <div className='w-100'>
      <div className='pb-10 pb-lg-15'>
        <h2 className='fw-bolder d-flex align-items-center text-gray-900'>
          Informations du client
        </h2>
        (facultatif si le client n'est pas connu)
      </div>

      <div className='fv-row mb-10'>
        <label className='form-label required'>Nom complet du client</label>
        <Field name='fullName' className='form-control form-control-lg form-control-solid' />
        <div className='text-danger mt-2'>
          <ErrorMessage name='fullName' />
        </div>
      </div>

      <div className='fv-row mb-10'>
        <label className='form-label required'>Téléphone</label>
        <Field name='phone' className='form-control form-control-lg form-control-solid' />
        <div className='text-danger mt-2'>
          <ErrorMessage name='phone' />
        </div>
      </div>

      <div className='fv-row mb-10'>
        <label className='form-label required'>Email</label>
        <Field name='email' className='form-control form-control-lg form-control-solid' type='email' />
        <div className='text-danger mt-2'>
          <ErrorMessage name='email' />
        </div>
      </div>

      <div className='fv-row mb-10'>
        <label className='form-label required'>Adresse</label>
        <Field name='address' className='form-control form-control-lg form-control-solid' as='textarea' rows={3} />
        <div className='text-danger mt-2'>
          <ErrorMessage name='address' />
        </div>
      </div>
    </div>
  )
}

export {Step1}
