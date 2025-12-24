//importing scshools router
const schoolsRouter = require('./routes/schoolsRouter');
//importing students router
const studentsRouter =  require('./routes/studentsRouter');
//importing express-rate-limit for rate limiting
const {rateLimit} = require('express-rate-limit');
//import morgan for logging
const morgan = require('morgan');

//importing other dependencies
require('dotenv/config');
const express = require('express');
const prisma = require('./prismaClient');
const { ensureAuth } = require('./middleware/auth');

// Warn if JWT_SECRET is missing
if (!process.env.JWT_SECRET) {
    console.warn('Warning: JWT_SECRET not set. Token creation and verification will fail without it.');
}

// prisma client is initialized in prismaClient.js
const server = express();
// Ensure correct client IP when behind proxies (e.g., load balancers, Docker)
server.set('trust proxy', 1);
//using morgan for logging HTTP requests
server.use(morgan('common'));

//Adding a middleware to cater for json data
server.use(express.json())
// Apply rate limiting to all requests
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // limit each IP to 5 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    ipv6Subnet: 56, // Rate limit based on /56 subnet for IPv6 addresses
    handler: (req, res, next, options) => {
        res.status(options.statusCode).json({
            message: 'Too many requests, please try again later.',
            ip: req.ip,
            limit: options.limit,
            windowMs: options.windowMs
        });
    }
});
server.use(limiter);// Making use of our Middleware
// Middleware to log Authorization header for debugging
server.use((req,res,next)=>{
    if(req.url === '/students/login' || req.url === '/students/register'){
        return next();
    }
    if (req.headers.authorization){
        console.log('Authorization Header:', req.headers.authorization);
    }else{
        console.log('No Authorization Header found');
    }
    next();
})

server.get('/',(req,res)=>{
    res.send('Welcome to my Web-Service!')
})
//using schools router through a middleware....Directing any requests for schoools to the scshoolsRouter
// Protect all schools routes
server.use('/schools', ensureAuth, schoolsRouter);

//using students router through a middleware
// studentsRouter will expose public registration and login; other student routes are protected inside the router
server.use('/students',studentsRouter);

module.exports = server;