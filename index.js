const express = require('express');
const {connectMongo, disconnectMongo} = require('./src/mongodb');
const app=express();
const PORT = process.env.PORT || 3000;

app.use((req,res,next)=>{
    res.header("Content-Type", "application/json; chartset=utf-9")
    next();
})

app.get("/", (req, res) =>{
    res.status(200).send("<center><h1>Bienvenido a la Fruteria</h1></center>")
})

app.get('/frutas', async(req,res) =>{
    const client = await connectMongo()
    if(!client){
        res.status(500).send('Error al conectarse a MongoDB')
        return;
    }

    const db=client.db('Frutas')
    const frutas= await db.collection('frutas').find().toArray()
    await disconnectMongo()
    res.json(frutas)
})

app.get('/frutas/:id', async(req,res) =>{
    const idFruta=parseInt(req.params.id) ||0
    const client = await connectMongo()
    if(!client){
        res.status(500).send('Error al conectarse a MongoDB')
        return;
    }
    const db=client.db('Frutas')
    const frutas= await db.collection('frutas').findOne({id: idFruta})
    await disconnectMongo()
    !frutas ? res.status(404).send('No se encontro la Fruta')
    : res.json(frutas)
})

app.get('/frutas/nombre/:nombre', async(req,res) =>{
    const nombreFruta=req.params.nombre || ''
    const client = await connectMongo()
    if(!client){
        res.status(500).send('Error al conectarse a MongoDB')
        return;
    }
    const db=client.db('Frutas')
    const frutas = await db.collection('frutas').find({ nombre: { $regex: nombreFruta, $options: 'i' } }).toArray();
    await disconnectMongo()
    !frutas ? res.status(404).send('No se encontro la Fruta')
    : res.json(frutas)
})

app.get('/frutas/precio/:precio', async(req,res) =>{
    const precioFruta=parseFloat(req.params.precio) || 0
    const client = await connectMongo()
    if(!client){
        res.status(500).send('Error al conectarse a MongoDB')
        return;
    }
    const db=client.db('Frutas')
    const frutas = await db.collection('frutas').find({ importe: { $gte: precioFruta } }).sort({ importe: 1 }).toArray();
    await disconnectMongo()
    !frutas ? res.status(404).send('No se encontro la Fruta')
    : res.json(frutas)
})

app.get("*", (req, res) =>{
    res.status(404).send("Ruta invalida")
})

app.listen(PORT, () =>{
    console.log('http://localhost:'+PORT)
})

