# Deployment Instructions for DIVI App

## Prerequisites
- Docker and Docker Compose installed on your server or local machine.
- MongoDB Atlas or local MongoDB instance (update MONGODB_URI accordingly).
- Cloudinary account credentials set in `.env`.
- JWT_SECRET set in `.env`.

## Setup

1. Copy `.env.example` to `.env` and fill in your environment variables.

2. Build and start the containers:

```bash
docker-compose up --build -d
```

3. The backend server will be available on port 5000.

4. Configure your frontend to point API requests to the backend server URL.

## Notes

- Use a reverse proxy like Nginx for HTTPS and domain routing.
- Monitor logs with `docker-compose logs -f`.
- Scale services as needed.

## Troubleshooting

- If the backend crashes, check logs for errors.
- Ensure environment variables are correctly set.
- Verify MongoDB connection string.

## Further Enhancements

- Setup CI/CD pipelines for automated deployment.
- Use cloud services like Vercel for frontend hosting.
- Add monitoring and alerting.

For any help, contact the developer.
