# 💬 WhatsApp-Like Chat System Implementation Guide

## Table of Contents
1. [Overview](#overview)
2. [Current Project Analysis](#current-project-analysis)
3. [Technical Stack](#technical-stack)
4. [Architecture Design](#architecture-design)
5. [Database Schema](#database-schema)
6. [Frontend Implementation](#frontend-implementation)
7. [Backend Implementation](#backend-implementation)
8. [Key Features](#key-features)
9. [Performance Optimization](#performance-optimization)
10. [Security Considerations](#security-considerations)
11. [Implementation Phases](#implementation-phases)
12. [Code Examples](#code-examples)
13. [Alternative Approaches](#alternative-approaches)

---

## Overview

This guide provides a comprehensive roadmap for building a smooth, production-grade real-time chat system for team communication within the Techxudo OMS application. The goal is to achieve WhatsApp-level performance and user experience.

### Success Criteria
- **Real-time messaging** with <100ms latency
- **Smooth scrolling** with 10,000+ messages
- **Offline support** with message queuing
- **Read receipts** and typing indicators
- **File/image sharing** with preview
- **99.9% uptime** with auto-reconnection

---

## Current Project Analysis

### Existing Tech Stack
- **Frontend:** React 18.2, Vite 5.0
- **State Management:** Redux Toolkit 1.9.7, RTK Query
- **Routing:** React Router DOM 6.20.0
- **Styling:** Tailwind CSS 4.1.17
- **Forms:** Formik 2.4.5 + Yup 1.3.3
- **Icons:** Lucide React 0.294.0
- **Notifications:** Sonner 1.2.0
- **Animations:** Framer Motion 10.16.5
- **HTTP Client:** Axios 1.6.2
- **Auth:** JWT-Decode 4.0.0
- **File Storage:** Cloudinary

### Current Architecture Patterns
- **API Layer:** RTK Query with feature-based slices
- **Authentication:** JWT tokens in localStorage + Redux
- **Component Structure:** Feature-based organization (admin/employee/shared)
- **Custom Hooks:** Encapsulation pattern (useAuth, useOnboarding)
- **Routing:** Role-based access control with PrivateRoute

### Gap Analysis
❌ **No real-time communication** (WebSocket/Socket.IO)
❌ **No message persistence** layer
❌ **No virtual scrolling** for large datasets
❌ **No offline support** or service workers
❌ **No pub/sub architecture** for scalability

---

## Technical Stack

### Frontend Dependencies (New)

```json
{
  "dependencies": {
    "socket.io-client": "^4.7.2",
    "react-virtuoso": "^4.6.2",
    "dexie": "^3.2.4",
    "dexie-react-hooks": "^1.1.7",
    "@emoji-mart/react": "^1.1.1",
    "@emoji-mart/data": "^1.1.2",
    "react-markdown": "^9.0.1",
    "remark-gfm": "^4.0.0",
    "date-fns": "^2.30.0",
    "react-intersection-observer": "^9.5.3"
  }
}
```

**Purpose:**
- `socket.io-client` - Real-time WebSocket communication
- `react-virtuoso` - Virtual scrolling for message lists
- `dexie` - IndexedDB wrapper for local message cache
- `@emoji-mart/react` - Emoji picker component
- `react-markdown` - Message text formatting
- `date-fns` - Timestamp formatting
- `react-intersection-observer` - Lazy loading media

### Backend Dependencies (New)

```json
{
  "dependencies": {
    "socket.io": "^4.7.2",
    "socket.io-redis": "^6.1.1",
    "redis": "^4.6.10",
    "ioredis": "^5.3.2",
    "bull": "^4.12.0",
    "mongoose": "^8.0.0",
    "multer": "^1.4.5-lts.1",
    "compression": "^1.7.4",
    "helmet": "^7.1.0"
  }
}
```

**Purpose:**
- `socket.io` - WebSocket server
- `socket.io-redis` - Multi-server synchronization
- `redis`/`ioredis` - Pub/Sub and caching
- `bull` - Message queue for reliable delivery
- `mongoose` - MongoDB ODM
- `multer` - File upload handling
- `compression` - Response compression
- `helmet` - Security headers

---

## Architecture Design

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (React)                        │
├─────────────────────────────────────────────────────────────┤
│  Components  │  Redux Store  │  Socket.IO Client  │ IndexedDB│
│  - ChatList  │  - chatSlice  │  - Connection Mgr  │ - Cache  │
│  - Messages  │  - apiSlice   │  - Event Handlers  │ - Queue  │
│  - Input     │               │                    │          │
└──────┬───────────────┬───────────────┬────────────┴──────────┘
       │               │               │
       │ REST API      │ WebSocket     │ Service Worker
       │               │               │
┌──────▼───────────────▼───────────────▼────────────────────────┐
│                     API Gateway / Load Balancer               │
└──────┬───────────────┬────────────────────────────────────────┘
       │               │
       │ HTTP          │ WebSocket
       │               │
┌──────▼───────┐  ┌───▼─────────────────────────────────────────┐
│ Express API  │  │       Socket.IO Server Cluster              │
│              │  │  ┌──────┐  ┌──────┐  ┌──────┐              │
│ REST Routes  │  │  │ Node │  │ Node │  │ Node │              │
│ - Auth       │  │  │  1   │  │  2   │  │  3   │              │
│ - Users      │  │  └───┬──┘  └───┬──┘  └───┬──┘              │
│ - Files      │  │      └─────────┼─────────┘                 │
└──────┬───────┘  └────────────────┼───────────────────────────┘
       │                            │
       │                    ┌───────▼────────┐
       │                    │  Redis Pub/Sub │
       │                    │  (Adapter)     │
       │                    └───────┬────────┘
       │                            │
┌──────▼────────────────────────────▼─────────────────────┐
│                    Data Layer                            │
├──────────────────────┬───────────────────┬───────────────┤
│   MongoDB            │   Redis Cache     │  Bull Queue   │
│  - Messages          │  - Online Users   │  - Message    │
│  - Chats             │  - Typing Status  │    Delivery   │
│  - Users             │  - Unread Counts  │  - Retries    │
└──────────────────────┴───────────────────┴───────────────┘
       │
       │ CDN
       │
┌──────▼────────────────────────────────────────────────────┐
│              Cloudinary (Media Storage)                    │
└────────────────────────────────────────────────────────────┘
```

### Message Flow

```
User A sends message:
1. UI → optimistic update (show message immediately)
2. Redux → dispatch sendMessage action
3. Socket.IO Client → emit "message:send" event
4. Socket.IO Server → authenticate & validate
5. MongoDB → persist message
6. Redis Pub/Sub → broadcast to all server instances
7. Bull Queue → queue for delivery to offline users
8. Socket.IO Server → emit "message:new" to User B's socket
9. User B Client → Redux → UI update
10. User B Client → emit "message:delivered" acknowledgment
11. User A Client → update message status to "delivered"
```

---

## Database Schema

### MongoDB Collections

#### 1. Messages Collection
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  chatId: "chat_abc123",
  senderId: "user_123",
  senderName: "John Doe",
  senderAvatar: "https://cloudinary.com/avatar.jpg",
  content: "Hello, how are you?",
  type: "text", // text | image | file | audio | system
  attachments: [
    {
      url: "https://cloudinary.com/file.pdf",
      name: "document.pdf",
      size: 1024000,
      mimeType: "application/pdf",
      thumbnail: "https://cloudinary.com/thumb.jpg"
    }
  ],
  status: "delivered", // sending | sent | delivered | read | failed
  replyTo: ObjectId("507f1f77bcf86cd799439010"), // For threaded replies
  mentions: ["user_456", "user_789"], // @mentions
  reactions: [
    { userId: "user_456", emoji: "👍", timestamp: ISODate }
  ],
  edited: false,
  editedAt: null,
  deleted: false,
  deletedFor: [], // ["user_123"] for delete-for-me
  timestamp: ISODate("2024-01-15T10:30:00Z"),
  deliveredAt: ISODate("2024-01-15T10:30:01Z"),
  readAt: ISODate("2024-01-15T10:30:05Z"),
  metadata: {
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0...",
    deviceType: "mobile"
  }
}
```

**Indexes:**
```javascript
db.messages.createIndex({ chatId: 1, timestamp: -1 });
db.messages.createIndex({ senderId: 1 });
db.messages.createIndex({ "attachments.url": 1 });
db.messages.createIndex({ timestamp: -1 });
```

#### 2. Chats Collection
```javascript
{
  _id: "chat_abc123",
  type: "direct", // direct | group | channel
  participants: [
    {
      userId: "user_123",
      role: "member", // admin | member
      joinedAt: ISODate,
      lastRead: ObjectId("507f1f77bcf86cd799439011"), // Last read message ID
      unreadCount: 5,
      muted: false,
      archived: false,
      pinnedMessages: [ObjectId("507f1f77bcf86cd799439010")]
    },
    {
      userId: "user_456",
      role: "member",
      joinedAt: ISODate,
      lastRead: ObjectId("507f1f77bcf86cd799439009"),
      unreadCount: 12,
      muted: false,
      archived: false
    }
  ],
  name: "Project Discussion", // For group chats
  avatar: "https://cloudinary.com/group.jpg",
  description: "Team chat for Project X",
  lastMessage: {
    _id: ObjectId("507f1f77bcf86cd799439011"),
    content: "Hello, how are you?",
    senderId: "user_123",
    senderName: "John Doe",
    timestamp: ISODate,
    type: "text"
  },
  createdBy: "user_123",
  createdAt: ISODate,
  updatedAt: ISODate,
  settings: {
    onlyAdminsCanPost: false,
    membersCanAddOthers: true,
    disappearingMessages: null // or 86400 (seconds)
  }
}
```

**Indexes:**
```javascript
db.chats.createIndex({ "participants.userId": 1 });
db.chats.createIndex({ updatedAt: -1 });
db.chats.createIndex({ type: 1 });
```

#### 3. Users Collection (extend existing)
```javascript
{
  _id: "user_123",
  // ... existing user fields ...
  chatSettings: {
    online: true,
    lastSeen: ISODate,
    status: "available", // available | busy | away | offline
    statusMessage: "Working on Project X",
    readReceipts: true,
    typingIndicators: true,
    notificationSound: true
  },
  blockedUsers: ["user_999"],
  socketIds: ["socket_abc", "socket_xyz"] // Multiple devices
}
```

---

## Frontend Implementation

### Redux Store Structure

```javascript
// src/shared/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import chatReducer from './features/chatSlice';
import { apiSlice } from './features/apiSlice';
import socketMiddleware from './middleware/socketMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['socket/connect', 'socket/disconnect'],
      },
    })
      .concat(apiSlice.middleware)
      .concat(socketMiddleware),
});
```

### Chat Slice

```javascript
// src/shared/store/features/chatSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeChat: null,
  chats: {},
  messages: {},
  onlineUsers: [],
  typingUsers: {},
  connectionStatus: 'disconnected', // disconnected | connecting | connected
  unreadTotal: 0,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },

    addChat: (state, action) => {
      const chat = action.payload;
      state.chats[chat._id] = chat;
    },

    updateChat: (state, action) => {
      const { chatId, updates } = action.payload;
      if (state.chats[chatId]) {
        state.chats[chatId] = { ...state.chats[chatId], ...updates };
      }
    },

    addMessage: (state, action) => {
      const message = action.payload;
      if (!state.messages[message.chatId]) {
        state.messages[message.chatId] = [];
      }
      state.messages[message.chatId].push(message);

      // Update last message in chat
      if (state.chats[message.chatId]) {
        state.chats[message.chatId].lastMessage = {
          _id: message._id,
          content: message.content,
          senderId: message.senderId,
          senderName: message.senderName,
          timestamp: message.timestamp,
          type: message.type,
        };
      }
    },

    updateMessage: (state, action) => {
      const { chatId, messageId, updates } = action.payload;
      const messages = state.messages[chatId];
      if (messages) {
        const index = messages.findIndex(m => m._id === messageId);
        if (index !== -1) {
          messages[index] = { ...messages[index], ...updates };
        }
      }
    },

    deleteMessage: (state, action) => {
      const { chatId, messageId } = action.payload;
      const messages = state.messages[chatId];
      if (messages) {
        const index = messages.findIndex(m => m._id === messageId);
        if (index !== -1) {
          messages.splice(index, 1);
        }
      }
    },

    setTypingUser: (state, action) => {
      const { chatId, userId, isTyping } = action.payload;
      if (!state.typingUsers[chatId]) {
        state.typingUsers[chatId] = [];
      }
      if (isTyping) {
        if (!state.typingUsers[chatId].includes(userId)) {
          state.typingUsers[chatId].push(userId);
        }
      } else {
        state.typingUsers[chatId] = state.typingUsers[chatId].filter(
          id => id !== userId
        );
      }
    },

    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;
    },

    markChatAsRead: (state, action) => {
      const chatId = action.payload;
      if (state.chats[chatId]) {
        state.chats[chatId].unreadCount = 0;
      }
    },

    incrementUnreadCount: (state, action) => {
      const chatId = action.payload;
      if (state.chats[chatId]) {
        state.chats[chatId].unreadCount += 1;
      }
      state.unreadTotal += 1;
    },
  },
});

export const {
  setActiveChat,
  addChat,
  updateChat,
  addMessage,
  updateMessage,
  deleteMessage,
  setTypingUser,
  setOnlineUsers,
  setConnectionStatus,
  markChatAsRead,
  incrementUnreadCount,
} = chatSlice.actions;

export default chatSlice.reducer;

// Selectors
export const selectActiveChat = (state) => state.chat.activeChat;
export const selectChatById = (chatId) => (state) => state.chat.chats[chatId];
export const selectMessagesByChatId = (chatId) => (state) =>
  state.chat.messages[chatId] || [];
export const selectTypingUsers = (chatId) => (state) =>
  state.chat.typingUsers[chatId] || [];
export const selectOnlineUsers = (state) => state.chat.onlineUsers;
export const selectConnectionStatus = (state) => state.chat.connectionStatus;
```

### Socket Middleware

```javascript
// src/shared/store/middleware/socketMiddleware.js
import io from 'socket.io-client';
import {
  addMessage,
  updateMessage,
  setTypingUser,
  setOnlineUsers,
  setConnectionStatus,
  incrementUnreadCount,
} from '../features/chatSlice';

let socket = null;

const socketMiddleware = (store) => (next) => (action) => {
  const { type, payload } = action;

  // Connect socket
  if (type === 'socket/connect') {
    if (socket?.connected) return next(action);

    const token = store.getState().auth.token;

    socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Connection events
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      store.dispatch(setConnectionStatus('connected'));
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      store.dispatch(setConnectionStatus('disconnected'));
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      store.dispatch(setConnectionStatus('error'));
    });

    // Chat events
    socket.on('message:new', (message) => {
      store.dispatch(addMessage(message));

      // Increment unread count if not in active chat
      const activeChat = store.getState().chat.activeChat;
      if (activeChat !== message.chatId) {
        store.dispatch(incrementUnreadCount(message.chatId));
      }
    });

    socket.on('message:delivered', ({ messageId, deliveredAt }) => {
      store.dispatch(
        updateMessage({
          chatId: payload.chatId,
          messageId,
          updates: { status: 'delivered', deliveredAt },
        })
      );
    });

    socket.on('message:read', ({ messageId, readAt }) => {
      store.dispatch(
        updateMessage({
          chatId: payload.chatId,
          messageId,
          updates: { status: 'read', readAt },
        })
      );
    });

    socket.on('typing:start', ({ chatId, userId, userName }) => {
      store.dispatch(setTypingUser({ chatId, userId, isTyping: true }));

      // Auto-clear after 3 seconds
      setTimeout(() => {
        store.dispatch(setTypingUser({ chatId, userId, isTyping: false }));
      }, 3000);
    });

    socket.on('typing:stop', ({ chatId, userId }) => {
      store.dispatch(setTypingUser({ chatId, userId, isTyping: false }));
    });

    socket.on('users:online', (userIds) => {
      store.dispatch(setOnlineUsers(userIds));
    });
  }

  // Disconnect socket
  if (type === 'socket/disconnect') {
    if (socket) {
      socket.disconnect();
      socket = null;
      store.dispatch(setConnectionStatus('disconnected'));
    }
  }

  // Send message
  if (type === 'chat/sendMessage' && socket) {
    const { chatId, content, type: msgType, attachments } = payload;

    socket.emit(
      'message:send',
      { chatId, content, type: msgType, attachments },
      (acknowledgment) => {
        if (acknowledgment.error) {
          console.error('Message send failed:', acknowledgment.error);
          store.dispatch(
            updateMessage({
              chatId,
              messageId: acknowledgment.tempId,
              updates: { status: 'failed' },
            })
          );
        } else {
          // Update temp message with real ID from server
          store.dispatch(
            updateMessage({
              chatId,
              messageId: acknowledgment.tempId,
              updates: {
                _id: acknowledgment.messageId,
                status: 'sent',
                timestamp: acknowledgment.timestamp,
              },
            })
          );
        }
      }
    );
  }

  // Join chat room
  if (type === 'chat/joinRoom' && socket) {
    socket.emit('chat:join', payload.chatId);
  }

  // Leave chat room
  if (type === 'chat/leaveRoom' && socket) {
    socket.emit('chat:leave', payload.chatId);
  }

  // Typing indicator
  if (type === 'chat/typing' && socket) {
    socket.emit('typing:start', payload.chatId);
  }

  if (type === 'chat/stopTyping' && socket) {
    socket.emit('typing:stop', payload.chatId);
  }

  return next(action);
};

export default socketMiddleware;
```

### Component Structure

```
src/shared/components/chat/
├── ChatLayout.jsx              # Main chat container with sidebar
├── ChatSidebar/
│   ├── ChatSidebar.jsx         # Chat list container
│   ├── ChatListItem.jsx        # Individual chat preview
│   ├── ChatSearch.jsx          # Search chats
│   └── NewChatButton.jsx       # Create new chat
├── ChatWindow/
│   ├── ChatWindow.jsx          # Active chat container
│   ├── ChatHeader.jsx          # Chat title, online status, actions
│   ├── MessageList.jsx         # Virtualized message list
│   ├── MessageBubble.jsx       # Individual message bubble
│   ├── MessageInput.jsx        # Input with emoji, files, mentions
│   ├── TypingIndicator.jsx    # "User is typing..."
│   └── AttachmentPreview.jsx  # Image/file preview before send
├── Shared/
│   ├── EmojiPicker.jsx         # Emoji selector
│   ├── FileUploader.jsx        # Drag-drop file upload
│   ├── UserAvatar.jsx          # Avatar with online indicator
│   ├── MessageStatus.jsx       # Checkmarks (sent/delivered/read)
│   └── TimeStamp.jsx           # Formatted time display
└── Modals/
    ├── NewGroupModal.jsx       # Create group chat
    ├── ChatInfoModal.jsx       # Chat details, members
    └── ImageLightbox.jsx       # Full-screen image viewer
```

### Key Component Examples

#### ChatLayout.jsx
```javascript
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatSidebar from './ChatSidebar/ChatSidebar';
import ChatWindow from './ChatWindow/ChatWindow';
import { selectActiveChat } from '../../store/features/chatSlice';

const ChatLayout = () => {
  const dispatch = useDispatch();
  const activeChat = useSelector(selectActiveChat);

  useEffect(() => {
    // Connect socket on mount
    dispatch({ type: 'socket/connect' });

    return () => {
      // Disconnect on unmount
      dispatch({ type: 'socket/disconnect' });
    };
  }, [dispatch]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <ChatSidebar />

      {/* Main chat area */}
      {activeChat ? (
        <ChatWindow />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a chat to start messaging
        </div>
      )}
    </div>
  );
};

export default ChatLayout;
```

#### MessageList.jsx (with Virtual Scrolling)
```javascript
import React, { useRef, useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useSelector } from 'react-redux';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { selectMessagesByChatId, selectTypingUsers } from '../../../store/features/chatSlice';

const MessageList = ({ chatId }) => {
  const messages = useSelector(selectMessagesByChatId(chatId));
  const typingUsers = useSelector(selectTypingUsers(chatId));
  const virtuosoRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (messages.length > 0) {
      virtuosoRef.current?.scrollToIndex({
        index: messages.length - 1,
        behavior: 'smooth',
      });
    }
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-hidden">
      <Virtuoso
        ref={virtuosoRef}
        data={messages}
        itemContent={(index, message) => (
          <MessageBubble key={message._id} message={message} />
        )}
        followOutput="smooth"
        initialTopMostItemIndex={messages.length - 1}
        className="h-full"
      />
      {typingUsers.length > 0 && <TypingIndicator users={typingUsers} />}
    </div>
  );
};

export default MessageList;
```

#### MessageBubble.jsx
```javascript
import React from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';
import UserAvatar from '../Shared/UserAvatar';

const MessageBubble = React.memo(({ message }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const isOwn = message.senderId === currentUser.id;

  const renderStatus = () => {
    if (!isOwn) return null;

    switch (message.status) {
      case 'sending':
        return <span className="text-gray-400 text-xs">⏱️</span>;
      case 'sent':
        return <Check className="w-4 h-4 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
      case 'failed':
        return <span className="text-red-500 text-xs">❌</span>;
      default:
        return null;
    }
  };

  return (
    <div className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {!isOwn && (
        <UserAvatar
          src={message.senderAvatar}
          name={message.senderName}
          size="sm"
          className="mr-2"
        />
      )}

      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwn
            ? 'bg-brand-primary text-white rounded-br-none'
            : 'bg-white text-gray-900 rounded-bl-none shadow'
        }`}
      >
        {!isOwn && (
          <div className="text-xs font-semibold text-brand-primary mb-1">
            {message.senderName}
          </div>
        )}

        {message.type === 'text' && (
          <p className="text-sm break-words">{message.content}</p>
        )}

        {message.type === 'image' && (
          <img
            src={message.attachments[0].url}
            alt="attachment"
            className="rounded-lg max-w-full cursor-pointer"
            loading="lazy"
          />
        )}

        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-xs opacity-75">
            {format(new Date(message.timestamp), 'HH:mm')}
          </span>
          {renderStatus()}
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if message ID or status changed
  return (
    prevProps.message._id === nextProps.message._id &&
    prevProps.message.status === nextProps.message.status
  );
});

export default MessageBubble;
```

#### MessageInput.jsx
```javascript
import React, { useState, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Smile, Paperclip, Send } from 'lucide-react';
import EmojiPicker from '../Shared/EmojiPicker';
import { uploadToCloudinary } from '../../../utils/cloudinary';
import { nanoid } from '@reduxjs/toolkit';
import { addMessage } from '../../../store/features/chatSlice';

const MessageInput = ({ chatId }) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleTyping = useCallback(() => {
    dispatch({ type: 'chat/typing', payload: { chatId } });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      dispatch({ type: 'chat/stopTyping', payload: { chatId } });
    }, 3000);
  }, [chatId, dispatch]);

  const handleSend = useCallback(async () => {
    if (!message.trim() && !isUploading) return;

    const tempId = nanoid();
    const newMessage = {
      _id: tempId,
      chatId,
      content: message.trim(),
      type: 'text',
      status: 'sending',
      timestamp: new Date().toISOString(),
    };

    // Optimistic update
    dispatch(addMessage(newMessage));

    // Send via socket
    dispatch({
      type: 'chat/sendMessage',
      payload: {
        chatId,
        content: message.trim(),
        type: 'text',
        tempId,
      },
    });

    // Clear input
    setMessage('');
    dispatch({ type: 'chat/stopTyping', payload: { chatId } });
  }, [message, chatId, dispatch, isUploading]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadToCloudinary(file);

      const tempId = nanoid();
      const newMessage = {
        _id: tempId,
        chatId,
        content: '',
        type: file.type.startsWith('image/') ? 'image' : 'file',
        attachments: [
          {
            url,
            name: file.name,
            size: file.size,
            mimeType: file.type,
          },
        ],
        status: 'sending',
        timestamp: new Date().toISOString(),
      };

      dispatch(addMessage(newMessage));
      dispatch({
        type: 'chat/sendMessage',
        payload: {
          chatId,
          content: '',
          type: newMessage.type,
          attachments: newMessage.attachments,
          tempId,
        },
      });
    } catch (error) {
      console.error('File upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t bg-white p-4">
      <div className="flex items-end gap-2">
        {/* Emoji Picker */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 text-gray-500 hover:text-brand-primary transition"
        >
          <Smile className="w-6 h-6" />
        </button>

        {/* File Upload */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-500 hover:text-brand-primary transition"
          disabled={isUploading}
        >
          <Paperclip className="w-6 h-6" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileUpload}
          accept="image/*,application/pdf,.doc,.docx"
        />

        {/* Message Input */}
        <textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 px-4 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!message.trim() || isUploading}
          className="p-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-6 h-6" />
        </button>
      </div>

      {/* Emoji Picker Popup */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-4">
          <EmojiPicker
            onEmojiSelect={(emoji) => {
              setMessage((prev) => prev + emoji.native);
              setShowEmojiPicker(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MessageInput;
```

---

## Backend Implementation

### Socket.IO Server Setup

```javascript
// server/socket/index.js
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const Redis = require('ioredis');
const redisAdapter = require('@socket.io/redis-adapter');
const Message = require('../models/Message');
const Chat = require('../models/Chat');
const User = require('../models/User');

const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Redis adapter for multi-server support
  const pubClient = new Redis(process.env.REDIS_URL);
  const subClient = pubClient.duplicate();
  io.adapter(redisAdapter(pubClient, subClient));

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join user's personal room
    socket.join(`user:${socket.userId}`);

    // Update user online status
    updateUserStatus(socket.userId, true, socket.id);

    // Broadcast online status
    broadcastOnlineUsers(io);

    // Join chat rooms
    socket.on('chat:join', async (chatId) => {
      try {
        // Verify user has access to this chat
        const chat = await Chat.findById(chatId);
        if (!chat || !chat.participants.some(p => p.userId === socket.userId)) {
          return socket.emit('error', { message: 'Unauthorized' });
        }

        socket.join(`chat:${chatId}`);
        console.log(`User ${socket.userId} joined chat ${chatId}`);
      } catch (error) {
        console.error('Join chat error:', error);
        socket.emit('error', { message: 'Failed to join chat' });
      }
    });

    // Leave chat room
    socket.on('chat:leave', (chatId) => {
      socket.leave(`chat:${chatId}`);
      console.log(`User ${socket.userId} left chat ${chatId}`);
    });

    // Send message
    socket.on('message:send', async (data, callback) => {
      try {
        const { chatId, content, type, attachments, tempId } = data;

        // Verify chat access
        const chat = await Chat.findById(chatId);
        if (!chat || !chat.participants.some(p => p.userId === socket.userId)) {
          return callback({ error: 'Unauthorized' });
        }

        // Create message
        const message = await Message.create({
          chatId,
          senderId: socket.userId,
          senderName: socket.user.fullName,
          senderAvatar: socket.user.avatar,
          content,
          type,
          attachments,
          status: 'sent',
          timestamp: new Date(),
        });

        // Update chat's last message
        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: {
            _id: message._id,
            content: message.content,
            senderId: message.senderId,
            senderName: message.senderName,
            timestamp: message.timestamp,
            type: message.type,
          },
          updatedAt: new Date(),
        });

        // Broadcast to all users in chat
        io.to(`chat:${chatId}`).emit('message:new', message);

        // Send delivery receipts to online users
        const onlineParticipants = chat.participants.filter(p =>
          p.userId !== socket.userId && isUserOnline(p.userId)
        );

        if (onlineParticipants.length > 0) {
          setTimeout(() => {
            io.to(`chat:${chatId}`).emit('message:delivered', {
              messageId: message._id,
              deliveredAt: new Date(),
            });
          }, 100);
        }

        // Send acknowledgment
        callback({
          success: true,
          messageId: message._id,
          timestamp: message.timestamp,
          tempId,
        });
      } catch (error) {
        console.error('Send message error:', error);
        callback({ error: 'Failed to send message' });
      }
    });

    // Typing indicators
    socket.on('typing:start', (chatId) => {
      socket.to(`chat:${chatId}`).emit('typing:start', {
        chatId,
        userId: socket.userId,
        userName: socket.user.fullName,
      });
    });

    socket.on('typing:stop', (chatId) => {
      socket.to(`chat:${chatId}`).emit('typing:stop', {
        chatId,
        userId: socket.userId,
      });
    });

    // Read receipts
    socket.on('message:read', async (data) => {
      const { chatId, messageId } = data;

      await Message.findByIdAndUpdate(messageId, {
        status: 'read',
        readAt: new Date(),
      });

      io.to(`chat:${chatId}`).emit('message:read', {
        messageId,
        readAt: new Date(),
      });
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
      updateUserStatus(socket.userId, false, socket.id);
      broadcastOnlineUsers(io);
    });
  });

  return io;
};

// Helper functions
const onlineUsers = new Map(); // userId -> [socketIds]

function updateUserStatus(userId, online, socketId) {
  if (online) {
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, []);
    }
    onlineUsers.get(userId).push(socketId);
  } else {
    const sockets = onlineUsers.get(userId) || [];
    const filtered = sockets.filter(id => id !== socketId);
    if (filtered.length === 0) {
      onlineUsers.delete(userId);
    } else {
      onlineUsers.set(userId, filtered);
    }
  }
}

function isUserOnline(userId) {
  return onlineUsers.has(userId);
}

function broadcastOnlineUsers(io) {
  const userIds = Array.from(onlineUsers.keys());
  io.emit('users:online', userIds);
}

module.exports = initializeSocket;
```

### REST API Endpoints

```javascript
// server/routes/chat.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

// Get all chats for user
router.get('/chats', protect, async (req, res) => {
  try {
    const chats = await Chat.find({
      'participants.userId': req.user.id,
    })
      .sort({ updatedAt: -1 })
      .limit(50);

    res.json({ success: true, data: chats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get or create direct chat
router.post('/chats/direct', protect, async (req, res) => {
  try {
    const { recipientId } = req.body;

    // Check if chat already exists
    let chat = await Chat.findOne({
      type: 'direct',
      'participants.userId': { $all: [req.user.id, recipientId] },
    });

    if (!chat) {
      // Create new chat
      chat = await Chat.create({
        type: 'direct',
        participants: [
          { userId: req.user.id, role: 'member' },
          { userId: recipientId, role: 'member' },
        ],
      });
    }

    res.json({ success: true, data: chat });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get messages for a chat
router.get('/chats/:chatId/messages', protect, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { limit = 50, before } = req.query;

    // Verify access
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.some(p => p.userId === req.user.id)) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const query = { chatId, deleted: { $ne: true } };
    if (before) {
      query._id = { $lt: before };
    }

    const messages = await Message.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json({ success: true, data: messages.reverse() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create group chat
router.post('/chats/group', protect, async (req, res) => {
  try {
    const { name, description, participants } = req.body;

    const chat = await Chat.create({
      type: 'group',
      name,
      description,
      participants: [
        { userId: req.user.id, role: 'admin' },
        ...participants.map(userId => ({ userId, role: 'member' })),
      ],
      createdBy: req.user.id,
    });

    res.json({ success: true, data: chat });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Search messages
router.get('/search', protect, async (req, res) => {
  try {
    const { query, chatId } = req.query;

    const searchQuery = {
      content: { $regex: query, $options: 'i' },
      deleted: { $ne: true },
    };

    if (chatId) {
      searchQuery.chatId = chatId;
    } else {
      // Search only in user's chats
      const userChats = await Chat.find({
        'participants.userId': req.user.id,
      }).select('_id');
      searchQuery.chatId = { $in: userChats.map(c => c._id) };
    }

    const messages = await Message.find(searchQuery)
      .sort({ timestamp: -1 })
      .limit(50);

    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
```

---

## Key Features

### 1. Optimistic UI Updates

**Flow:**
1. User sends message
2. Generate temporary ID with `nanoid()`
3. Add to Redux store with `status: 'sending'`
4. Show immediately in UI (gray checkmark)
5. Emit Socket event to server
6. Server acknowledges with real message ID
7. Update Redux store (replace temp ID)
8. Update status to `sent` (single checkmark)
9. Server broadcasts to recipients
10. Recipients send delivery receipt
11. Update status to `delivered` (double gray checkmarks)
12. Recipient opens chat
13. Update status to `read` (blue double checkmarks)

### 2. Typing Indicators

**Implementation:**
- Emit `typing:start` event when user types
- Use `debounce` (2-3 seconds) to avoid excessive events
- Server broadcasts to other users in chat
- Show "User is typing..." indicator
- Auto-clear after 3 seconds of inactivity
- Emit `typing:stop` on message send

### 3. Read Receipts

**Implementation:**
- Track last read message ID per user per chat
- When user opens chat, mark all messages as read
- Emit single `message:read` event with last message ID
- Server updates all messages between last read and new message
- Broadcast read status to sender
- Update checkmarks to blue

### 4. Online Status

**Implementation:**
- Maintain `Map` of online users on server
- Track multiple socket IDs per user (multi-device)
- Update on `connect`/`disconnect` events
- Broadcast online user list every N seconds
- Show green dot next to online users
- Display "last seen" timestamp for offline users

### 5. Message Queueing (Offline Support)

**Implementation with IndexedDB:**

```javascript
// src/shared/utils/messageQueue.js
import Dexie from 'dexie';

const db = new Dexie('ChatDB');
db.version(1).stores({
  messages: '_id, chatId, timestamp',
  pendingMessages: '++id, chatId, timestamp',
  chats: '_id, updatedAt',
});

export const queueMessage = async (message) => {
  await db.pendingMessages.add(message);
};

export const flushPendingMessages = async (dispatch) => {
  const pending = await db.pendingMessages.toArray();

  for (const message of pending) {
    dispatch({
      type: 'chat/sendMessage',
      payload: message,
    });
  }

  await db.pendingMessages.clear();
};

// Listen to online/offline events
window.addEventListener('online', () => {
  flushPendingMessages(store.dispatch);
});

window.addEventListener('offline', () => {
  console.log('You are offline. Messages will be queued.');
});
```

### 6. Virtual Scrolling with React Virtuoso

**Benefits:**
- Render only visible messages (50-100 at a time)
- Smooth 60fps scrolling with 10,000+ messages
- Automatic height calculation
- Bi-directional scrolling (load older on scroll up)
- Follow output (auto-scroll to new messages)

**Implementation:**
```javascript
<Virtuoso
  data={messages}
  itemContent={(index, message) => <MessageBubble message={message} />}
  followOutput="smooth"
  initialTopMostItemIndex={messages.length - 1}
  startReached={() => loadOlderMessages()}
/>
```

### 7. Smart Caching Strategy

**Multi-tier caching:**

1. **Redux Store** (in-memory)
   - Active chat messages (last 50-100)
   - Fast access, but cleared on refresh

2. **IndexedDB** (persistent)
   - All messages (10,000+)
   - Survives refresh, larger storage (50MB+)

3. **Server Redis** (distributed)
   - Recent messages (1 hour window)
   - Shared across server instances

**Loading strategy:**
```javascript
// Load from cache first
const cachedMessages = await db.messages
  .where('chatId')
  .equals(chatId)
  .reverse()
  .limit(50)
  .toArray();

dispatch(setMessages({ chatId, messages: cachedMessages }));

// Then fetch new messages from server
const response = await fetch(`/api/chats/${chatId}/messages?after=${lastMessageId}`);
const newMessages = await response.json();

// Merge and update cache
dispatch(addMessages({ chatId, messages: newMessages }));
await db.messages.bulkPut(newMessages);
```

### 8. File Upload with Progress

**Implementation:**
```javascript
const handleFileUpload = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const xhr = new XMLHttpRequest();

  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      const percentComplete = (e.loaded / e.total) * 100;
      setUploadProgress(percentComplete);
    }
  });

  xhr.addEventListener('load', () => {
    const response = JSON.parse(xhr.responseText);
    const url = response.secure_url;

    // Send message with attachment
    dispatch({
      type: 'chat/sendMessage',
      payload: {
        chatId,
        content: '',
        type: 'image',
        attachments: [{ url, name: file.name, size: file.size }],
      },
    });
  });

  xhr.open('POST', cloudinaryUrl);
  xhr.send(formData);
};
```

### 9. Push Notifications

**Web Push API:**
```javascript
// Request permission
const permission = await Notification.requestPermission();

if (permission === 'granted') {
  // Show notification
  new Notification('New message from John', {
    body: 'Hey, are you free tomorrow?',
    icon: '/avatar.jpg',
    badge: '/badge.png',
    tag: 'chat-message',
    data: { chatId: 'chat_123' },
  });
}
```

**Service Worker:**
```javascript
// sw.js
self.addEventListener('push', (event) => {
  const data = event.data.json();

  self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon,
    badge: '/badge.png',
    data: { url: data.url },
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
```

---

## Performance Optimization

### 1. Message Batching

**Problem:** Sending individual Socket events for each keystroke floods the network.

**Solution:**
```javascript
let typingTimeout = null;

const handleTyping = () => {
  // Only send if not already sent in last 2 seconds
  if (!typingTimeout) {
    socket.emit('typing:start', chatId);
  }

  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit('typing:stop', chatId);
    typingTimeout = null;
  }, 2000);
};
```

### 2. React.memo and Memoization

**Problem:** Re-rendering all messages when one message updates.

**Solution:**
```javascript
const MessageBubble = React.memo(({ message }) => {
  // Component code
}, (prevProps, nextProps) => {
  // Only re-render if message changed
  return prevProps.message._id === nextProps.message._id &&
         prevProps.message.status === nextProps.message.status;
});

// In parent component
const MessageList = () => {
  const messages = useSelector(selectMessages);

  const renderMessage = useCallback((message) => (
    <MessageBubble key={message._id} message={message} />
  ), []);

  return messages.map(renderMessage);
};
```

### 3. Lazy Loading Media

**Problem:** Loading all images at once slows initial render.

**Solution:**
```javascript
import { useInView } from 'react-intersection-observer';

const LazyImage = ({ src, alt }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref}>
      {inView ? (
        <img src={src} alt={alt} loading="lazy" />
      ) : (
        <div className="w-full h-48 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
};
```

### 4. Connection Pooling

**Redis connections:**
```javascript
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: true,
  keepAlive: 30000,
});
```

**MongoDB connections:**
```javascript
mongoose.connect(process.env.MONGO_URI, {
  maxPoolSize: 50,
  minPoolSize: 10,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
});
```

### 5. WebSocket Compression

**Enable compression:**
```javascript
const io = socketIO(server, {
  perMessageDeflate: {
    threshold: 1024, // Only compress messages > 1KB
    zlibDeflateOptions: {
      chunkSize: 8 * 1024,
      level: 6,
    },
  },
});
```

### 6. Message Pagination

**Efficient pagination:**
```javascript
// Use cursor-based pagination (not offset)
const messages = await Message.find({
  chatId,
  _id: { $lt: cursorId }, // Messages before cursor
})
  .sort({ _id: -1 })
  .limit(50);
```

### 7. Rate Limiting

**Prevent spam:**
```javascript
const rateLimit = require('express-rate-limit');

const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 messages per minute
  message: 'Too many messages, please slow down',
});

app.use('/api/chat', chatLimiter);
```

---

## Security Considerations

### 1. Authentication

**JWT verification:**
```javascript
socket.use(async (socket, next) => {
  const token = socket.handshake.auth.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (error) {
    next(new Error('Authentication failed'));
  }
});
```

### 2. Authorization

**Verify chat access:**
```javascript
const verifyAccess = async (userId, chatId) => {
  const chat = await Chat.findById(chatId);
  return chat.participants.some(p => p.userId === userId);
};
```

### 3. Input Validation

**Sanitize message content:**
```javascript
const sanitizeHtml = require('sanitize-html');

const sanitizeMessage = (content) => {
  return sanitizeHtml(content, {
    allowedTags: [], // No HTML tags
    allowedAttributes: {},
  });
};
```

### 4. Rate Limiting

**Per-user rate limits:**
```javascript
const userRateLimits = new Map();

const checkRateLimit = (userId) => {
  const now = Date.now();
  const userLimit = userRateLimits.get(userId) || { count: 0, resetAt: now + 60000 };

  if (now > userLimit.resetAt) {
    userLimit.count = 0;
    userLimit.resetAt = now + 60000;
  }

  userLimit.count++;
  userRateLimits.set(userId, userLimit);

  return userLimit.count <= 60; // 60 messages per minute
};
```

### 5. XSS Prevention

**Escape user input:**
```javascript
import DOMPurify from 'dompurify';

const sanitizedContent = DOMPurify.sanitize(userInput);
```

### 6. File Upload Security

**Validate file types:**
```javascript
const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
];

const validateFile = (file) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error('Invalid file type');
  }

  if (file.size > 10 * 1024 * 1024) { // 10MB
    throw new Error('File too large');
  }
};
```

### 7. CORS Configuration

**Strict CORS policy:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)

**Backend:**
- ✅ Set up Socket.IO server with authentication
- ✅ Create MongoDB schemas (Messages, Chats)
- ✅ Implement Redis adapter for multi-server support
- ✅ Set up Bull queue for message delivery
- ✅ Create REST API endpoints (get chats, get messages)

**Frontend:**
- ✅ Install dependencies (socket.io-client, react-virtuoso, dexie)
- ✅ Create Redux chat slice
- ✅ Implement Socket middleware
- ✅ Set up IndexedDB with Dexie
- ✅ Create basic component structure

**Deliverables:**
- Socket.IO server running with authentication
- Basic Redux store with chat state
- Socket connection from client to server
- Database schemas created

---

### Phase 2: Core Messaging (Week 3-4)

**Backend:**
- ✅ Implement message sending logic
- ✅ Add message status tracking (sent/delivered/read)
- ✅ Create chat rooms and join/leave handlers
- ✅ Implement message persistence to MongoDB
- ✅ Add pagination for message history

**Frontend:**
- ✅ Build ChatLayout component
- ✅ Implement ChatSidebar with chat list
- ✅ Create MessageList with virtual scrolling
- ✅ Build MessageBubble component
- ✅ Implement MessageInput with send functionality
- ✅ Add optimistic UI updates
- ✅ Display message status (checkmarks)

**Deliverables:**
- Users can send and receive messages in real-time
- Messages persist in database
- Virtual scrolling works smoothly
- Message status indicators working

---

### Phase 3: Polish (Week 5-6)

**Backend:**
- ✅ Implement typing indicators
- ✅ Add online/offline status tracking
- ✅ Create read receipt system
- ✅ Add search functionality

**Frontend:**
- ✅ Add TypingIndicator component
- ✅ Display online status indicators
- ✅ Implement read receipts
- ✅ Add EmojiPicker component
- ✅ Implement file/image upload
- ✅ Create AttachmentPreview component
- ✅ Add message timestamps
- ✅ Implement lazy image loading

**Deliverables:**
- Typing indicators working
- Online/offline status displayed
- Read receipts functional
- Emoji picker working
- File uploads working

---

### Phase 4: Advanced Features (Week 7-8)

**Backend:**
- ✅ Implement offline message queue with Bull
- ✅ Add push notification support
- ✅ Create group chat functionality
- ✅ Implement message editing/deletion
- ✅ Add message threading (replies)

**Frontend:**
- ✅ Implement IndexedDB caching
- ✅ Add offline support with message queuing
- ✅ Create push notification system
- ✅ Build group chat UI
- ✅ Add message reply functionality
- ✅ Implement message editing
- ✅ Add message deletion (delete for me/everyone)
- ✅ Create search interface

**Deliverables:**
- Offline messaging works
- Push notifications delivered
- Group chats functional
- Message editing/deletion working
- Search working

---

### Phase 5: Optimization & Testing (Week 9-10)

**Performance:**
- ✅ Optimize React rendering with memoization
- ✅ Implement message batching
- ✅ Add connection pooling
- ✅ Enable WebSocket compression
- ✅ Optimize database queries with indexes

**Testing:**
- ✅ Unit tests for Redux actions/reducers
- ✅ Integration tests for Socket events
- ✅ Load testing with Artillery
- ✅ E2E tests with Cypress

**Security:**
- ✅ Implement rate limiting
- ✅ Add input sanitization
- ✅ XSS prevention
- ✅ File upload validation
- ✅ Security audit

**Deliverables:**
- Performance optimized (60fps scrolling)
- Test coverage >80%
- Security vulnerabilities patched
- Load tested (1000 concurrent users)

---

## Code Examples

### Complete Chat Slice with Thunks

```javascript
// src/shared/store/features/chatSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchChats = createAsyncThunk(
  'chat/fetchChats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/chats');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ chatId, before }, { rejectWithValue }) => {
    try {
      const url = before
        ? `/api/chats/${chatId}/messages?before=${before}`
        : `/api/chats/${chatId}/messages`;
      const response = await axios.get(url);
      return { chatId, messages: response.data.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createDirectChat = createAsyncThunk(
  'chat/createDirectChat',
  async (recipientId, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/chats/direct', { recipientId });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    activeChat: null,
    chats: {},
    messages: {},
    onlineUsers: [],
    typingUsers: {},
    connectionStatus: 'disconnected',
    unreadTotal: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // ... previous reducers ...
  },
  extraReducers: (builder) => {
    // Fetch chats
    builder.addCase(fetchChats.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchChats.fulfilled, (state, action) => {
      state.loading = false;
      action.payload.forEach((chat) => {
        state.chats[chat._id] = chat;
      });
    });
    builder.addCase(fetchChats.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch messages
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      const { chatId, messages } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].unshift(...messages);
    });

    // Create direct chat
    builder.addCase(createDirectChat.fulfilled, (state, action) => {
      const chat = action.payload;
      state.chats[chat._id] = chat;
      state.activeChat = chat._id;
    });
  },
});

export default chatSlice.reducer;
```

### Custom Hooks

```javascript
// src/shared/hooks/useChat.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchChats,
  fetchMessages,
  setActiveChat,
  selectActiveChat,
  selectChatById,
  selectMessagesByChatId,
} from '../store/features/chatSlice';

export const useChat = (chatId) => {
  const dispatch = useDispatch();
  const activeChat = useSelector(selectActiveChat);
  const chat = useSelector(selectChatById(chatId));
  const messages = useSelector(selectMessagesByChatId(chatId));

  useEffect(() => {
    if (chatId && chatId !== activeChat) {
      dispatch(setActiveChat(chatId));
      dispatch({ type: 'chat/joinRoom', payload: { chatId } });

      // Fetch messages if not already loaded
      if (!messages || messages.length === 0) {
        dispatch(fetchMessages({ chatId }));
      }
    }

    return () => {
      if (chatId) {
        dispatch({ type: 'chat/leaveRoom', payload: { chatId } });
      }
    };
  }, [chatId, dispatch, activeChat]);

  const loadOlderMessages = () => {
    if (messages && messages.length > 0) {
      const oldestMessage = messages[0];
      dispatch(fetchMessages({ chatId, before: oldestMessage._id }));
    }
  };

  return {
    chat,
    messages,
    loadOlderMessages,
  };
};
```

```javascript
// src/shared/hooks/useChatList.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChats } from '../store/features/chatSlice';

export const useChatList = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => Object.values(state.chat.chats));
  const loading = useSelector((state) => state.chat.loading);

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  const sortedChats = [...chats].sort((a, b) => {
    const aTime = a.lastMessage?.timestamp || a.updatedAt;
    const bTime = b.lastMessage?.timestamp || b.updatedAt;
    return new Date(bTime) - new Date(aTime);
  });

  return {
    chats: sortedChats,
    loading,
  };
};
```

---

## Alternative Approaches

### 1. Managed Chat Services

**Stream Chat**
- **Pros:** Fully managed, enterprise-grade, 99.99% uptime, built-in UI components
- **Cons:** Expensive ($99-$499/mo), vendor lock-in, limited customization
- **Best for:** Rapid prototyping, startups with budget

**SendBird**
- **Pros:** Scalable, feature-rich, good documentation, mobile SDKs
- **Cons:** Very expensive ($399+/mo), complex pricing model
- **Best for:** Enterprise applications with large budgets

**PubNub**
- **Pros:** Global infrastructure, low latency, pay-as-you-go
- **Cons:** Can get expensive with high traffic, limited free tier
- **Best for:** Real-time apps with global users

**Firebase Realtime Database**
- **Pros:** Free tier, easy setup, real-time out of the box
- **Cons:** Not designed for chat, scalability issues, no WebSocket
- **Best for:** MVPs, small apps with <10k users

---

### 2. Self-Hosted Alternatives

**Matrix Protocol (Element)**
- **Pros:** Decentralized, E2E encryption, open-source, federated
- **Cons:** Complex setup, steep learning curve, resource-intensive
- **Best for:** Privacy-focused apps, decentralized platforms

**Rocket.Chat**
- **Pros:** Open-source, self-hosted, Slack-like features
- **Cons:** Heavy (requires 2GB+ RAM), slower performance
- **Best for:** Internal team communication, enterprise

**Mattermost**
- **Pros:** Open-source, Slack alternative, good security
- **Cons:** Limited free features, requires maintenance
- **Best for:** Internal company chat, on-premise deployment

**XMPP (Jabber)**
- **Pros:** Battle-tested (20+ years), federated, extensive ecosystem
- **Cons:** Legacy protocol, complex, outdated tech
- **Best for:** Legacy integrations, federated systems

---

### 3. Hybrid Approach

**Socket.IO + Managed Backend**
- Use Socket.IO for frontend
- Use AWS AppSync or Hasura for backend GraphQL subscriptions
- **Pros:** Best of both worlds, easier backend scaling
- **Cons:** More moving parts, potential latency

---

## Cost Analysis

### Self-Hosted (Recommended)

**Monthly Costs:**
- AWS EC2 (t3.medium): $30
- AWS RDS MongoDB: $50
- AWS ElastiCache Redis: $20
- AWS S3: $5
- Cloudinary: $0 (free tier)
- **Total:** ~$105/month for 10,000 users

**Scales to:**
- 100,000 concurrent users: ~$500/month
- 1M concurrent users: ~$2,000/month

---

### Managed Services

**Stream Chat:**
- Startup: $99/month (up to 100 MAU)
- Growth: $499/month (up to 1,000 MAU)
- Enterprise: $2,000+/month (unlimited)

**SendBird:**
- Starter: $399/month (up to 1,000 MAU)
- Pro: $999/month (up to 5,000 MAU)
- Enterprise: Custom pricing

---

## Conclusion

For the Techxudo OMS project, I recommend the **self-hosted Socket.IO + Redis + MongoDB** approach because:

✅ **Full control** over features and data
✅ **Cost-effective** at scale
✅ **Aligns with existing architecture** (Redux, REST API)
✅ **Performance-optimized** (virtual scrolling, caching)
✅ **Production-ready** (used by Microsoft Teams, Slack)
✅ **Scalable** to millions of users

This guide provides everything needed to build a WhatsApp-quality chat system that integrates seamlessly with your existing project structure.

---

## Resources

**Documentation:**
- Socket.IO: https://socket.io/docs/
- React Virtuoso: https://virtuoso.dev/
- Dexie.js: https://dexie.org/
- Bull: https://docs.bullmq.io/

**Tutorials:**
- Building Real-time Chat: https://socket.io/get-started/chat
- Redis Pub/Sub: https://redis.io/docs/manual/pubsub/
- WebSocket Security: https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html

**GitHub Examples:**
- WhatsApp Clone: https://github.com/sahat/hackathon-starter
- Slack Clone: https://github.com/slackapi/sample-message-menus-node

---

**Last Updated:** 2024-01-15
**Version:** 1.0
**Author:** Claude (Anthropic)
