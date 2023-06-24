const express = require('express')
const cors = require('cors')
const path = require('path')
const sqlite3 = require('sqlite3')
const {open} = require('sqlite')
const { request } = require('http')
const { response } = require('express')

const app = express()
app.use(express.json())
app.use(cors())

let db = null
const dbPath = path.join(__dirname, "booking-slot-details.db")
const PORT = process.env.PORT || 3030

const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        })
        app.listen(PORT, () => {
            console.log("Server Running at http://localhost:3030/")
        })
    } catch (error) {
        console.log(`DB Error: ${error}`)
        process.exit(1)
    }
}

initializeDBAndServer()

app.get('/booking-slot/user-details/', async (request, response) => {
    const getUserDetailsQuery = 'SELECT * FROM user_details;'
    const data = await db.all(getUserDetailsQuery)
    response.send(data)
})

app.post('/booking-slot/create/', async (request, response) => {
    const {id, name, mobileNumber, email, date, time} = request.body
    const getCreateBookingSlotQuery = `INSERT INTO user_details (id, name, mobile_number, email, date, time) VALUES ('${id}', '${name}', '${mobileNumber}', '${email}', '${date}', '${time}');`
    await db.run(getCreateBookingSlotQuery)
    response.send("Create Booking Slot Successfully")
})