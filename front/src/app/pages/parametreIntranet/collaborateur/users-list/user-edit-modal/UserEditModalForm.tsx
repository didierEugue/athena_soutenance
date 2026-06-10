import {FC, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty, toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {initialUser, User} from '../core/_models'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {createUser, updateUser} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import {AddRole} from './AddQualif'

type Props = {
  isUserLoading: boolean
  user: User
}

const editUserSchema = Yup.object().shape({
  email: Yup.string()
    .email('Format d\'email incorrect')
    .min(3, 'Minimum 3 caractères')
    .max(50, 'Maximum 50 caractères')
    .required('L\'email est requis'),
  name: Yup.string()
    .min(3, 'Minimum 3 caractères')
    .max(50, 'Maximum 50 caractères')
    .required('Le nom est requis'),
  phone: Yup.string()
    .required('Le téléphone est requis'),
  password: Yup.string()
    .min(8, 'Minimum 8 caractères')
    .required('Le mot de passe est requis'),
  role: Yup.string()
    .required('Le rôle est requis'),
})

const UserEditModalForm: FC<Props> = ({user, isUserLoading}) => {
  const {setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()
  const [showAddRoleModal, setShowAddRoleModal] = useState(false)


  const [userForEdit] = useState<User>({
    ...user,
    avatar: user.avatar || initialUser.avatar,
    role: user.role || initialUser.role,
    position: user.position || initialUser.position,
    name: user.name || initialUser.name,
    phone: user.phone || '',
    email: user.email || initialUser.email,
  })

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const blankImg = toAbsoluteUrl('media/svg/avatars/blank.svg')
  const userAvatarImg = toAbsoluteUrl(`media/${userForEdit.avatar}`)

  const formik = useFormik({
    initialValues: userForEdit,
    validationSchema: editUserSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      try {
        if (isNotEmpty(values.id)) {
          await updateUser(values)
        } else {
          await createUser(values)
        }
      } catch (ex) {
        console.error(ex)
      } finally {
        setSubmitting(true)
        cancel(true)
      }
    },
  })

  return (
    <>
      <form id='kt_modal_add_user_form' className='form' onSubmit={formik.handleSubmit} noValidate>
        <div
          className='d-flex flex-column scroll-y me-n7 pe-7'
          id='kt_modal_add_user_scroll'
          data-kt-scroll='true'
          data-kt-scroll-activate='{default: false, lg: true}'
          data-kt-scroll-max-height='auto'
          data-kt-scroll-dependencies='#kt_modal_add_user_header'
          data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
          data-kt-scroll-offset='300px'
        >
          <div className='row mb-7'>
            <div className='col-md-6'>
              <div className='fv-row mb-7'>
                <label className='d-block fw-bold fs-6 mb-5'>Avatar</label>
                <div
                  className='image-input image-input-outline'
                  data-kt-image-input='true'
                  style={{backgroundImage: `url('${blankImg}')`}}
                >
                  <div
                    className='image-input-wrapper w-125px h-125px'
                    style={{backgroundImage: `url('${userAvatarImg}')`}}
                  ></div>
                  <label
                    className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                    data-kt-image-input-action='change'
                    data-bs-toggle='tooltip'
                    title="Changer l'avatar"
                  >
                    <i className='bi bi-pencil-fill fs-7'></i>
                    <input type='file' name='avatar' accept='.png, .jpg, .jpeg' />
                    <input type='hidden' name='avatar_remove' />
                  </label>
                  <span
                    className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                    data-kt-image-input-action='cancel'
                    data-bs-toggle='tooltip'
                    title="Annuler l'avatar"
                  >
                    <i className='bi bi-x fs-2'></i>
                  </span>
                  <span
                    className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
                    data-kt-image-input-action='remove'
                    data-bs-toggle='tooltip'
                    title="Supprimer l'avatar"
                  >
                    <i className='bi bi-x fs-2'></i>
                  </span>
                </div>
                <div className='form-text'>Types de fichiers autorisés : png, jpg, jpeg.</div>
              </div>
            </div>
            <div className='col-md-6'>
              <div className='mb-7'>
                <label className='required fw-bold fs-6 mb-2'>Nom</label>
                <input
                  placeholder='Nom'
                  {...formik.getFieldProps('name')}
                  type='text'
                  name='name'
                  className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    {'is-invalid': formik.touched.name && formik.errors.name},
                    {'is-valid': formik.touched.name && !formik.errors.name}
                  )}
                  autoComplete='off'
                  disabled={formik.isSubmitting || isUserLoading}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                      <span role='alert'>{formik.errors.name}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className='mb-7'>
                <label className='required fw-bold fs-6 mb-2'>Prénom</label>
                <input
                  placeholder='Prénom'
                  {...formik.getFieldProps('name')}
                  type='text'
                  name='name'
                  className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    {'is-invalid': formik.touched.name && formik.errors.name},
                    {'is-valid': formik.touched.name && !formik.errors.name}
                  )}
                  autoComplete='off'
                  disabled={formik.isSubmitting || isUserLoading}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                      <span role='alert'>{formik.errors.name}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Téléphone</label>
            <input
              placeholder='Téléphone'
              {...formik.getFieldProps('phone')}
              type='tel'
              name='phone'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.phone && formik.errors.phone},
                {'is-valid': formik.touched.phone && !formik.errors.phone}
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.phone}</span>
                </div>
              </div>
            )}
          </div>

          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Email</label>
            <input
              placeholder='Email'
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.email && formik.errors.email},
                {'is-valid': formik.touched.email && !formik.errors.email}
              )}
              type='email'
              name='email'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.email && formik.errors.email && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.email}</span>
              </div>
            )}
          </div>

          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Mot de passe</label>
            <input
              placeholder='Mot de passe'
              {...formik.getFieldProps('password')}
              type='password'
              name='password'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.password && formik.errors.password},
                {'is-valid': formik.touched.password && !formik.errors.password}
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.password && formik.errors.password && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.password}</span>
                </div>
              </div>
            )}
          </div>

        <div className='fv-row mb-7'>
  <label className='required fw-bold fs-6 mb-2'>Qualification</label>
  <div className='d-flex align-items-center'>
    <div className='flex-grow-1 me-2'>
      <select
        className={clsx(
          'form-select form-select-solid fw-bolder',
          {'is-invalid': formik.touched.role && formik.errors.role},
          {'is-valid': formik.touched.role && !formik.errors.role}
        )}
        {...formik.getFieldProps('role')}
        name='role'
      >
        <option value=''>Sélectionnez une qualification</option>
        <option value='T'>Technicien</option>
        <option value='OS'>Ouvrier Spécialisé</option>
        <option value='M'>Manœvre</option>
      </select>
    </div>
    <div className='flex-grow-1 me-2'>
      <input
        type='text'
        className='form-control form-control-solid'
        value={
          formik.values.role === 'T' ? '1,5' :
          formik.values.role === 'OS' ? '1,0' :
          formik.values.role === 'M' ? '0,8' : ''
        }
        disabled
      />
    </div>
    <button
      type='button'
      className='btn btn-icon btn-primary ms-2'
      onClick={() => setShowAddRoleModal(true)}
    >
      <i className='bi bi-plus-lg'></i>
    </button>
  </div>
  {formik.touched.role && formik.errors.role && (
    <div className='fv-plugins-message-container'>
      <div className='fv-help-block'>
        <span role='alert'>{formik.errors.role}</span>
      </div>
    </div>
  )}
</div>


        </div>

        <div className='text-center pt-15'>
          <button
            type='reset'
            onClick={() => cancel()}
            className='btn btn-light me-3'
            data-kt-users-modal-action='cancel'
            disabled={formik.isSubmitting || isUserLoading}
          >
            Annuler
          </button>

          <button
            type='submit'
            className='btn btn-primary'
            data-kt-users-modal-action='submit'
            disabled={isUserLoading || formik.isSubmitting || !formik.isValid || !formik.touched}
          >
            <span className='indicator-label'>Soumettre</span>
            {(formik.isSubmitting || isUserLoading) && (
              <span className='indicator-progress'>
                Veuillez patienter...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
      </form>
      {(formik.isSubmitting || isUserLoading) && <UsersListLoading />}
      {showAddRoleModal && <AddRole show={showAddRoleModal} handleClose={() => setShowAddRoleModal(false)} />}

    </>
  )
}

export {UserEditModalForm}
