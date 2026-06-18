'use client'

import RoleForm from '@/components/feature/permissions/RoleForm'
import { ROUTES } from '@/constants/routes'
import { 
  useGetRoleByIdQuery, 
  useUpdateRoleMutation, 
  useUpdateRolePermissionsMutation 
} from '@/redux/api/roleApi'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { use, useMemo } from 'react'

const EditRolePage = () => {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  
  const { data: roleData, isLoading: isFetching } = useGetRoleByIdQuery(id)
  const [updateRole, { isLoading: isUpdatingRole }] = useUpdateRoleMutation()
  const [updatePermissions, { isLoading: isUpdatingPermissions }] = useUpdateRolePermissionsMutation()

  const handleSubmit = async (values: any) => {
    try {
      // 1. Update basic info
      await updateRole({
        id,
        data: {
          name: values.name,
          description: values.description,
          status: values.status
        }
      }).unwrap()

      // 2. Update permissions
      await updatePermissions({
        id,
        permission_ids: values.permission_ids
      }).unwrap()

      toast.success('Role updated successfully')
      router.push(ROUTES.PERMISSIONS)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update role')
    }
  }

  const initialValues = useMemo(() => {
    if (!roleData?.data) return undefined;
    if ('role' in roleData.data && 'permissions' in roleData.data) {
      return {
        ...roleData.data.role,
        permissions: roleData.data.permissions.map((p: any) => p._id || p.id)
      };
    }
    return undefined;
  }, [roleData]);

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <RoleForm 
        key={id}
        mode="edit" 
        initialValues={initialValues as any} 
        onSubmit={handleSubmit} 
        isLoading={isUpdatingRole || isUpdatingPermissions} 
      />
    </div>
  )
}

export default EditRolePage
