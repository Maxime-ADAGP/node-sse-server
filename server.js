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
const jwt = require('jsonwebtoken')
const { expressjwt: ejwt } = require('express-jwt')
const cors = require('cors')
const SSEChannel = require('sse-pubsub')

const { PORT = 3000, JWT_SECRET } = process.env
if (!JWT_SECRET) {
    console.error('JWT_SECRET env variable is undefined!')
    process.exit(1)
}
const JWT_algorithms = ['HS256']

const GUEST_USER = 1
const LOGGED_USER = GUEST_USER + 1
const ADMIN_USER = LOGGED_USER + 1
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const channelOptions = {
    pingInterval: 3000,
    maxStreamDuration: 30_000_000,
    clientRetryInterval: 1000,
    startId: 1,
    historySize: 1000,
    rewind: 1000
}

const channels = {
    admin: new SSEChannel(channelOptions),
    user: new SSEChannel(channelOptions),
    guest: new SSEChannel(channelOptions),
}

app.get('/status', (_req, res) => res.json({
    adminClients: channels.admin.listClients(),
    userClients: channels.user.listClients(),
    guestClients: channels.guest.listClients(),
    count: {
        admin: channels.admin.getSubscriberCount(),
        user: channels.user.getSubscriberCount(),
        guest: channels.guest.getSubscriberCount(),
        total: channels.admin.getSubscriberCount() + channels.user.getSubscriberCount() + channels.guest.getSubscriberCount()
    }
}))
  
app.get('/events',
    ejwt({ secret: JWT_SECRET, algorithms: JWT_algorithms, credentialsRequired: false }),
    (req, res) => {
        // if no auth, consider it a guest
        if (!req.auth?.privilegeLevel) {
            req.auth = {
                privilegeLevel: GUEST_USER
            }
        }

        switch (req.auth.privilegeLevel) {
            case GUEST_USER: channels.guest.subscribe(req, res); return
            case LOGGED_USER: channels.user.subscribe(req, res); return
            case ADMIN_USER: channels.admin.subscribe(req, res); return

            default: return console.error(`Unknown privilege level: ${req.auth.privilegeLevel}`)
        }
    }
)

function sendFact(fact, type='', privilegeLevel=GUEST_USER) {
    switch (privilegeLevel) {
        case GUEST_USER:
            channels.guest.publish(JSON.stringify(fact), type)
        // eslint-disable-next-line no-fallthrough
        case LOGGED_USER:
            channels.user.publish(JSON.stringify(fact), type)
        // eslint-disable-next-line no-fallthrough
        case ADMIN_USER:
            channels.admin.publish(JSON.stringify(fact), type)
            break

        default:
            console.error(`Unknown privilege level: ${privilegeLevel}`)
    }
}

app.post('/fact(/:privilege)?', (req, res) => {
    const newFact = req.body.fact
    const factType = req.body.type || ''
    const privilege = req.params.privilege

    if (privilege === 'admin') sendFact(newFact, factType, ADMIN_USER)
    else if (privilege === 'user') sendFact(newFact, factType, LOGGED_USER)
    else sendFact(newFact, factType)

    return res.json(req.body)
})

app.get('/login/:privilege', (req, res) => {
    const privilege = req.params.privilege

    if (privilege === 'admin') return res.json({ token: jwt.sign({ privilegeLevel: ADMIN_USER }, JWT_SECRET) })
    if (privilege === 'user') return res.json({ token: jwt.sign({ privilegeLevel: LOGGED_USER }, JWT_SECRET) })
    
    return res.status(400).json({ message: 'Only "admin" and "user" privileges are supported' })
})

app.listen(PORT, () => {
  console.log(`Facts Events service listening at http://localhost:${PORT}`)
})
