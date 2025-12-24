//importing the server from app.js
const server = require('./app');
//setting up the server
const PORT = 3000;

server.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})