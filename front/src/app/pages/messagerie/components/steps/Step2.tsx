import React, {FC, useState} from 'react'
import {KTIcon} from '../../../../../_metronic/helpers'
import {ErrorMessage, Field} from 'formik'
import { CardGroup } from '../CardGroup'

const Step2: FC = () => {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const users = [
    { id: '1', avatar: '/media/avatars/300-6.jpg', name: 'Emma Smith', job: 'Art Director', online: true },
    { id: '2', avatar: '/media/avatars/300-5.jpg', name: 'Melody Macy', job: 'Marketing Analytic', online: true },
    { id: '3', avatar: '/media/avatars/300-1.jpg', name: 'Max Smith', job: 'Software Engineer', online: false },
    // Ajoutez d'autres utilisateurs selon vos besoins
  ];
  
  const handleCardSelection = (id: string) => {
    setSelectedCards(prev => 
      prev.includes(id) ? prev.filter(cardId => cardId !== id) : [...prev, id]
    );
  };
  

  return (
    <div className='w-100'>
      <div className='pb-10 pb-lg-15'>
        <h2 className='fw-bolder text-gray-900'>Qui souhaitez-vous intégrés à la discussion de groupe ?</h2>
      </div>

<div className='mb-10 fv-row'>
  <div className='d-flex justify-content-center mb-5'>
    <div className='w-75 position-relative'>
      <KTIcon
        iconName='magnifier'
        className='fs-2 text-gray-500 position-absolute top-50 translate-middle-y ms-4'
      />
      <input
        type='text'
        className='form-control form-control-solid ps-14'
        placeholder='Rechercher un utilisateur...'
      />
    </div>
  </div>

{/* <div className='row g-6 g-xl-9 mb-6 mb-xl-9'>
  <div className='col-md-4'>
    <CardGroup
      avatar='/media/avatars/300-6.jpg'
      name='Emma Smith'
      job='Art Director'
      online={true}
    />
  </div>
  <div className='col-md-4'>
    <CardGroup
      color='primary'
      name='Melody Macy'
      job='Marketing Analytic'
      online={true}
    />
  </div>
  <div className='col-md-4'>
    <CardGroup
      avatar='/media/avatars/300-1.jpg'
      name='Max Smith'
      job='Software Enginer'
    />
  </div>
  {/* Ajoutez d'autres CardGroup selon vos besoins 
</div> */}
<div className='row g-6 g-xl-9 mb-6 mb-xl-9'>
  {users.map(user => (
    <div className='col-md-4' key={user.id}>
      <CardGroup
        id={user.id}
        avatar={user.avatar}
        name={user.name}
        job={user.job}
        online={user.online}
        isSelected={selectedCards.includes(user.id)}
        onSelect={handleCardSelection}
      />
    </div>
  ))}
</div>


</div>

    </div>
  )
}

export {Step2}
