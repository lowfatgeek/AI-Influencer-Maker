# AI Influencer Maker

[![Built with Pollinations](https://img.shields.io/badge/Built%20with-Pollinations-8a2be2?style=for-the-badge&logo=data:image/svg+xml,%3Csvg%20xmlns%3D%22http://www.w3.org/2000/svg%22%20viewBox%3D%220%200%20124%20124%22%3E%3Ccircle%20cx%3D%2262%22%20cy%3D%2262%22%20r%3D%2262%22%20fill%3D%22%23ffffff%22/%3E%3C/svg%3E&logoColor=white&labelColor=6a0dad)](https://pollinations.ai/)

A React application that generates photorealistic AI influencer images with customizable attributes using the Google Gemini API (Imagen) and Pollinations API.

## Features

- **Dual Model Support**: Generate images using Google's Imagen or Pollinations.ai.
- **Customizable Attributes**: Adjust gender, ethnicity, age, hair style, outfit, and background.
- **Prompt Engineering**: Automatically builds complex English prompts and translates structure to Indonesian.
- **Secure**: Uses environment variables for API keys.
- **Responsive Design**: Built with Tailwind CSS and supports Dark Mode.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Local Development

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Configure Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    # Optional: For Pollinations API (leave empty if using free tier)
    POLLINATIONS_KEY=
    
    # Note: Google API Key is often selected via the UI in this specific app logic (Google AI Studio),
    # but if you have a hardcoded key for dev, you can set it here:
    API_KEY=your_google_api_key
    ```

3.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deployment to Vercel

This project is configured to deploy easily to Vercel.

### Option 1: Vercel CLI

1.  **Install Vercel CLI**
    ```bash
    npm i -g vercel
    ```

2.  **Deploy**
    ```bash
    vercel
    ```
    Follow the prompts. When asked for "Build Command", use `npm run build`. For "Output Directory", use `dist`.

3.  **Set Environment Variables**
    In your Vercel Project Dashboard, go to **Settings > Environment Variables** and add:
    - `API_KEY`: Your Google GenAI API Key.
    - `POLLINATIONS_KEY`: (Optional) Your Pollinations API Key.

### Option 2: Git Integration (Recommended)

1.  Push this code to a GitHub, GitLab, or Bitbucket repository.
2.  Log in to [Vercel](https://vercel.com) and click **"Add New..."** > **"Project"**.
3.  Import your repository.
4.  Vercel will automatically detect Vite.
5.  **Important**: Expand the **Environment Variables** section and add your keys (`API_KEY`, `POLLINATIONS_KEY`).
6.  Click **Deploy**.

## Technologies

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **AI**: Google GenAI SDK (@google/genai), Pollinations API

## Credits

- **Image Generation**: [Pollinations.ai](https://pollinations.ai/) - Free open-source AI image generation.

## License

MIT