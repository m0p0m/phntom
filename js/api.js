let socket;

export function connectToServer() {
    socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
        console.log('Connected to server');
        socket.send('Hello Server!');
    };

    socket.onmessage = (event) => {
        console.log(`Received message => ${event.data}`);
    };

    socket.onclose = () => {
        console.log('Disconnected from server');
    };
}

export function login(username, password) {
    return new Promise((resolve, reject) => {
        // Mock login
        if (username === 'admin' && password === 'password') {
            resolve();
        } else {
            reject('Invalid credentials');
        }
    });
}

export function getImages() {
    // Mock image data
    return Promise.resolve([
        { id: 1, thumbnailUrl: 'https://via.placeholder.com/250', fullUrl: 'https://via.placeholder.com/1200' },
        { id: 2, thumbnailUrl: 'https://via.placeholder.com/250', fullUrl: 'https://via.placeholder.com/1200' },
        { id: 3, thumbnailUrl: 'https://via.placeholder.com/250', fullUrl: 'https://via.placeholder.com/1200' },
        { id: 4, thumbnailUrl: 'https://via.placeholder.com/250', fullUrl: 'https://via.placeholder.com/1200' },
        { id: 5, thumbnailUrl: 'https://via.placeholder.com/250', fullUrl: 'https://via.placeholder.com/1200' },
        { id: 6, thumbnailUrl: 'https://via.placeholder.com/250', fullUrl: 'https://via.placeholder.com/1200' },
        { id: 7, thumbnailUrl: 'https://via.placeholder.com/250', fullUrl: 'https://via.placeholder.com/1200' },
        { id: 8, thumbnailUrl: 'https://via.placeholder.com/250', fullUrl: 'https://via.placeholder.com/1200' },
        { id: 9, thumbnailUrl: 'https://via.placeholder.com/250', fullUrl: 'https://via.placeholder.com/1200' },
        { id: 10, thumbnailUrl: 'https://via.placeholder.com/250', fullUrl: 'https://via.placeholder.com/1200' },
        { id: 11, thumbnailUrl: 'https://via.placeholder.com/250', fullUrl: 'https://via.placeholder.com/1200' },
        { id: 12, thumbnailUrl: 'https://via.placeholder.com/250', fullUrl: 'https://via.placeholder.com/1200' },
    ]);
}
