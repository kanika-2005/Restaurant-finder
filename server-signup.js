const http = require('http');
const qs = require('querystring');
const fs = require('fs');
const path = require('path');

// Create the server
const server = http.createServer((req, res) => {
    // Serve the static files (HTML, CSS, etc.)
    if (req.method === 'GET') {
        if (req.url === '/' || req.url === '/index.html') {
            fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.end('<h1>Internal Server Error</h1>');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data);
                }
            });
        } else {
            // Handle requests for other static files (CSS, JS, images)
            const filePath = path.join(__dirname, 'public', req.url);
            const ext = path.extname(filePath);
            let contentType = 'text/html';

            // Map extensions to MIME types
            switch (ext) {
                case '.css':
                    contentType = 'text/css';
                    break;
                case '.js':
                    contentType = 'application/javascript';
                    break;
                case '.jpg':
                case '.jpeg':
                case '.png':
                    contentType = 'image/jpeg';
                    break;
                default:
                    contentType = 'text/html';
            }

            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end('<h1>404 Not Found</h1>');
                } else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(data);
                }
            });
        }
    } else if (req.method === 'POST' && req.url === '/register') {
        // Handle form submission
        let body = '';

        // Collect the form data
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const formData = qs.parse(body);

            // Save the data to a file
            fs.appendFile('users.txt', JSON.stringify(formData) + '\n', (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.end('<h1>Internal Server Error</h1>');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end('<h1>Registration Successful!</h1>');
                }
            });
        });
    } else {
        // Handle unsupported routes
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
    }
});

// Assign a port number and start the server
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
