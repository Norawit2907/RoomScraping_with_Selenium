const webscraper = require('./src/getsubjects/webscrape.js')
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    
    res.send('hello world!')
})

app.get('/room', async (req, res) => {
    let room = req.query.roomNumber
    let semester = req.query.semester
    let year = req.query.year
    let day = req.query.date
    subjects = {}
    if(day == null){
        date = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์"]
        subjects = await webscraper.getSubjects(room, semester, year, date)
        console.log(subjects);
    }
    
    res.send(subjects)
    
})

app.get('/roomfromdate', (req, res) => {
    let room = req.query.roomNumber
    let semester = req.query.semester
    let year = req.query.year
    let day = req.query.date
    res.send()
})


app.listen(port, () => {
    console.log(`App is running on port ${port}`)
})