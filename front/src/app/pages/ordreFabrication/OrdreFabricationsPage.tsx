import React, {FC, useState} from 'react'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {FormTable} from './form/FormTable'
// import {Affaire} from './form/Affaire'
// import {TabsWrapper} from '../../../../_metronic/helpers'
// import { TabsWrapper } from '../../../../components/TabsWrapper'



const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Liste des Ordres de Fabrications',
    path: '/app/pages/ordreFabrication',
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

const OrdreFabricationsPage: FC = () => {
  const [activeTab, setActiveTab] = useState('Chiffrages')

  return (
    <>
      <PageTitle breadcrumbs={usersBreadcrumbs}>Ordre de Fabrication</PageTitle>
      <FormTable />
    </>
  )
}

export {OrdreFabricationsPage}
export default OrdreFabricationsPage
