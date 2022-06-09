const io = require('socket.io')('chiadikaobi-media-socket.herokuapp.com', {
    cors:{
        origin: "https://chiadimedia.vercel.app"
    }
})

let users = []

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
    users.push({userId, socketId})
}

const getUser = (userId) => {
    return users.find((user) => user.userId === userId)
}

const removeUser = (socketId) => {
    users = users.filter((user) => {
        user.userId !== socketId
    })
}

io.on('connection', (socket) => {
    console.log('User connected')

    // take user and socketId from user
    socket.on('addUser', (userId) => {
        addUser(userId, socket.id)
        io.emit('getUser', users)
    })

    // send and get message
    socket.on('sendMessage', ({senderId, receiverId, text}) => {
        const user = getUser(receiverId)
        io.to(user?.socketId).emit('getMessage', {
            senderId, text
        })
    })
    

    // disconnect a user
    socket.on('disconnect', () => {
        console.log('a user disconnected')
        removeUser(socket.id)
        io.emit('getUser', users)
    })
})