const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = 5000;

//middleware

app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://mydbuser1:FzS3uF2QGrkz9huV@cluster0.f6j7z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// callback system data send


// client.connect(err => {
//     const collection = client.db("foodMaster").collection("userdata");
//     // perform actions on the collection object

//     console.log('database connected');

//     const user = { name: 'Mukta', email: 'mukta@gamil.com', phone: '01876266558' };
//     collection.insertOne(user)
//         .then(() => {
//             console.log("insert one data success");
//         })
//     // console.error(err);
//     //client.close();
// });


// async await data sending in database

async function run() {
    try {
        await client.connect();
        const database = client.db("foodMaster");
        const usersCollection = database.collection("userdata");

        // create a document to insert
        // const user = {
        //     name: "farhad ahmed",
        //     email: "farhadahmed3020@gamil.com",
        // }
        // const result = await usersCollection.insertOne(user);
        // console.log(`user inserted  successfully  and user _id: ${result.insertedId}`);

        //GET API
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await usersCollection.findOne(query)
            console.log('lode user with id : ', id);
            res.send(user);
        })

        // apply POST API

        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            // console.log('got new user', req.body);
            // console.log('added user', result);

            res.json(result);
            // res.send('hit the post')

        })

        //DELETE API
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const result = await usersCollection.deleteOne(query);

            console.log('deleting user  by id in  database', result);
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.use(cors())

app.get('/', (req, res) => {
    res.send(" Running my CRUD Server");
});


app.listen(port, () => {
    console.log('Runnig servet on port ', port);
})