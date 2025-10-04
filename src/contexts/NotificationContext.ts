import { createContext } from "react";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { NotificationType } from "@/provider/NotificationProvider";

interface NotificationContextType {
  api: NotificationInstance;
  openNotificationWithIcon: (
    type: NotificationType,
    title: string,
    message: string
  ) => void;
}

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);
