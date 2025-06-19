# Spotify Clone

**Spotify Clone** is a web application built with **React**, **TypeScript**, and **Tailwind CSS**. It connects to the official **Spotify Web API** to replicate core features of the Spotify desktop:

* 🎵 **Browse and search** for real albums, playlists, and tracks from Spotify’s catalog
* ▶️ **Interactive player** with play/pause, skip, track progress, and volume controls
* 💾 **Manage library** by liking tracks, saving albums, and creating playlists in your Spotify account

> 🔒 **Note:** A **Spotify Premium** subscription is required to stream audio through the Web API.

---

## 📋 Prerequisites

1. **Spotify Developer Account** and a registered application:

   * Visit the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).
   * Create an app and copy your **Client ID** and **Client Secret**.
2. **Spotify Premium** subscription to play tracks via the Web Playback SDK.
3. [Node.js](https://nodejs.org/) (version 14 or higher)
4. **Yarn** or **npm** (package manager)

---

## 🔧 Environment Variables

Create a `.env` file in the project root with the following keys:

```bash
CLIENT_ID=YOUR_ID
CLIENT_SECRET=YOUR_SECRET
SPOTIFY_CLIENT_ID=YOUR_ID
SPOTIFY_CLIENT_SECRET=YOUR_SECRET
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/api/spotify/callback
REDIRECT_URI=http://127.0.0.1:3000
```

Adjust `REDIRECT_URI` if you host on a different local domain, but Spotify recomends http://127.0.0.1:3000.

---

## 🚀 Running Locally

1. **Clone this repository**

   ```bash
   git clone https://github.com/JoaoGuilherme527/Spotify-clone.git
   cd Spotify-clone
   ```
2. **Install dependencies**

   * With Yarn:

     ```bash
     yarn install
     ```
   * With npm:

     ```bash
     npm install
     ```
3. **Start the development server**

   ```bash
   yarn dev
   # or
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser, and log in with your Spotify account when prompted.

---

## 📦 Building for Production

To create an optimized production build:

```bash
# With Yarn:
yarn build

# Or with npm:
npm run build
```

The static files will be output to the `build/` directory, ready for deployment.

---

## 📝 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
