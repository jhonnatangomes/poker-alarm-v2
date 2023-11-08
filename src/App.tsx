import { useState } from 'react';
import { NewClockCard } from './components/NewClockCard';
import { ClockModal } from './components/ClockModal';

function App() {
  const [state, setState] = useState({
    isModalOpen: false,
    clockIndexToEdit: -1,
  });
  const { isModalOpen } = state;
  return (
    <div className='h-screen w-full flex flex-col justify-between'>
      <div className='h-[95%] p-6 flex flex-wrap gap-4 overflow-y-auto'>
        <NewClockCard onClick={openClockModal} />
      </div>
      <div className='h-[5%] bg-grayCard'></div>
      <ClockModal show={isModalOpen} onHide={hideClockModal} />
    </div>
  );
  function openClockModal() {
    setState({ ...state, isModalOpen: true });
  }
  function hideClockModal() {
    setState({ ...state, isModalOpen: false });
  }
}

export default App;
