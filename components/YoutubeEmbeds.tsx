import { PlayerObject } from '@/types/mainTypes'
import YouTube from 'react-youtube'

type Props = {
  players: PlayerObject[]
  onReady: (id: string, e: any) => void
}

function YoutubeEmbeds({ players, onReady }: Props): JSX.Element {
  return (
    <div className="hidden">
      {players.map((playerObject) => (
        <div id={playerObject.id} key={playerObject.id}>
          <YouTube
            videoId={playerObject.videoId}
            opts={{
              height: '100%',
              width: '100%',
              playerVars: {
                autoplay: 0,
                controls: 0,
                loop: 1,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
              },
            }}
            onReady={(e) => onReady(playerObject.id, e)}
          />
        </div>
      ))}
    </div>
  )
}
export default YoutubeEmbeds
