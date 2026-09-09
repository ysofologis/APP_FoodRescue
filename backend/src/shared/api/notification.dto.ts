export enum NotificationType {
  LISTING_CLAIMED = 'LISTING_CLAIMED',
  PICKUP_CONFIRMED = 'PICKUP_CONFIRMED',
  DISTRIBUTION_COMPLETED = 'DISTRIBUTION_COMPLETED',
  LISTING_EXPIRING = 'LISTING_EXPIRING',
  VERIFICATION_REQUIRED = 'VERIFICATION_REQUIRED',
}

export interface NotificationDto {
  id: string;
  type: NotificationType;
  recipientId: string;
  message: string;
  read: boolean;
  createdAt: Date;
}
