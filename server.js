const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(cors());
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
  res.send('API Runnning');
});

app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/clients', require('./routes/api/clients'));

app.use('/api/projects', require('./routes/api/projects'));
app.use('/api/sprints', require('./routes/api/sprints'));
app.use('/api/stories', require('./routes/api/stories'));
app.use('/api/tasks', require('./routes/api/tasks'));

app.use('/api/notes', require('./routes/api/notes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});
