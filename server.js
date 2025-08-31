const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 8080;

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

const { readDB, writeDB } = require('./database');

// API endpoints will be added here
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin,
            subscription: user.subscription
        });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

app.post('/api/subscribe', upload.single('paymentProof'), (req, res) => {
    const { userId } = req.body;
    const paymentProof = req.file.path;
    const db = readDB();
    const newSubscription = {
        id: db.subscriptions.length + 1,
        userId: parseInt(userId),
        paymentProof,
        status: 'pending',
        rejectionReason: null
    };
    db.subscriptions.push(newSubscription);
    writeDB(db);
    res.json({ message: 'Subscription request submitted successfully.' });
});

app.get('/api/subscriptions', (req, res) => {
    const db = readDB();
    res.json(db.subscriptions);
});

app.get('/api/links', (req, res) => {
    const { userId } = req.query;
    const db = readDB();
    if (userId) {
        const user = db.users.find(u => u.id === parseInt(userId));
        if (user && user.subscription.active) {
            res.json(db.links);
        } else {
            res.status(403).json({ error: 'User is not subscribed' });
        }
    } else {
        // For admin panel to get all links
        res.json(db.links);
    }
});

app.post('/api/links', (req, res) => {
    const { url, title } = req.body;
    const db = readDB();
    const newLink = {
        id: db.links.length + 1,
        url,
        title
    };
    db.links.push(newLink);
    writeDB(db);
    res.json(newLink);
});

app.put('/api/links/:id', (req, res) => {
    const { id } = req.params;
    const { url, title } = req.body;
    const db = readDB();
    const link = db.links.find(l => l.id === parseInt(id));
    if (link) {
        link.url = url;
        link.title = title;
        writeDB(db);
        res.json(link);
    } else {
        res.status(404).json({ error: 'Link not found' });
    }
});

app.delete('/api/links/:id', (req, res) => {
    const { id } = req.params;
    const db = readDB();
    const index = db.links.findIndex(l => l.id === parseInt(id));
    if (index !== -1) {
        db.links.splice(index, 1);
        writeDB(db);
        res.json({ message: 'Link deleted successfully' });
    } else {
        res.status(404).json({ error: 'Link not found' });
    }
});

app.post('/api/subscriptions/:id/status', (req, res) => {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;
    const db = readDB();
    const subscription = db.subscriptions.find(s => s.id === parseInt(id));
    if (subscription) {
        subscription.status = status;
        if (status === 'approved') {
            const user = db.users.find(u => u.id === subscription.userId);
            if (user) {
                user.subscription.active = true;
                const now = new Date();
                now.setMonth(now.getMonth() + 1);
                user.subscription.endDate = now.toISOString().split('T')[0];
            }
        } else {
            subscription.rejectionReason = rejectionReason;
        }
        writeDB(db);
        res.json({ message: `Subscription ${status} successfully.` });
    } else {
        res.status(404).json({ error: 'Subscription not found' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
