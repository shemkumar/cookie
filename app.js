const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

const secretKey = 'your-very-secure-secret-key'; // Replace with your actual secret key
const flag = 'ctf{this_is_the_flag}'; // Replace with your actual flag

// Middleware
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());

// Serve static HTML, CSS, and JS files
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>CTF Challenge</title>
            <style>
                /* General Body Styles */
                body {
                    font-family: Arial, sans-serif;
                    color: #333;
                    margin: 0;
                    padding: 0;
                    background: #f4f4f4;
                }
                
                /* Header Image */
                header {
                    text-align: center;
                    margin: 20px 0;
                }
                
                #bannerImage {
                    max-width: 100%;
                    height: auto;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                
                /* Main Content */
                main {
                    text-align: center;
                    padding: 20px;
                }
                
                /* Button Styles */
                button {
                    padding: 10px 20px;
                    font-size: 16px;
                    color: #fff;
                    background-color: #007bff;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s ease, transform 0.3s ease;
                }
                
                button:hover {
                    background-color: #0056b3;
                    transform: scale(1.05);
                }
                
                /* Result Text */
                #result {
                    margin-top: 20px;
                    font-size: 18px;
                }
                
                /* Smooth Scrolling */
                html {
                    scroll-behavior: smooth;
                }
            </style>
        </head>
        <body>
            <header>
                <img src="https://via.placeholder.com/1200x300?text=CTF+Challenge" alt="CTF Challenge Banner" id="bannerImage">
            </header>
            <main>
                <h1>Welcome to the CTF Challenge</h1>
                <p>Your goal is to find the flag hidden in a cookie.</p>
                <button id="revealButton">Reveal Flag</button>
                <p id="result"></p>
            </main>
            <script>
                document.getElementById('revealButton').addEventListener('click', () => {
                    const cookies = document.cookie.split('; ');
                    const token = cookies.find(cookie => cookie.startsWith('ctfToken='));

                    if (token) {
                        const jwtToken = token.split('=')[1];
                        fetch(\`/verify-token?token=\${jwtToken}\`)
                            .then(response => response.json())
                            .then(data => {
                                document.getElementById('result').innerText = \`The flag is: \${data.flag}\`;
                            })
                            .catch(error => {
                                document.getElementById('result').innerText = 'Failed to retrieve the flag.';
                            });
                    } else {
                        document.getElementById('result').innerText = 'No flag found in cookie.';
                    }
                });
            </script>
        </body>
        </html>
    `);
});

// Endpoint to set the cookie
app.get('/set-cookie', (req, res) => {
    const token = jwt.sign({ flag: flag }, secretKey, { expiresIn: '1h' });
    res.cookie('ctfToken', token);
    res.send('Cookie has been set!');
});

// Endpoint to verify the token
app.get('/verify-token', (req, res) => {
    const token = req.query.token;
    if (!token) return res.status(400).json({ error: 'No token provided' });

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });
        res.json({ flag: decoded.flag });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

