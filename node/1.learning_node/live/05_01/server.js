var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

mongoose.Promise = Promise

var dbUrl = 'mongodb+srv://huncholane:Heromoon@cluster0.85hdu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

var Message = mongoose.model('Message', {
    name: String,
    message: String
})

app.get('/messages', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
})

app.get('/messages/:user', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    var user = req.params.user
    console.log(user)
    Message.find({name: user}, (err, messages) => {
        res.send(messages)
    })
})

app.post('/messages', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    if (req.body.name!=null) {
        try {
            var message = new Message(req.body)
            var savedMessage = await message.save()
            console.log('saved')
            var censored = await Message.findOne({message: 'badword'})

            if (censored) 
                await Message.remove({_id: censored.id})
            else 
                io.emit('message', req.body)

            res.sendStatus(200)
        } catch (error) {
            res.sendStatus(500)
            return console.error(error)
        }
        //var message = new Message(req.body)
        //message.save((err) => {
        //    if (err) {
        //        sendStatus(500)
        //    }

            // Ugly code for bad word filter
            //Message.findOne({message: 'badword'}, (err, censored) => {
            //    if (censored) {
            //        console.log('censored words found')
            //        Message.deleteOne({_id: censored.id}, (err) => {
            //            console.log('removed censored message')
            //        })
            //    }
            //})


            
        //    io.emit('message', req.body)
        //    res.sendStatus(200)
        //})
    }
})

io.on('connection', (socket) => {
    console.log('a user connected')
})

mongoose.connect(dbUrl, (err) => {
    console.log('mongo db connection', err)
})

var server = http.listen(3000, () => {
    
    console.log('server is listening on port', server.address().port)
})