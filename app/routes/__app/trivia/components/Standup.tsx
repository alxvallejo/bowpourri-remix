const StandupList = () => {
  return (
    <div className='flex flex-wrap flex-col'>
      <div className='flex flex-wrap'>
        <ClientOnly fallback={<div />}>
          {() => {
            const randomInterval = (() => {
              const random = (min, max) => Math.random() * (max - min) + min;
              return (callback, min, max) => {
                const time = {
                  start: performance.now(),
                  total: random(min, max),
                };
                const tick = (now) => {
                  if (time.total <= now - time.start) {
                    time.start = now;
                    time.total = random(min, max);
                    callback();
                  }
                  requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
              };
            })();

            // randomInterval(() => console.log('hi'), 1000, 2000); // logs "hi" at a random interval between 1 and 2s
            return players.map((p, i) => {
              return (
                <div key={i} className='prose ml-14'>
                  <h2>{p.name}</h2>
                </div>
              );
            });
          }}
        </ClientOnly>
      </div>

      <div className='p-14'>
        <button className='btn btn-primary'>Spin Wheel</button>
      </div>
    </div>
  );
};
