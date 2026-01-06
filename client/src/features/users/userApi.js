import { apiSlice } from "@/store/apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/users/login",
        method: "POST",
        body: data,
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: "/users/register",
        method: "POST",
        body: data,
      }),
    }),
    uploadAvatar: builder.mutation({
      query: (formData) => ({
        url: "/users/avatar",
        method: "PUT",
        body: formData,
      }),
      providesTags: ["User"],
    }),
    updateAvatar: builder.mutation({
      query: (formData) => ({
        url: "/users/avatar",
        method: "PUT",
        body: formData,
      }),
      providesTags: ["User"],
    }),
    removeAvatar: builder.mutation({
      query: () => ({
        url: "/users/avatar",
        method: "DELETE",
      }),
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/profile",
        method: "PUT",
        body: data,
      }),
    }),

    updateNotificationPreference: builder.mutation({
      query: ({ permission, token }) => ({
        url: "/users/notifications",
        method: "PUT",
        body: { permission, token },
      }),
    }),
    updateNotificationPreferences: builder.mutation({
      query: (data) => ({
        url: "/users/notification-preferences",
        method: "PUT",
        body: data,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/users/change-password",
        method: "PUT",
        body: data,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/users/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: "/users/reset-password",
        method: "POST",
        body: { token, password },
      }),
    }),
    requestLoginOtp: builder.mutation({
      query: (data) => ({
        url: "/users/login-otp",
        method: "POST",
        body: data,
      }),
    }),

    verifyLoginOtp: builder.mutation({
      query: (data) => ({
        url: "/users/verify-login-otp",
        method: "POST",
        body: data,
      }),
    }),

    requestMobileOtp: builder.mutation({
      query: (data) => ({
        url: "/users/request-mobile-otp",
        method: "POST",

        body: data,
      }),
    }),

    verifyMobileOtp: builder.mutation({
      query: (data) => ({
        url: "/users/verify-mobile-otp",
        method: "POST",
        body: data,
      }),
    }),
    getNotificationPreferences: builder.query({
      query: () => "/users/notifications/preferences",
    }),
   
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useUploadAvatarMutation,
  useUpdateAvatarMutation,
  useRemoveAvatarMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateNotificationPreferenceMutation,
  useUpdateNotificationPreferencesMutation,
  useRequestLoginOtpMutation,
  useVerifyLoginOtpMutation,
  useRequestMobileOtpMutation,
  useVerifyMobileOtpMutation,
  useGetNotificationPreferencesQuery,
} = userApi;
