// src/lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";
import { handleSessionExpired } from "./auth";

const queryClient = new QueryClient();

// Global error handler — wrap with this instead of using `onError` in defaultOptions
// queryClient.setDefaultOptions({
//   queries: {
//     retry: false,
//     onError: (error: any) => {
//       if (error?.response?.status === 401 || error?.status === 401 || error.message === "Unauthorized") {
//         handleSessionExpired();
//       }
//     },
//   },
//   mutations: {
//     retry: false,
//     onError: (error: any) => {
//       if (error?.response?.status === 401 || error?.status === 401 || error.message === "Unauthorized") {
//         handleSessionExpired();
//       }
//     },
//   },
// });

export default queryClient;
