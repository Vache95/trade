import {Route, Routes } from 'react-router-dom';
import io from 'socket.io-client';
import Organizer from './components/Organizer';
import Participant from './components/Participant';


const socket = io('http://localhost:4000');

export const App = () => (
      <Routes>
        <Route path="/organizer" element={<Organizer socket={socket} />} />
        <Route path="/participant/:id" element={<Participant socket={socket} />} />
        <Route path="*" element={<h1>404 - Страница не найдена</h1>} />
      </Routes>
  );


