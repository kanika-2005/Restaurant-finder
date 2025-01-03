const http = require('http');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');

// Users data (for simplicity)
let users = {
    "kanika": "password123"
};

// Helper function to serve static files like HTML, CSS, etc.
function serveFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 - Internal Server Error');
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
}

// Create the server
const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;

    // Serve the Sign In page
    if (pathname === '/signin' && req.method === 'GET') {
        serveFile(res, path.join(__dirname, 'sign-in.html'), 'text/html');
    }
    // Serve the Sign Up page
    else if (pathname === '/signup' && req.method === 'GET') {
        serveFile(res, path.join(__dirname, 'signup.html'), 'text/html');
    }
    // Serve the index page (after successful login)
    else if (pathname === '/index.html' && req.method === 'GET') {
        serveFile(res, path.join(__dirname, 'index.html'), 'text/html');
    }
    // Serve CSS files
    else if (pathname === '/style.css') {
        serveFile(res, path.join(__dirname, 'style.css'), 'text/css');
    }
    // Serve script.js file
    else if (pathname === '/script.js') {
        serveFile(res, path.join(__dirname, 'script.js'), 'application/javascript');
    }
    // Serve Sign-In page CSS
    else if (pathname === '/sign-in.css') {
        serveFile(res, path.join(__dirname, 'sign-in.css'), 'text/css');
    } 
    // Serve Sign-Up page CSS
    else if (pathname === '/signup_style.css') {
        serveFile(res, path.join(__dirname, 'signup_style.css'), 'text/css');
    }
    // Handle POST requests to '/signin' (User Login)
    else if (pathname === '/signin' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            const { uname, upwd } = qs.parse(body);
            // Authentication logic (simple check)
            if (users[uname] && users[uname] === upwd) {
                // Successful login - redirect to index.html
                res.writeHead(302, { 'Location': '/index.html' });
                res.end();
            } else {
                // Failed login attempt - return error message
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end('<h1 style="color:red;">Invalid Username or Password</h1>');
            }
        });
    }
    // Handle POST requests to '/register' (User Registration)
    else if (pathname === '/register' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            const { username, password, email, contact, gender } = qs.parse(body);
            users[username] = password; // Save user info (simple version)
            res.writeHead(302, { 'Location': '/signin' });  // Redirect to Sign In after registration
            res.end();
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - Not Found');
    }
});

// Start the server
const port = 8080;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
