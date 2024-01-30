import express from 'express';
import contactRoutes from './Routes/contactRoute.js';

const App = express();
App.use(express.json());

// Use routes
App.use('/api/contacts', contactRoutes);

export default App;
