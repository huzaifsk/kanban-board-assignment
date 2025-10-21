import { useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5001';

export const useSocketIO = (onUpdate) => {
  const socketRef = useRef(null);
  const onUpdateRef = useRef(onUpdate);

  // Keep the ref updated
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    // Only create socket once
    if (socketRef.current) return;

    console.log('Initializing Socket.IO connection...');
    socketRef.current = io(SOCKET_URL);
    
    socketRef.current.on('connect', () => {
      console.log('Connected to Socket.IO');
      // Only show toast on initial connection, not reconnections
      if (!socketRef.current.recovered) {
        toast.success('Connected to real-time updates');
      }
    });
    
    socketRef.current.on('taskCreated', () => {
      toast.info('New task added');
      onUpdateRef.current();
    });
    
    socketRef.current.on('taskUpdated', () => {
      onUpdateRef.current();
    });
    
    socketRef.current.on('taskDeleted', () => {
      toast.info('Task deleted');
      onUpdateRef.current();
    });
    
    return () => {
      if (socketRef.current) {
        console.log('Disconnecting Socket.IO...');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run once

  return socketRef;
};
