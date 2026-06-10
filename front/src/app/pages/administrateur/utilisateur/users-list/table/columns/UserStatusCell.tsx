import {FC} from 'react'

type Props = {
  actif: boolean
}

const UserStatusCell: FC<Props> = ({actif}) => (
  <div className='d-flex justify-content-center'>
    <div className={`badge badge-light-${actif ? 'success' : 'danger'} fw-bolder d-inline-block text-center`}>
      {actif ? 'Actif' : 'Inactif'}
    </div>
  </div>
)

export {UserStatusCell}
