import {FC} from 'react'
import {Role} from '../../core/_models'

type Props = {
  role: Role
}

const UserRoleCell: FC<Props> = ({role}) => (
  <div className='d-flex align-items-center'>
    <div className='d-flex flex-column'>
      <span>{role.nom}</span>
      <span className='text-muted'>Coef: {role.coefficient_qualification}</span>
    </div>
  </div>
)

export {UserRoleCell}
