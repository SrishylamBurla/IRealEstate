import { apiSlice } from "../../store/apiSlice";

export const propertyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProperties: builder.query({
      query: (params) => ({
        url: "/properties",
        params,
      }),
      providesTags: [{ type: "Property", id: "LIST" }],
    }),

    getPropertyById: builder.query({
      query: (id) => `/properties/${id}`,
      providesTags: (result, error, id) => [{ type: "Property", id }],
    }),

    getMyProperties: builder.query({
      query: () => "/properties/my",
      providesTags: [{ type: "Property", id: "LIST" }],
    }),

    createProperty: builder.mutation({
      query: (formData) => ({
        url: "/properties",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Property", id: "LIST" }],
    }),

    updateProperty: builder.mutation({
      query: ({ id, data }) => ({
        url: `/properties/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "Property", id: "LIST" }],
    }),

    softDeleteProperty: builder.mutation({
      query: (id) => ({
        url: `/properties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Property", id: "LIST" }],
    }),

    permanentDeleteProperty: builder.mutation({
      query: (id) => ({
        url: `/properties/${id}/permanent`,
        method: "DELETE",
      }),
      invalidatesTags: ["Property"],
    }),

    updatePropertyImages: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/properties/${id}/images`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: [{ type: "Property", id: "LIST" }],
    }),

    getMyDeletedProperties: builder.query({
      query: () => "/properties/trash",
      providesTags: [{ type: "Property", id: "LIST" }],
    }),

    restoreProperty: builder.mutation({
      query: (id) => ({
        url: `/properties/${id}/restore`,
        method: "PUT",
      }),
      invalidatesTags: [{ type: "Property", id: "LIST" }],
    }),

    resubmitProperty: builder.mutation({
      query: ({ id, data }) => ({
        url: `/properties/${id}/resubmit`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "Property", id: "LIST" }],
    }),

    getAdminTrash: builder.query({
      query: () => "/properties/admin/trash",
      providesTags: [{ type: "Property", id: "LIST" }],
    }),

    // getPropertyApprovalHistory: builder.query({
    //   query: (id) => `/admin/properties/${id}/history`,
    //   providesTags: (result, error, id) => [{ type: "PropertyHistory", id }],
    // }),
  }),
});

export const {
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
  useCreatePropertyMutation,
  useGetMyPropertiesQuery,
  useGetAdminTrashQuery,
  useUpdatePropertyMutation,
  useSoftDeletePropertyMutation,
  usePermanentDeletePropertyMutation,
  useUpdatePropertyImagesMutation,
  useGetMyDeletedPropertiesQuery,
  useRestorePropertyMutation,
  useResubmitPropertyMutation,
} = propertyApi;
