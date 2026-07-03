import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Registers the device for push notifications and stores the token in the DB.
 * Call this after the user logs in.
 * @param {string} userId
 * @returns {string|null} Expo push token
 */
export async function registerForPushNotifications(userId) {
  if (!Device.isDevice) {
    // Push notifications don't work on simulators
    return null;
  }

  // Check / request permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  // Android-specific channel setup
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Happipet',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6366f1',
    });
  }

  try {
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: 'REMPLACE_PAR_TON_EAS_PROJECT_ID',
    });
    const token = tokenData.data;

    // Persist the token in the profiles table
    if (userId && token) {
      await supabase
        .from('profiles')
        .update({ push_token: token })
        .eq('id', userId);
    }

    return token;
  } catch {
    return null;
  }
}

/**
 * Sends a push notification via the Expo Push API (server-side call).
 * In production this should be called from your backend / Supabase Edge Function.
 * @param {string} expoPushToken
 * @param {string} title
 * @param {string} body
 * @param {object} data - extra payload
 */
export async function sendPushNotification(expoPushToken, title, body, data = {}) {
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: expoPushToken,
      sound: 'default',
      title,
      body,
      data,
    }),
  });
}
