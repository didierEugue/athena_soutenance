import React, {FC} from 'react'
import {
  Taches
} from './tache/Taches'
import { PageLink, PageTitle } from '../../../../_metronic/layout/core'


const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Paramètre en Atelier',
    path: '/app/pages/parametreIntranet/atelier',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const AteliersPage: FC = () => {
  return (
    <>
      <PageTitle breadcrumbs={usersBreadcrumbs}>Atelier</PageTitle>
      <div className='row g-5 g-xl-8'>
        {/* begin::Col */}
        <div className='col-xl-12'>
          <Taches className='card-xl-stretch mb-xl-8' />
        </div>
        {/* end::Col */}

        {/* begin::Col */}

        {/* end::Col */}
      </div>
      {/* <Taches className='card-xl-stretch mb-xl-8' />
      <Qualifications className='card-xl-stretch mb-5 mb-xl-8' /> */}
    </>
  )
}

export {AteliersPage}
export default AteliersPage