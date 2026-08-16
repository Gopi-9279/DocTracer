import express from 'express';
import cookieParser from 'cookie-parser';
import errorMiddleware from './middlewares/error.middleware.js';

const app = express();
// middlewares
app.use(express.json());
app.use(cookieParser());
// routes acquired
import authRouter from './routes/auth.routes.js';
// routes
app.use('/api/v1/auth',authRouter);

app.use(errorMiddleware);




export default app;
