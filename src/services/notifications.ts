/**
 * Utility for managing browser push notifications
 */

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.warn("This browser does not support desktop notification");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

export const sendNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === "granted") {
    new Notification(title, {
      icon: "/logo192.png",
      badge: "/logo192.png",
      ...options
    });
  }
};

/**
 * Check for due problems and notify if enabled
 */
export const checkAndNotifyDue = (problems: any[]) => {
  const settings = JSON.parse(localStorage.getItem('o1knot_settings') || '{}');
  if (!settings.notificationsEnabled) return;

  const now = new Date();
  const dueCount = problems.filter(p => {
    if (!p.nextReview) return false;
    return new Date(p.nextReview) <= now;
  }).length;

  if (dueCount > 0) {
    // Only notify if we haven't notified today
    const lastNotified = localStorage.getItem('o1knot_last_notified');
    const today = now.toISOString().split('T')[0];

    if (lastNotified !== today) {
      sendNotification(`Revision Due: ${dueCount} problems`, {
        body: "Time to keep your streaks alive! Jump back into O(1) Knot.",
        tag: "due-problems"
      });
      localStorage.setItem('o1knot_last_notified', today);
    }
  }
};
