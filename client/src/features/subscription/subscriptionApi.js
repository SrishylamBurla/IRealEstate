import { apiSlice } from "@/store/apiSlice";

export const subscriptionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    subscribeAgent: builder.mutation({
        query: (data) => ({
            url: "/subscribe/agent",
            method: "POST",
            body: data,
        }),
    }),
  }),
});

export const {
  useSubscribeAgentMutation,
} = subscriptionApi;