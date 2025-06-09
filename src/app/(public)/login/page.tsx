'use client';

export default function Login() {
  const handleLogin = () => {
    window.location.href = '/api/spotify/login';
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <button
        onClick={handleLogin}
        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
      >
        Login com Spotify
      </button>
    </main>
  );
}
