import { useState, useEffect } from 'react';


function Organizer({ socket }) {

  const [auctionState, setAuctionState] = useState(null);

  const startAuction = () =>  socket.emit('startAuction');
  const endAuction = () => socket.emit('endAuction');
  const handleNextTurn = () => socket.emit('nextTurn');


  useEffect(() => {
    socket.on('auctionUpdate', (state) => setAuctionState(state));
    return () => socket.off('auctionUpdate');
  }, [socket]);

  return auctionState ? (
    <div>
      <h1>Панель организатора</h1>
      <p>Общее время: {auctionState.auctionTimer}s</p>
      <p>Текущий участник: {`Участник №${auctionState.currentParticipant}`}</p>
      <button onClick={startAuction} disabled={auctionState.isStarted}>
        Начать торги
      </button>
      <button onClick={endAuction} disabled={!auctionState.isStarted}>
        Завершить торги
      </button>
      <table>
        <thead>
          <tr>
            <th>Участник</th>
            <th>Цена</th>
          </tr>
        </thead>
        <tbody>
          {auctionState.participants?.map((p) => (
            <tr key={p.id}>
              <td>{`Участник №${p.id}`}</td>
              <td>{p.price} руб.</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleNextTurn} disabled={!auctionState.isStarted}>
        Передать ход
      </button>
    </div>
  ) : (
    <p>Загрузка...</p>
  );
}

export default Organizer;
