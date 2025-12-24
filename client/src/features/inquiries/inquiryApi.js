import { apiSlice } from "../../store/apiSlice";

export const inquiryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createInquiry: builder.mutation({
      query: (data) => ({
        url: "/inquiries",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Inquiry"],
    }),

    getMyInquiries: builder.query({
      query: () => "/inquiries/my",
      providesTags: ["Inquiry"],
    }),

    getMyRequests: builder.query({
      query: () => "/inquiries/my-requests",
      providesTags: ["Inquiry"],
    }),

    updateInquiryStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/inquiries/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Inquiry"],
    }),
  }),
});

export const {
  useCreateInquiryMutation,
  useGetMyInquiriesQuery,
  useGetMyRequestsQuery,
  useUpdateInquiryStatusMutation,
  
} = inquiryApi;
