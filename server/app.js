const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const iconv = require('iconv-lite');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Helper to detect python command
let pythonCommand = 'python';
const checkPython = () => {
    exec('python --version', (err) => {
        if (err) {
            exec('python3 --version', (err3) => {
                if (!err3) {
                    pythonCommand = 'python3';
                    console.log('Using python3 command');
                } else {
                    console.error('Python not found on host machine!');
                }
            });
        } else {
            console.log('Using python command');
        }
    });
};
checkPython();

// Endpoint to run python code
app.post('/api/run', (req, res) => {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'No code provided' });

    // In a real app, we'd use a temporary file and a sandbox
    // For this local study web, we'll write to a temp file
    const tempFile = path.join(__dirname, `temp_${Date.now()}.py`);
    fs.writeFileSync(tempFile, code);

    exec(`${pythonCommand} "${tempFile}"`, {
        encoding: 'buffer',
        env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
    }, (error, stdout, stderr) => {
        // Cleanup
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);

        // Decode buffer output (using iconv-lite to handle potential CP936/GBK from Windows)
        const outputStr = iconv.decode(stdout, 'utf-8');
        const errorStr = iconv.decode(stderr, 'utf-8');

        if (error) {
            return res.json({ output: errorStr || error.message, isError: true });
        }
        res.json({ output: outputStr, isError: false });
    });
});

// Ollama API Proxies
app.get('/api/ollama/models', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:11434/api/tags', { timeout: 2000 });
        res.json(response.data);
    } catch (error) {
        // Return 200 with empty list so frontend doesn't crash, but flag the error
        res.json({ models: [], error: 'Ollama not running', details: error.message });
    }
});

app.post('/api/ollama/chat', async (req, res) => {
    const { model, messages, stream } = req.body;
    try {
        if (stream) {
            // Set headers for SSE
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            const response = await axios.post('http://localhost:11434/api/chat', {
                model,
                messages,
                stream: true
            }, { 
                responseType: 'stream',
                timeout: 60000 
            });

            response.data.on('data', chunk => {
                res.write(chunk);
            });

            response.data.on('end', () => {
                res.end();
            });

            response.data.on('error', (err) => {
                res.status(500).write(JSON.stringify({ error: 'Stream error' }));
                res.end();
            });
        } else {
            const response = await axios.post('http://localhost:11434/api/chat', {
                model,
                messages,
                stream: false
            }, { timeout: 30000 });
            res.json(response.data);
        }
    } catch (error) {
        res.status(503).json({ error: 'Ollama chat failed', details: error.message });
    }
});

// Mock Course Data
const courses = [
    {
        id: 'python',
        title: 'Python 零基础入门',
        category: 'python',
        lessons: 10,
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop'
    },
    {
        id: 'pytorch',
        title: 'PyTorch 深度学习实战',
        category: 'pytorch',
        lessons: 8,
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop'
    }
];

app.get('/api/courses', (req, res) => {
    res.json(courses);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
