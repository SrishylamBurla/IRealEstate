import { apiSlice } from "@/store/apiSlice";

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => "/admin/users",
    }),

    getAllProperties: builder.query({
      query: () => "/admin/properties",
    }),

    getAllInquiries: builder.query({
      query: () => "/admin/inquiries",
    }),

    

  }),
});

export const {
  useGetAllUsersQuery,
  useGetAllPropertiesQuery,
  useGetAllInquiriesQuery,
} = adminApi;
