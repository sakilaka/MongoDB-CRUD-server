const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://kamrul:oERGeAgX03wrZb8D@kamrul.iyiyxhu.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        const userCollection = client.db('userbd').collection('users');


        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const user = await userCollection.findOne(query);
            res.send(user);
        })

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const user = req.body;
            const options = { upsert: true };
            const updatedUser = {
                $set: {
                    name: user.name,
                    email: user.email,
                    address: user.address
                }
            }
            const result = await userCollection.updateOne(filter, updatedUser, options);
            console.log(result);
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        })
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query);
            console.log(result);
            res.send(result)
            console.log('delete', id);
        })


    }
    finally {

    }

}
run().catch(error => console.log(error));






// try{

// }
// catch(err){
//     console.log(err);
// }
// finally{

// }


app.get('/', (req, res) => {
    res.send('Running');
})

app.listen(port, () => {
    console.log('dragon running', port);
});