export const OptionsModal = ({
  showOptions,
  setShowOptions,
  minPlayers,
  optionMinPlayers,
  editOptions,
  handleMinPlayerOptionUpdate,
}) => {
  const optionsModalClass = showOptions ? 'modal modal-open' : 'modal';
  return (
    <div className={optionsModalClass}>
      <div className='modal-box relative'>
        <label
          className='btn-sm btn-circle btn absolute right-2 top-2'
          onClick={() => setShowOptions(false)}
        >
          ✕
        </label>
        <h3 className='text-lg font-bold'>Options</h3>
        <div className='p-5'>
          <div className='form-control'>
            <label className='label'>
              <span className='label-text-alt'>Min Players</span>
            </label>
            {minPlayers && (
              <input
                type='number'
                className='input-bordered input'
                // defaultValue={optionMinPlayers}
                value={optionMinPlayers}
                onChange={handleMinPlayerOptionUpdate}
              />
            )}
          </div>
          {/* <div className='form-control'>
              <label className='label'>
                <span className='label-text-alt'>Countdown Seconds</span>
              </label>
              <input
                type='number'
                className='input-bordered input'
                // defaultValue={optionMinPlayers}
                value={countdownSeconds}
                onChange={(e) => setCountdownSeconds(e.target.value)}
              />
            </div> */}
          <div className='mt-5'>
            <div className='btn-accent btn' onClick={editOptions}>
              Save
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
