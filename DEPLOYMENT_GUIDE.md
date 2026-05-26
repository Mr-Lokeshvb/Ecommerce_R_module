# Fashion Era Deployment Guide

This project deploys as two services:

- Frontend: Vercel
- Backend API: Railway
- Database: MongoDB Atlas or Railway MongoDB

## 1. Push To GitHub

From this project folder, run:

```powershell
git init
git add .
git commit -m "Prepare Fashion Era deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Do not commit `.env`, `node_modules`, `dist`, or log files. They are already ignored.

## 2. Backend On Railway

1. Open Railway.
2. Click New Project.
3. Choose Deploy from GitHub repo.
4. Select this repository.
5. Set the service root directory to:

```txt
server
```

6. Set start command if Railway asks:

```txt
npm start
```

7. Add environment variables in Railway:

```txt
NODE_ENV=production
JWT_SECRET=replace-with-a-long-random-secret
MONGODB_URI=your-mongodb-connection-string
CLIENT_URL=https://your-vercel-app.vercel.app
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

Email is disabled in code, so `EMAIL_USER` and `EMAIL_PASS` are not required.

8. Deploy.
9. Open Railway generated URL plus `/health`:

```txt
https://your-railway-url.up.railway.app/health
```

Expected result:

```json
{
  "status": "ok",
  "db": "connected",
  "email": "disabled"
}
```

## 3. Frontend On Vercel

1. Open Vercel.
2. Click Add New Project.
3. Import the same GitHub repository.
4. Use these build settings:

```txt
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

5. Add this Vercel environment variable:

```txt
VITE_API_URL=https://your-railway-url.up.railway.app
```

6. Deploy.

## 4. Connect Both URLs

After Vercel gives you the frontend URL:

1. Go back to Railway.
2. Update:

```txt
CLIENT_URL=https://your-vercel-app.vercel.app
```

3. Redeploy Railway.

## 5. Final Test

Open:

```txt
https://your-vercel-app.vercel.app
```

Then test:

- Register customer
- Login customer
- Browse products
- Add to cart
- Checkout
- Seller login
- Seller order status update

If frontend says Failed to fetch, check `VITE_API_URL` in Vercel.
If backend health says database disconnected, check `MONGODB_URI` in Railway.
