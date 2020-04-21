const express = require('express');
require('dotenv').config()
const employeeData = require('./apis/employee.json')
// const list = require('./apis/todolist.json')
const app = express()

const MongoClient = require('mongodb').MongoClient;

const client = new MongoClient(process.env.DBCONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });



let employeeDb;
let todolistCollection;

// this function connects the the mongodb
const mainConnet = async () => {
    await client.connect();
    employeeDb = client.db('employeedb');
    todolistCollection = employeeDb.collection('todo');
    
} 
mainConnet();

const createTodo = async (data) => {
    try {
        const result = await todolistCollection.insertMany(data);
        return result;

    } catch (error) {
        console.log(error)
    }
}

const getAll = async () => {
    try {
        const result = await todolistCollection.find({}).toArray();
        return result;
    } catch (error) {
        console.log(error)
    }
}
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.get('/', async function (req, res) {
    // let result = await createTodo(list)
    // console.log (result)
    res.redirect('/employeeList')
})
app.get('/employeeList', function (req, res) {
    res.render('home', {
    employeeData
        
    });
})
app.get('/todoList',async function (req, res){
    const list = await getAll()
    console.log(list)
    res.render('todolist',{
        list
    })
})

app.post('/upload', async (req, res) => {
    const data = {
        activity: req.body.activity,
        status: req.body.status
    }

    const result = await createTodo(data);
    res.redirect('/todoList')
})


const port = 3000;
app.listen(port, ()=>{
    console.log(`Server has started on port ${port}`);
})