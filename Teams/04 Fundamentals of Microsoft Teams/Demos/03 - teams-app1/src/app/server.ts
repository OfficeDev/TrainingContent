import * as Express from 'express';
import * as session from 'express-session';
import * as https from 'https';
import * as http from 'http';
import * as path from 'path';
import * as morgan from 'morgan';





// Initialize dotenv, to use .env file settings if existing
require('dotenv').config();


// Start the Express webserver
let express = Express();
let port = process.env.port || process.env.PORT || 3007;

express.use(Express.json());
express.use(Express.urlencoded({ extended: true }));

// Add simple logging
express.use(morgan('tiny'));

// Add /scripts and /assets as static folders
express.use('/scripts', Express.static(path.join(__dirname, 'web/scripts')));
express.use('/assets', Express.static(path.join(__dirname, 'web/assets')));








// This is used to prevent your tabs from being embedded in other systems than Microsoft Teams
express.use(function (req: any, res: any, next: any) {
    res.setHeader("Content-Security-Policy", "frame-ancestors teams.microsoft.com *.teams.microsoft.com *.skype.com");
    res.setHeader("X-Frame-Options", "ALLOW-FROM https://teams.microsoft.com/."); // IE11
    return next();
});

// Tabs (protected by the above)
express.use('/\*Tab.html', (req: any, res: any, next: any) => {
    res.sendFile(path.join(__dirname, `web${req.path}`));
});
express.use('/\*Config.html', (req: any, res: any, next: any) => {
    res.sendFile(path.join(__dirname, `web${req.path}`));
});
express.use('/\*Remove.html', (req: any, res: any, next: any) => {
    res.sendFile(path.join(__dirname, `web${req.path}`));
});
express.use('/\*Connector.html', (req: any, res: any, next: any) => {
    res.sendFile(path.join(__dirname, `web${req.path}`));
});
express.use('/\*ConnectorConnected.html', (req: any, res: any, next: any) => {
    res.sendFile(path.join(__dirname, `web${req.path}`));
});


    

// Fallback
express.use(function (req: any, res: any, next: any) {
    res.removeHeader("Content-Security-Policy")
    res.removeHeader("X-Frame-Options"); // IE11
    return next();
});

// Set default web page
express.use('/', Express.static(path.join(__dirname, 'web/'), {
    index: 'index.html'
}));

// Set the port
express.set('port', port);

// Start the webserver
http.createServer(express).listen(port, (err: any) => {
    if (err) {
        return console.error(err);
    }
    console.log(`Server running on ${port}`);

})
