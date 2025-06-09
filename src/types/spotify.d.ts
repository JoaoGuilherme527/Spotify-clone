// types/spotify.d.ts

export { };

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: typeof Spotify;
  }

  namespace Spotify {
    interface PlayerInit {
      name: string;
      getOAuthToken: (cb: (token: string) => void) => void;
      volume?: number;
      enableMediaSession?: boolean;
    }

    interface Player {
      // Core methods
      connect(): Promise<boolean>;
      disconnect(): void;
      addListener(
        event: PlayerEvent,
        callback: (args: any) => void
      ): boolean;
      removeListener(
        event: PlayerEvent,
        callback?: (args: any) => void
      ): boolean;
      getCurrentState(): Promise<WebPlaybackState | null>;
      setName(name: string): Promise<void>;
      getVolume(): Promise<number>;
      setVolume(volume: number): Promise<void>;
      pause(): Promise<void>;
      resume(): Promise<void>;
      togglePlay(): Promise<void>;
      seek(position_ms: number): Promise<void>;
      previousTrack(): Promise<void>;
      nextTrack(): Promise<void>;
      activateElement(): Promise<void>;
    }

    type PlayerEvent =
      | 'ready'
      | 'not_ready'
      | 'player_state_changed'
      | 'autoplay_failed'
      | 'initialization_error'
      | 'authentication_error'
      | 'account_error'
      | 'playback_error';

    interface ReadyEvent {
      device_id: string;
    }

    interface WebPlaybackError {
      message: string;
    }

    interface WebPlaybackState {
      context: {
        uri: string | null;
        metadata: object | null;
      };
      disallows: {
        pausing?: boolean;
        peeking_next?: boolean;
        peeking_prev?: boolean;
        resuming?: boolean;
        seeking?: boolean;
        skipping_next?: boolean;
        skipping_prev?: boolean;
      };
      paused: boolean;
      position: number;
      duration: number;
      repeat_mode: 0 | 1 | 2;
      shuffle: boolean;
      track_window: {
        current_track: WebPlaybackTrack;
        previous_tracks: WebPlaybackTrack[];
        next_tracks: WebPlaybackTrack[];
      };
    }

    interface WebPlaybackTrack {
      uri: string;
      id: string | null;
      type: 'track' | 'episode' | 'ad';
      media_type: 'audio' | 'video';
      name: string;
      is_playable: boolean;
      album: {
        uri: string;
        name: string;
        images: { url: string }[];
      };
      artists: { uri: string; name: string }[];
    }

    const Player: {
      new(options: PlayerInit): Player;
    };
  }
}
