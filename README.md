# Animan Forgis on the Jeep 

## What is this?
Okay, so this is my final project for school. Basically, I needed to build a system that connects to a backend, and since I spend way too much time watching anime, I figured... why not make an anime discovery app?

It allows you to search for anime, see the top-ranked ones, and save your favorites. It's not perfect, but it works (mostly)!

##  The Tech Stack (aka "What I ChatGPT'd")
I used a bunch of stuff to make this work:
- **Frontend:** React + Vite (because `create-react-app` is too slow lol)
- **Styling:** Tailwind CSS (writing vanilla CSS is a nightmare, fight me)
- **Backend:** CodeIgniter 4 (PHP)
- **Database:** MySQL

##  Features
Here's what you can actually do on the site:
1.  **Search Anime:** Type in "Boku no Pico" or whatever and it pulls data from my backend.
2.  **Top Anime:** The home page shows the top-rated stuff right now.
3.  **Favorites:** You can save anime to your profile (you need to be logged in though).
4.  **Dashboard:** A simple dashboard to manage your account.

## The Struggle
Honest talk: this was harder than I thought.
- **The Backend Folder:** I literally lost my backend code for a solid hour. I named the folder `anime-api/anime-api` and forgot where I put it. 💀
- **CORS Errors:** I spent 3 hours fixing a red error in the console only to realize I forgot to enable CORS in PHP.
- **State Management:** React state is confusing, but `useQuery` saved my life.

## How to Run This Bad Boy

### Frontend
1.  Open this folder in your terminal.
2.  Run `npm install` (if you haven't already).
3.  Run `npm run dev`.
4.  Click the link (usually `http://localhost:5173`).

### Backend
1.  Go to the backend folder (good luck finding it... jk, it's in `anime-api`).
2.  Run `php spark serve`.
3.  Pray it connects. 🙏


