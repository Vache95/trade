import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


function Participant({ socket }) {

  const { id } = useParams();
  const [auctionState, setAuctionState] = useState(null);
  const participantId = parseInt(id, 10);

  const handlePriceChange = (change) => {
    const currentPrice = auctionState.participants.find((p) => p.id === participantId)?.price;
    socket.emit('updatePrice', { participantId, newPrice: currentPrice + change });
  };

  const handleNextTurn = () => socket.emit('nextTurn');


  useEffect(() => {
    socket.on('auctionUpdate', (state) => setAuctionState(state));
    return () => socket.off('auctionUpdate');
  }, [socket]);

  if (!auctionState) return <p>Загрузка...</p>;

  const isMyTurn = auctionState.currentParticipant === participantId;

  return (
    <div>
      <h1>{`Участник №${participantId}`}</h1>
      <p>Общее время: {auctionState.auctionTimer}s</p>
      <p>Время на ход: {auctionState.turnTimer}s</p>
      <p>
        Моя текущая цена:{' '}
        {auctionState.participants.find((p) => p.id === participantId)?.price} руб.
      </p>
      {isMyTurn && auctionState.isStarted ? (
        <div>
          <button onClick={() => handlePriceChange(-100000)}>Уменьшить цену</button>
          <button onClick={() => handlePriceChange(100000)}>Увеличить цену</button>
          <button onClick={handleNextTurn}>Передать ход</button>
        </div>
      ) : (
        <p>{isMyTurn ? 'Ваш ход' : 'Ожидайте своей очереди'}</p>
      )}
    </div>
  );
}

export default Participant;
