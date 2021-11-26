const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())

app.get('/status', (request, response) => response.json({clients: clients.length}))

const PORT = 3000

let clients = []
let facts = []

/**
 * @param {string} msgToSend the string to send
 * @returns {string} event-stream compliant string
 */
function dataString(msgToSend) {
    return `data: ${msgToSend}\n\n`
}

/**
 * @param {express.Response} clientResponse client response to write date onto
 */
 function sendNewDate(clientResponse) {
    return clientResponse.write(dataString(new Date().toISOString()))
}

/**
 * @param {express.Response} clientResponse 
 * @param {*} dataObject any object. This will be stringified using `JSON.stringify()`
 */
function sendJson(clientResponse, dataObject) {
    return clientResponse.write(dataString(JSON.stringify(dataObject)))
}

function eventsHandler(request, response, next) {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    }
    response.writeHead(200, headers)

    const now = new Date()

    const data = dataString(now.toISOString())

    response.write(data)

    const clientId = now.getTime()
    console.log(`New client - ${clientId}`)

    const newClient = {
        id: clientId,
        interval: setInterval(sendNewDate, 1000, response)
    }

    clients.push(newClient)

    request.on('close', () => {
        console.log(`${clientId} Connection closed`)
        clearInterval(newClient.interval)
        clients = clients.filter(client => client.id !== clientId)
    })
}
  
app.get('/events', eventsHandler)

app.listen(PORT, () => {
  console.log(`Facts Events service listening at http://localhost:${PORT}`)
})
