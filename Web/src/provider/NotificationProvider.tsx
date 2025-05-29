import { createContext, useContext, useState, type ReactNode } from "react";
import CustomSnackbar, {
  type NotificationType,
} from "../components/custom-snackbar";

interface NotificationContextType {
  showNotification: (message: string, type: NotificationType) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: NotificationType;
    autoHideDuration?: number;
  }>({
    open: false,
    message: "",
    type: "info",
    autoHideDuration: 3000,
  });

  const showNotification = (
    message: string,
    type: NotificationType,
    autoHideDuration?: number
  ) => {
    setNotification({
      open: true,
      message,
      type,
      autoHideDuration,
    });
  };

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const showSuccess = (message: string, autoHideDuration?: number) =>
    showNotification(message, "success", autoHideDuration);

  const showError = (message: string, autoHideDuration?: number) =>
    showNotification(message, "error", autoHideDuration);

  const showWarning = (message: string, autoHideDuration?: number) =>
    showNotification(message, "warning", autoHideDuration);

  const showInfo = (message: string, autoHideDuration?: number) =>
    showNotification(message, "info", autoHideDuration);

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        hideNotification,
      }}
    >
      {children}
      <CustomSnackbar
        open={notification.open}
        onClose={hideNotification}
        message={notification.message}
        type={notification.type}
        autoHideDuration={notification.autoHideDuration}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
