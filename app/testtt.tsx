<div className='flex flex-col items-end px-32'>
        {/* @ts-ignore */}
        <TopNav 
          timeWork={timeWork}
          timeShortBreak={timeShortBreak}
          timeLongBreak={timeLongBreak}
          longBreakInterval={longBreakInterval}
        />
      </div>

      <div className='flex flex-col items-center'>
        <Timer state={state} timer={timer} />
      </div>

      <div className="flex mt-3 justify-center items-center">

        <div className='flex w-1/3 justify-end'>
          <YoutubeLinksSection 
            musicVolume={musicVolume}
            onHandleMove={handleVolumeChange}
            players={players.filter(player => player.type === 'input')}
            stateData={stateData}
            addPlayerIDToStateData={addPlayerIDToStateData}
            createNewInputPlayer={createNewInputPlayer}
          />
        </div>
        <div className='flex justify-center'>
          <MainControls
            timerActive={timerActive}
            toggleTimerActive={toggleTimerActive}
            resetTimer={resetTimer}
            changeState={changeState}
          />
        </div>
        <div className='flex w-1/3 justify-start'>
          <AmbienceSection 
            handleClickAmbience={handleClickAmbience} 
            currentPlayers={stateData[state]?.players}
            ambienceVolume={ambienceVolume}
            handleVolumeChange={handleVolumeChange}
          />
        </div>
        
      </div>
      <YoutubeEmbeds players={players} onReady={handlePlayerReady} />