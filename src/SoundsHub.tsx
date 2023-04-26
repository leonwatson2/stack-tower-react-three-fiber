import { FC, MutableRefObject, useEffect, useState } from 'react';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

export enum SoundTypes {
    BLOCK_STACK,
}

const soundMap: Record<SoundTypes, string> = {
    [SoundTypes.BLOCK_STACK]: './sounds/blockStack.mp3',
}
const blockStackAudio = new Audio();
const volumeMap = {
    off: 0,
    low: .25,
    high: .75,
}
export const SoundsHub: FC<{ soundRef: MutableRefObject<(sound: SoundTypes) => void> }> = ({ soundRef }) => {
    const [volumeState, setVolumeState] = useState<keyof typeof volumeMap>('high');
    const playSound = (sound: SoundTypes) => {
        switch (sound) {
            case SoundTypes.BLOCK_STACK:
                blockStackAudio.play();
                break;
        }
    }

    useEffect(() => {
        blockStackAudio.src = soundMap[SoundTypes.BLOCK_STACK];
        blockStackAudio.volume = .75;
    }, [soundRef])
    useEffect(() => {
        if (soundRef) {
            soundRef.current = playSound;
        }
    }, [playSound])
    useEffect(() => {
        blockStackAudio.volume = volumeMap[volumeState];
    }, [volumeState])

    return <div>
        <h2 style={{ color: 'white', marginLeft: '15px' }}>
            {volumeState === 'off' && <VolumeOffIcon onClick={() => { setVolumeState('high') }} />}

            {volumeState === 'low' && <VolumeDownIcon onClick={() => { setVolumeState('off') }} />}

            {volumeState === 'high' && <VolumeUpIcon onClick={() => { setVolumeState('low') }} />}
        </h2>
    </div>
}