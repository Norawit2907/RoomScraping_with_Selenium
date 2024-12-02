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
    let dates = req.query.date
    
    days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์"]
    console.log("input ", dates);
    
    if(dates == undefined || dates == ""){
        console.log("true");
        subjects = await webscraper.getSubjectsFromDays(room, semester, year, days)
        // console.log(subjects);
    }
    else if(dates){
        const selectedTime = new Date(dates);
        const day = days[selectedTime.getDay()]
        console.log(day);
        subjects = await webscraper.getSubjectsFromDays(room, semester, year, [day])
    }

    console.log(subjects);
    
    res.send(subjects)
    
})

app.get('/allroom', async (req, res) => {
    let semester = req.query.semester
    let year = req.query.year
    const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์"]
    floors = ["5", "6", "7", "8"]
    // floors = ["5"]
    allRoom = {}
    for(let floor of floors){
        for(let room=0; room<=11;room++){
            const roomNumber = floor + room.toString().padStart(2, "0")
            subjects = await webscraper.getSubjectsFromDays(roomNumber, semester, year, days)
            let obj = Object.entries(subjects)[0]
            allRoom[obj[0]] = obj[1]
            console.log("obj : ", obj);
        }
    }
    
    
    console.log(allRoom);
    res.send(allRoom)
})


app.listen(port, () => {
    console.log(`App is running on port ${port}`)
})