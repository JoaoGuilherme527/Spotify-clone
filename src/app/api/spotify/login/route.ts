import { NextResponse } from 'next/server';

export async function GET() {
  const scope = [
    // Biblioteca do usuário
    'user-library-read',
    'user-library-modify',

    // Histórico e métricas
    'user-read-recently-played',
    'user-top-read',
    'user-read-playback-position',

    // Perfil do usuário
    'user-read-email',
    'user-read-private',

    // Playlists
    'playlist-read-private',
    'playlist-modify-private',
    'playlist-read-collaborative',
    'playlist-modify-public',

    // Reprodução (SDK/Web)
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'app-remote-control',
    'streaming',

    // Seguidores e artistas
    'user-follow-read',
    'user-follow-modify',

    // Upload de imagem
    'ugc-image-upload',
  ].join(' ');

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    scope,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
  });

  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}


// Categoria	                  Escopos principais
// Biblioteca do usuário	      user-library-read, user-library-modify
// Histórico e métricas	        user-read-recently-played, user-top-read, user-read-playback-position
// Perfil do usuário	          user-read-email, user-read-private
// Playlists	                  playlist-read-private, playlist-modify-private, playlist-read-collaborative, 
//                              playlist-modify-public
// Reprodução (SDK/Web)       	user-read-playback-state, user-modify-playback-state, user-read-currently-playing,          
//                              app-remote-control, streaming
// Seguidores e artistas      	user-follow-read, user-follow-modify
// Upload de imagem           	ugc-image-upload