import express from 'express';
import cookieParser from 'cookie-parser';


const app = express();
// middlewares
app.use(express.json());
app.use(cookieParser());
// routes acquired
import authRouter from './routes/auth.routes.js';
// routes
app.use('/api/v1/auth',authRouter);






export default app;
