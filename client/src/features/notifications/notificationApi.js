import { apiSlice } from "@/store/apiSlice";

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyNotifications: builder.query({
      query: () => "/notifications/my",
      providesTags: ["Notification"],
      pollingInterval: 5000, // 🔥 auto refresh
    }),

    markNotificationRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetMyNotificationsQuery,
  useMarkNotificationReadMutation,
} = notificationApi;
