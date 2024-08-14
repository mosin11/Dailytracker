import React, { useState, useRef, useEffect } from 'react';
import Peer from 'peerjs';

const PeerConnection = ({ localStream, setRemoteStream }) => {
  const [userId, setUserId] = useState('');
  const [remotePeerId, setRemotePeerId] = useState('');
  const peerRef = useRef(null);

  useEffect(() => {
    peerRef.current = new Peer(undefined, {
      host: 'localhost',
      port: 5000,
      path: '/userId',
      secure: false,
    });

    peerRef.current.on('open', (id) => {
      setUserId(id);
    });

    peerRef.current.on('call', (call) => {
      call.answer(localStream);
      call.on('stream', (stream) => {
        setRemoteStream(stream);
      });
    });
  }, [localStream, setRemoteStream]);

  const callPeer = () => {
    const call = peerRef.current.call(remotePeerId, localStream);
    call.on('stream', (stream) => {
      setRemoteStream(stream);
    });
  };

  return (
    <div>
      <label>Your Peer ID: {userId}</label>
      <br />
      <input
        type="text"
        placeholder="Enter remote peer ID"
        value={remotePeerId}
        onChange={(e) => setRemotePeerId(e.target.value)}
      />
      <button onClick={callPeer}>Call</button>
    </div>
  );
};

export default PeerConnection;
