/**
 * ChatWidget.jsx
 * Compact inline chat panel used on the Stock Details page.
 * Shows a stock-specific room (e.g., "AAPL" room).
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, TextField, IconButton,
  Paper, Avatar, Divider, CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { subscribeToRoom, sendMessage, isFirebaseConfigured } from '../services/firebase';
import { useApp } from '../context/AppContext';
import { formatDateTime } from '../utils/formatters';

export default function ChatWidget({ symbol }) {
  const { username, setUsername } = useApp();
  const [messages, setMessages]   = useState([]);
  const [input,    setInput]      = useState('');
  const [nameInput, setNameInput] = useState('');
  const [loading,  setLoading]    = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToRoom(symbol, (msgs) => {
      setMessages(msgs);
      setLoading(false);
    });
    return unsubscribe;
  }, [symbol]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !username) return;
    setInput('');
    try {
      await sendMessage(symbol, username, text);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isFirebaseConfigured()) {
    return (
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Chat unavailable — add Firebase credentials to <code>.env</code>
        </Typography>
      </Paper>
    );
  }

  if (!username) {
    return (
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="subtitle2" gutterBottom>Join the {symbol} chat</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            placeholder="Pick a username"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && nameInput.trim() && setUsername(nameInput.trim())}
            fullWidth
          />
          <IconButton
            color="primary"
            onClick={() => nameInput.trim() && setUsername(nameInput.trim())}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ px: 2, py: 1, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle2" fontWeight={700}>
          #{symbol} Chat
        </Typography>
      </Box>

      {/* Messages */}
      <Box sx={{ height: 260, overflowY: 'auto', p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : messages.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
            No messages yet. Be the first!
          </Typography>
        ) : (
          messages.map(msg => (
            <Box key={msg.id} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <Avatar sx={{ width: 28, height: 28, fontSize: '0.7rem', bgcolor: 'primary.dark' }}>
                {(msg.username?.[0] || '?').toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline' }}>
                  <Typography variant="caption" fontWeight={700} color={msg.username === username ? 'primary.main' : 'text.primary'}>
                    {msg.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                    {msg.timestamp ? formatDateTime(msg.timestamp) : ''}
                  </Typography>
                </Box>
                <Typography variant="body2">{msg.text}</Typography>
              </Box>
            </Box>
          ))
        )}
        <div ref={bottomRef} />
      </Box>

      <Divider />

      {/* Input */}
      <Box sx={{ display: 'flex', gap: 1, p: 1.5 }}>
        <TextField
          size="small"
          placeholder={`Message as ${username}…`}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          fullWidth
          multiline
          maxRows={2}
        />
        <IconButton color="primary" onClick={handleSend} disabled={!input.trim()}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}
