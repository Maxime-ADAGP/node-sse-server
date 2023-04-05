/**
 *    Copyright 2023 Maxime Daniel
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

const express = require('express')
const bodyParser = require('body-parser')

const key = fs.readFileSync('./key.pem')
const cert = fs.readFileSync('./cert.pem')

const app = express()
const server = https.createServer({key, cert}, app)

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

server.listen(PORT, () => {
  console.log(`Facts Events service listening at https://localhost:${PORT}`)
})
