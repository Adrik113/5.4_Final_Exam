const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express()

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/censusDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const CensusSchema = new mongoose.Schema({
    year: Number,
    censusTaker: String,
    numberOfPeople: Number,
    address: {
        street: String,
        City: String,
        state: String,
        zipCode: String
    },
});

const Census = mongoose.model('Census', CensusSchema);

app.get('/census', async (req, res) =>{
    const records = await Census.find({}, 'year censusTaker numberOfPeople address.city address.state');
    res.json(records);
});

app.post('/census', async (req, res) => {
    const newRecord = new Census(req.body);
    await newRecord.save();
    res.json(newRecord);
});

app.put('/census/:id', async (req, res) =>{
    const updatedRecord = await Census.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.json(updatedRecord);
});

app.delete('/census/:id', async(req, res) => {
    await Census.findByIdAndDelete(req.params.id);
    res.json({message: 'Record deleted'});
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
})