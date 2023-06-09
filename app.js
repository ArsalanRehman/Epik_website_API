const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const productRouter = require('./routers/productRouter');
const globalErrorHandler = require('./controllers/errorControler');
const AppError = require('./utils/appError');
const app = express();
app.use(express.json({ limit: '52428800' }));
const cors = require('cors');
var ip = require('ip');
const ipAddress = ip.address();
const homeRouter = require('./routers/homeRouter');
const aboutUsRouter = require('./routers/aboutUsRouter');
const contactUsRouter = require('./routers/contactUsRouter');
const footerRouter = require('./routers/footerRouter');
const imageRouter = require('./routers/imageRouter');

//////////////////

app.get(helmet());
/* 
const localIp = ip.address();
const corsOptions = {
  origin: [
    new RegExp(`^http://${localIp}:\\d+$`)
  ],
  credentials: true,
  optionSuccessStatus: 200,
};
*/

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    `http://${ipAddress}:3000`,
    `http://${ipAddress}:3001`,
    `http://${ipAddress}:3002`,
    `http://${ipAddress}:3003`,
    `http://${ipAddress}:3004`,
    `http://${ipAddress}:3005`,
  ],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
const limiter = rateLimit({
  max: 100000,
  windowsMS: 60 * 60 * 1000,
  message: 'request kotaniz acmistir',
});
app.use('/api', limiter);

app.use('/api/v1/products', productRouter);
app.use('/api/v1/home', homeRouter);
app.use('/api/v1/aboutUs', aboutUsRouter);
app.use('/api/v1/contactUs', contactUsRouter);
app.use('/api/v1/footer', footerRouter);
app.use('/api/v1/images', imageRouter);
app.use(express.static('images'));


app.all('*', (req, res, next) => {
  next(new AppError(`${req.originalUrl} bulunmamaktadir`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
