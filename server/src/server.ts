import './tracer';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import functionRouter from './routes/function';
import userRouter from './routes/user';
import paymentRouter from './routes/payment';
import vscodeRouter from './routes/vscode';
import githubRouter from './routes/github';
import mongoose from 'mongoose';
import morgan from 'morgan';

// Default configurations
dotenv.config();

const uri = process.env.MONGO_URI as string;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const { connection } = mongoose;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', () => {
  console.log('MongoDB database connected...');
});

const dd_options = {
  'response_code':true,
  'tags': ['app:figstack_api']
};
// eslint-disable-next-line @typescript-eslint/no-var-requires
const connect_datadog = require('connect-datadog')(dd_options);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(morgan('dev'));
app.use(connect_datadog); //datadog-middleware

app.use('/user', userRouter);
app.use('/function', functionRouter);
app.use('/payment', paymentRouter);
app.use('/vscode', vscodeRouter);
app.use('/github', githubRouter);

const PORT: string | number = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening at ${PORT}`));
