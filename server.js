const express = require('express');
const multer  = require("multer");
const {MongoClient, ObjectId} = require('mongodb');
const fs = require('fs');

const app = express();
const upload = multer({dest:"uploads"});
const port = 8000;

app.use(express.json())
app.use(express.static('public'))

async function getDbCollection(dbAddres, dbName, dbCollectionName) {
	const client = new MongoClient(dbAddres);
	await client.connect();
	const db = client.db(dbName);
	return db.collection(dbCollectionName);
}

app.get('/artist', async function(req, res) {
	const collection = await getDbCollection('mongodb://127.0.0.1', 'audioteka', 'artist');
	const data = await collection.find({}).toArray();
	res.send(data);
});

app.get('/album', async function(req, res) {
	const collection = await getDbCollection('mongodb://127.0.0.1', 'audioteka', 'album');
	const data = await collection.find({}).toArray();
	res.send(data);
});

app.get('/all', async function(req, res) {
	const collection1 = await getDbCollection('mongodb://127.0.0.1', 'audioteka', 'artist');
	const artist = await collection1.find({}).toArray();
	const collection2 = await getDbCollection('mongodb://127.0.0.1', 'audioteka', 'album');
	const album = await collection2.find({}).toArray();
	const data = [...artist, ...album];
	res.send(data);
});

app.get('/artist/:id', async function(req, res) {
	const collection = await getDbCollection('mongodb://127.0.0.1', 'audioteka', 'artist');
	const data = await collection.findOne({_id: new ObjectId(req.params.id)});
	res.send(data);
});

app.post('/artist', async function(req, res) {
    const artist = {...req.body};
    const collection = await getDbCollection('mongodb://127.0.0.1', 'audioteka', 'artist');
    await collection.insertOne(artist);
    res.send(artist);
});

app.post('/album', async function(req, res) {
    const album = {...req.body};
    const collection = await getDbCollection('mongodb://127.0.0.1', 'audioteka', 'album');
    await collection.insertOne(album);
    res.send(album);
});

app.patch('/artist/:id', async function(req, res) {
    const collection = await getDbCollection('mongodb://127.0.0.1', 'audioteka', 'artist');
    const data = await collection.updateOne({_id: new ObjectId(req.params.id)}, {'$set': req.body});
    res.send({});
});

app.patch('/album/:id', async function(req, res) {
    const collection = await getDbCollection('mongodb://127.0.0.1', 'audioteka', 'album');
    const data = await collection.updateOne({_id: new ObjectId(req.params.id)}, {'$set': req.body});
    res.send({});
});

app.delete('/artist/:id', async function(req, res) {
	const collection = await getDbCollection('mongodb://127.0.0.1', 'audioteka', 'artist');
	await collection.deleteOne({_id: new ObjectId(req.params.id)});
	res.send('artist delete successfully');
});

app.delete('/album/:id', async function(req, res) {
	const collection = await getDbCollection('mongodb://127.0.0.1', 'audioteka', 'album');
	await collection.deleteOne({_id: new ObjectId(req.params.id)});
	res.send('artist delete successfully');
});

app.listen(port, function() {
	console.log('Server is started!');
});