import { baseApi } from './baseApi'

export const socialApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSocialDashboard: builder.query<any, void>({
      query: () => '/social/dashboard',
      providesTags: ['SocialDashboard'],
    }),
    getSocialAccounts: builder.query({
      query: (platform) => ({
        url: '/social/accounts',
        params: { platform },
      }),
      providesTags: ['SocialAccount'],
    }),
    getChannelStats: builder.query<
      Record<string, { postsThisMonth: number; engagement: number }>,
      string | void
    >({
      query: (period = 'month') => ({
        url: '/social/accounts/stats',
        params: { period: period || 'month' },
      }),
      transformResponse: (response: {
        success?: boolean
        data?: Record<string, { postsThisMonth: number; engagement: number }>
      }) => response?.data || {},
      providesTags: ['ChannelStats'],
    }),
    setChannelPaused: builder.mutation({
      query: ({ accountId, paused }: { accountId: string; paused: boolean }) => ({
        url: `/social/account/${accountId}/pause`,
        method: 'PATCH',
        body: { paused },
      }),
      invalidatesTags: ['SocialAccount', 'ChannelStats'],
    }),
    getFacebookSDKConfig: builder.query({
      query: () => '/social/facebook/config',
    }),
    connectFacebookAccount: builder.mutation({
      query: (data) => ({
        url: '/social/facebook/connect',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SocialAccount', 'ChannelStats'],
    }),
    getLinkedInSDKConfig: builder.query({
      query: () => '/social/linkedin/config',
    }),
    connectLinkedInAccount: builder.mutation({
      query: (data) => ({
        url: '/social/linkedin/connect',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SocialAccount', 'ChannelStats'],
    }),
    getTwitterSDKConfig: builder.query({
      query: () => '/social/twitter/config',
    }),
    connectTwitterAccount: builder.mutation({
      query: (data) => ({
        url: '/social/twitter/connect',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SocialAccount', 'ChannelStats'],
    }),
    disconnectSocialAccount: builder.mutation({
      query: (accountId) => ({
        url: `/social/account/${accountId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SocialAccount', 'ChannelStats'],
    }),
    validateSocialToken: builder.mutation({
      query: (accountId) => ({
        url: `/social/account/${accountId}/validate`,
        method: 'POST',
      }),
      invalidatesTags: ['ChannelStats'],
    }),
  }),
})

export const {
  useGetSocialDashboardQuery,
  useGetSocialAccountsQuery,
  useGetChannelStatsQuery,
  useGetFacebookSDKConfigQuery,
  useConnectFacebookAccountMutation,
  useGetLinkedInSDKConfigQuery,
  useConnectLinkedInAccountMutation,
  useGetTwitterSDKConfigQuery,
  useConnectTwitterAccountMutation,
  useDisconnectSocialAccountMutation,
  useValidateSocialTokenMutation,
  useSetChannelPausedMutation,
} = socialApi
