import { apiSlice } from "@/store/apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateNotificationPreference: builder.mutation({
      query: ({ permission, token }) => ({
        url: "/users/notifications",
        method: "PUT",
        body: { permission, token },
      }),
    }),
  }),
});

export const {
  useUpdateNotificationPreferenceMutation,
} = userApi;
