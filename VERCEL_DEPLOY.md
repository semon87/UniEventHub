# Deploying Frontend to Vercel

Follow these steps to deploy your `event-frontend` to Vercel.

## 1. Prerequisites
- Ensure your code is pushed to GitHub (Already done).
- You have a Vercel account (Sign up at [vercel.com](https://vercel.com)).

## 2. Import Project in Vercel
1.  Log in to your Vercel Dashboard.
2.  Click **"Add New..."** -> **"Project"**.
3.  Select **"Continue with GitHub"** if not already connected.
4.  Find your repository `UniEventHub` (or whatever you named it) in the list and click **"Import"**.

## 3. Configure Project
1.  **Framework Preset**: It should likely auto-detect **Vite**. If not, select **Vite** manually.
2.  **Root Directory**:
    - Click **"Edit"** next to **Root Directory**.
    - Select `Frontend/event-frontend`.
    - Click **"Continue"**.
3.  **Build and Output Settings**:
    - Build Command: `npm run build` (default)
    - Output Directory: `dist` (default)
    - Install Command: `npm install` (default)
4.  **Environment Variables**:
    - You generally don't need to set the API URL here because we hardcoded it in `src/api/axios.js` for simplicity.
    - *However*, best practice for the future is to use `.env` files. Since we modified the code to use the specific Railway URL, you are good to go without env vars for now.

## 4. Deploy
1.  Click **"Deploy"**.
2.  Wait for the build to complete.
3.  Once finished, you will get a domain like `event-frontend.vercel.app`.
4.  Visit the URL and test the application!

## Troubleshooting
- **404 on Refresh**: If you see 404 errors when refreshing pages like `/login` or `/clubs`, ensure the `vercel.json` file I added is present in the root of the frontend deployment. It handles the "rewrites" to index.html for React Router.
