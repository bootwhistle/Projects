import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Grid, Typography, Box, Paper, List,
  ListItemButton, ListItemText, TextField, IconButton,
  Avatar, Divider, Chip, CircularProgress, Button,
  Alert,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ForumIcon from '@mui/icons-material/Forum';

import { useApp } from '../context/AppContext';
import {
  subscribeToRoom, sendMessage,
  CHAT_ROOMS, isFirebaseConfigured,
} from '../services/firebase';
import { formatDateTime } from '../utils/formatters';

export default function ChatPage() {
  const { username, setUsername } = useApp();
  const [nameInput,   setNameInput]   = useState('');
  const [activeRoom,  setActiveRoom]  = useState(CHAT_ROOMS[0].id);
  const [messages,    setMessages]    = useState([]);
  const [input,       setInput]       = useState('');
  const [loading,     setLoading]     = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setMessages([]);
    const unsubscribe = subscribeToRoom(activeRoom, (msgs) => {
      setMessages(msgs);
      setLoading(false);
    });
    return unsubscribe;
  }, [activeRoom]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !username) return;
    setInput('');
    try {
      await sendMessage(activeRoom, username, text);
    } catch (err) {
      console.error(err);
    }
  };

  const activeRoomLabel = CHAT_ROOMS.find(r => r.id === activeRoom)?.label || activeRoom;

  // ── Not configured ──────────────────────────────────────────────────────────
  if (!isFirebaseConfigured()) {
    return (
      <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
        <ForumIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h5" fontWeight={700} gutterBottom>Chat requires Firebase</Typography>
        <Alert severity="info" sx={{ textAlign: 'left', maxWidth: 520, mx: 'auto' }}>
          <Typography variant="body2">
            To enable real-time chat:
          </Typography>
          <ol style={{ marginTop: 8, paddingLeft: 20 }}>
            <li>Create a free project at <strong>console.firebase.google.com</strong></li>
            <li>Enable <strong>Realtime Database</strong></li>
            <li>Copy credentials into <code>.env</code> (see <code>.env.example</code>)</li>
            <li>Restart the dev server</li>
          </ol>
        </Alert>
      </Container>
    );
  }

  // ── Username prompt ─────────────────────────────────────────────────────────
  if (!username) {
    return (
      <Container maxWidth="xs" sx={{ py: 8, textAlign: 'center' }}>
        <ForumIcon sx={{ fontSize: 56, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" fontWeight={700} gutterBottom>Join the Chat</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Pick a display name to start chatting
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Your username"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && nameInput.trim() && setUsername(nameInput.trim())}
          />
          <Button
            variant="contained"
            onClick={() => nameInput.trim() && setUsername(nameInput.trim())}
            sx={{ minWidth: 100 }}
          >
            Join
          </Button>
        </Box>
      </Container>
    );
  }

  // ── Main chat layout ────────────────────────────────────────────────────────
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Community Chat
      </Typography>

      <Grid container spacing={2} sx={{ height: '70vh' }}>
        {/* Sidebar — room list */}
        <Grid item xs={12} sm={3}>
          <Paper sx={{ height: '100%', overflow: 'auto' }}>
            <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                Rooms
              </Typography>
            </Box>
            <List dense>
              {CHAT_ROOMS.map(room => (
                <ListItemButton
                  key={room.id}
                  selected={activeRoom === room.id}
                  onClick={() => setActiveRoom(room.id)}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <span>{room.icon}</span>
                        <Typography variant="body2" fontWeight={activeRoom === room.id ? 700 : 400}>
                          {room.label}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItemButton>
              ))}
            </List>

            <Divider sx={{ my: 1 }} />

            {/* Current user chip */}
            <Box sx={{ px: 2, pb: 1.5 }}>
              <Typography variant="caption" color="text.secondary">Chatting as</Typography>
              <Chip
                avatar={<Avatar sx={{ bgcolor: 'primary.dark' }}>{username[0].toUpperCase()}</Avatar>}
                label={username}
                size="small"
                sx={{ mt: 0.5, display: 'flex' }}
                onDelete={() => setUsername('')}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Chat panel */}
        <Grid item xs={12} sm={9} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Room header */}
            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight={700}>
                {CHAT_ROOMS.find(r => r.id === activeRoom)?.icon} {activeRoomLabel}
              </Typography>
            </Box>

            {/* Messages */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
                  <CircularProgress />
                </Box>
              ) : messages.length === 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                  <Typography color="text.secondary">No messages yet — say hello!</Typography>
                </Box>
              ) : (
                messages.map(msg => {
                  const isMine = msg.username === username;
                  return (
                    <Box
                      key={msg.id}
                      sx={{
                        display: 'flex',
                        flexDirection: isMine ? 'row-reverse' : 'row',
                        gap: 1,
                        alignItems: 'flex-start',
                      }}
                    >
                      <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', bgcolor: isMine ? 'primary.dark' : 'secondary.dark' }}>
                        {(msg.username?.[0] || '?').toUpperCase()}
                      </Avatar>
                      <Box sx={{ maxWidth: '70%' }}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline', flexDirection: isMine ? 'row-reverse' : 'row' }}>
                          <Typography variant="caption" fontWeight={700} color={isMine ? 'primary.main' : 'text.primary'}>
                            {msg.username}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                            {msg.timestamp ? formatDateTime(msg.timestamp) : ''}
                          </Typography>
                        </Box>
                        <Paper
                          elevation={0}
                          sx={{
                            px: 1.5, py: 1,
                            bgcolor: isMine ? 'primary.dark' : 'action.hover',
                            borderRadius: 2,
                            borderTopRightRadius: isMine ? 2 : 12,
                            borderTopLeftRadius:  isMine ? 12 : 2,
                            mt: 0.25,
                          }}
                        >
                          <Typography variant="body2">{msg.text}</Typography>
                        </Paper>
                      </Box>
                    </Box>
                  );
                })
              )}
              <div ref={bottomRef} />
            </Box>

            {/* Input */}
            <Divider />
            <Box sx={{ display: 'flex', gap: 1, p: 1.5 }}>
              <TextField
                fullWidth
                size="small"
                placeholder={`Message #${activeRoomLabel}…`}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                multiline
                maxRows={3}
              />
              <IconButton color="primary" onClick={handleSend} disabled={!input.trim()}>
                <SendIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
