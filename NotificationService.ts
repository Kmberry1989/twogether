import * as Notifications from 'expo-notifications';

export const scheduleDailyReminder = async (hour: number, minute: number) => {
  await Notifications.requestPermissionsAsync();
  await Notifications.cancelAllScheduledNotificationsAsync();
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Twogether Reminder',
      body: "Don't forget today's activity!",
    },
    trigger: { hour, minute, repeats: true },
  });
};

export const cancelAllReminders = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};
