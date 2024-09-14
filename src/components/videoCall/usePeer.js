import { useEffect, useState } from 'react';
import Peer from 'peerjs';

const usePeer = (phoneNumber) => {
  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState('');

  useEffect(() => {
    if (!phoneNumber) {
      console.error('Phone number is required to initialize Peer.');
      return;
    }

    // Initialize Peer with phone number as ID
    const peerInstance = new Peer(phoneNumber);

    peerInstance.on('open', (id) => {
      console.log('Peer connection open with ID:', id);
      setPeer(peerInstance);
      setPeerId(id);
    });

    peerInstance.on('error', (err) => {
      console.error('Peer error:', err);
    });

    return () => {
      if (peerInstance) {
        peerInstance.destroy();
      }
    };
  }, [phoneNumber]);

  return { peer, peerId };
};

export default usePeer;
