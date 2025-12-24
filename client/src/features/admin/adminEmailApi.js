import { apiSlice } from "@/store/apiSlice";

export const adminEmailApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmailLogs: builder.query({
      query: () => "/admin/email-logs",
      providesTags: ["EmailLog"],
    }),

    resendEmail: builder.mutation({
      query: (id) => ({
        url: `/admin/email-logs/${id}/resend`,
        method: "PUT",
      }),
      invalidatesTags: ["EmailLog"],
    }),
  }),
});

export const {
  useGetEmailLogsQuery,
  useResendEmailMutation,
} = adminEmailApi;
