// features/admin/adminPropertyApi.js
import { apiSlice } from "@/store/apiSlice";

export const adminPropertyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPendingProperties: builder.query({
      query: () => "/admin/properties/pending",
      providesTags: [{ type: "Property", id: "LIST" }],
    }),

    approveProperty: builder.mutation({
      query: (id) => ({
        url: `/properties/${id}/approve`,
        method: "PUT",
      }),
      invalidatesTags: (r, e, id) => [
        { type: "Property", id },
        { type: "Property", id: "LIST" },
        { type: "PropertyHistory", id },
      ],
    }),

    rejectProperty: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/admin/properties/${id}/reject`,
        method: "PUT",
        body: { reason },
      }),
      invalidatesTags: (r, e, { id }) => [
        { type: "Property", id },
        { type: "Property", id: "LIST" },
        { type: "PropertyHistory", id },
      ],
    }),

    undoRejectProperty: builder.mutation({
      query: (id) => ({
        url: `/admin/properties/${id}/undo-reject`,
        method: "PUT",
      }),
      invalidatesTags: (r, e, id) => [
        { type: "Property", id },
        { type: "Property", id: "LIST" },
        { type: "PropertyHistory", id },
      ],
    }),

    getPropertyApprovalHistory: builder.query({
      query: (id) => `/admin/properties/${id}/history`,
      providesTags: (r, e, id) => [
        { type: "PropertyHistory", id },
        { type: "PropertyHistory", id: "LIST" },
      ],
      keepUnusedDataFor: 0, // 🔥 IMPORTANT
    }),
  }),
});

export const {
  useGetPendingPropertiesQuery,
  useApprovePropertyMutation,
  useRejectPropertyMutation,
  useUndoRejectPropertyMutation,
  useGetPropertyApprovalHistoryQuery,
} = adminPropertyApi;
