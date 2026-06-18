import { baseApi } from './baseApi'
import { Attachment, AttachmentResponse, AttachmentUploadResponse } from '@/types'

export const attachmentApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAttachments: builder.query<AttachmentResponse, { page?: number; limit?: number; type?: string; search?: string; is_generated?: boolean } | void>({
      query: (params) => ({
        url: '/attachment',
        params: params || {},
      }),
      // Always use the same cache key for the same search/type, regardless of page
      serializeQueryArgs: ({ queryArgs, endpointName }) => {
        const { page, ...rest } = (queryArgs as any) || {}
        return `${endpointName}-${JSON.stringify(rest)}`
      },
      // Merge new attachments into the existing list
      merge: (currentCache, newItems, { arg }) => {
        if ((arg as any)?.page === 1 || !currentCache.attachments) {
          return newItems
        }
        return {
          ...newItems,
          attachments: [...currentCache.attachments, ...newItems.attachments]
        }
      },
      // Force refetch when page or search changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg
      },
      providesTags: (result) =>
        result?.attachments
          ? [...result.attachments.map((a: any) => ({ type: 'Attachment' as const, id: a._id || a.id })), { type: 'Attachment', id: 'LIST' }]
          : [{ type: 'Attachment', id: 'LIST' }],
    }),
    getAttachmentById: builder.query<Attachment, string>({
      query: (id) => `/attachment/${id}`,
      providesTags: (result, error, id) => [{ type: 'Attachment', id }],
    }),
    uploadAttachments: builder.mutation<AttachmentUploadResponse, FormData>({
      query: (formData) => ({
        url: '/attachment/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Attachment', id: 'LIST' }],
    }),
    deleteAttachment: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/attachment/bulk`,
        method: 'DELETE',
        body: { ids: [id] },
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Attachment', id }],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          attachmentApi.util.updateQueryData(
            'getAttachments',
            undefined,
            (draft) => {
              draft.attachments = draft.attachments.filter((a: any) => (a._id || a.id) !== id);
              if (draft.total) draft.total -= 1;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteBulkAttachments: builder.mutation<{ message: string }, string[]>({
      query: (ids) => ({
        url: '/attachment/bulk',
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: [{ type: 'Attachment', id: 'LIST' }],
    }),
    updateAttachment: builder.mutation<{ message: string; attachment: Attachment }, { id: string; name: string }>({
      query: ({ id, name }) => ({
        url: `/attachment/${id}`,
        method: 'PUT',
        body: { name },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Attachment', id }],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const updatedAttachment = data.attachment;
          
          dispatch(
            attachmentApi.util.updateQueryData(
              'getAttachments',
              undefined,
              (draft) => {
                if (!draft.attachments) return;
                const index = draft.attachments.findIndex((a: any) => (a._id || a.id) === id);
                if (index !== -1) {
                  draft.attachments[index] = { ...draft.attachments[index], ...updatedAttachment };
                }
              }
            )
          );
        } catch {}
      },
    }),
  }),
})

export const {
  useGetAttachmentsQuery,
  useGetAttachmentByIdQuery,
  useUploadAttachmentsMutation,
  useDeleteAttachmentMutation,
  useDeleteBulkAttachmentsMutation,
  useUpdateAttachmentMutation,
} = attachmentApi
