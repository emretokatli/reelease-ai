import { baseApi } from './baseApi'

export const notificationApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getNotifications: builder.query<any, void>({
      query: () => ({
        url: '/notification',
        method: 'GET',
      }),
      providesTags: ['Notification'],
    }),

    markAsRead: builder.mutation<any, string>({
      query: (id) => ({
        url: id === 'all' ? '/notification/read-all' : `/notification/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
})

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
} = notificationApi
