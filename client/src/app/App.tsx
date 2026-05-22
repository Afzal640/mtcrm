import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { Toaster } from "sonner";
import { router } from "./routes";

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
        <Toaster position="bottom-right" richColors />
      </NotificationProvider>
    </AuthProvider>
  );
}