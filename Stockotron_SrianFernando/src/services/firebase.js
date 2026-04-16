/**
 * firebase.js
 * Firebase Realtime Database configuration and chat helper functions.
 *
 * Falls back gracefully if env vars are not set — the app will
 * still work; the Chat page will show a "Firebase not configured" banner.
 */

import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  push,
  onValue,
  off,
  serverTimestamp,
  query,
  limitToLast,
  orderByKey,
} from 'firebase/database';

// ─── Firebase config from env vars ───────────────────────────────────────────
const firebaseConfig = {
  apiKey:      import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId:   import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId:       import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = () =>
  Boolean(firebaseConfig.apiKey && firebaseConfig.databaseURL);

let app = null;
let db  = null;

if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig);
    db  = getDatabase(app);
  } catch (err) {
    console.error('[Firebase] init error:', err.message);
  }
}

// ─── Chat rooms ───────────────────────────────────────────────────────────────
/**
 * Predefined chat rooms. Users can also join a stock-specific room (e.g. AAPL).
 */
export const CHAT_ROOMS = [
  { id: 'general',    label: 'General Market',  icon: '📊' },
  { id: 'bulls',      label: 'Bulls Corner',    icon: '🐂' },
  { id: 'bears',      label: 'Bears Den',       icon: '🐻' },
  { id: 'crypto',     label: 'Crypto Talk',     icon: '₿'  },
];

/**
 * Send a chat message to a room.
 * @param {string} roomId - e.g. "general" or "AAPL"
 * @param {string} username
 * @param {string} text
 */
export const sendMessage = async (roomId, username, text) => {
  if (!db) throw new Error('Firebase not configured');
  const roomRef = ref(db, `chat/${roomId}`);
  await push(roomRef, {
    username,
    text:      text.trim(),
    timestamp: serverTimestamp(),
  });
};

/**
 * Subscribe to the last 50 messages in a room.
 * Returns an unsubscribe function.
 *
 * @param {string} roomId
 * @param {function} callback - called with array of message objects
 * @returns {function} unsubscribe
 */
export const subscribeToRoom = (roomId, callback) => {
  if (!db) {
    callback([]);
    return () => {};
  }
  const roomRef = query(
    ref(db, `chat/${roomId}`),
    orderByKey(),
    limitToLast(50),
  );
  const handler = (snapshot) => {
    const msgs = [];
    snapshot.forEach((child) => {
      msgs.push({ id: child.key, ...child.val() });
    });
    callback(msgs);
  };
  onValue(roomRef, handler);
  return () => off(roomRef, 'value', handler);
};

/**
 * Share a stock to a chat room as a structured message.
 * @param {string} roomId
 * @param {string} username
 * @param {object} stock - { symbol, price, changePercent }
 */
export const shareStockToChat = async (roomId, username, stock) => {
  const text = `📈 ${stock.symbol} @ $${stock.price.toFixed(2)} (${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%) — check it out!`;
  return sendMessage(roomId, username, text);
};
