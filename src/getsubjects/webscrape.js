const { Builder, Browser, By } = require("selenium-webdriver");

async function getSubjects(room, semester, year, days) {
  const driver = await new Builder().forBrowser(Browser.CHROME).build();
  
  try {
    await driver.get(
      `https://www.reg.kmitl.ac.th/room_v20/room_show_v2.php?year=${year}&semester=${semester}&building_no=ECC&room_no=ECC-CE${room}`
    );

    const title = await driver.getTitle();
    console.log("Page Title:", title);

    // store subjects in dictionary
    let allSubjects = {};

    for (let dayname of days) {
      const d = await driver.findElements(
        By.xpath(
          `//tr[td[strong/text() = "${dayname}"]]/td[position()>1 and @colspan]`
        )
      );
      
      let count = 0
      let currentHour = 8
      let currentMinute = 0
      let Subjects = {}

      for (let td of d) {
        count += 1;
        const subjectText = (await td.getText()).split("\n");
        const subjectName = subjectText[0];
        const subjectProfessor = subjectText[1];
        const colspan = await td.getAttribute("colspan");
        
        // if col is not a subject
        if (colspan == 1) {
          currentMinute += 15;
          if (currentMinute == 60) {
            currentHour += 1;
            currentMinute = 0;
          }
        }

        // if col is a subject
        if (colspan > 1) {
          // calculate subject duration to minutes
          let subjectDuration = ((parseInt(colspan) + 1) / 8) * 60;
          const subjectStart =
            currentHour.toString().padStart(2, "0") +
            ":" +
            currentMinute.toString().padStart(2, "0");

          // add subject duration to current time
          currentHour += Math.trunc(subjectDuration / 60);
          subjectDuration -= Math.trunc(subjectDuration / 60) * 60; // minus hour only
          currentMinute += subjectDuration;
          if (currentMinute >= 60) {
            currentHour += 1;
            currentMinute -= 60;
          }

          const subjectEnd =
            currentHour.toString().padStart(2, "0") +
            ":" +
            currentMinute.toString().padStart(2, "0");


          // merge existing subject
          if (subjectName in Subjects) {
            Subjects[subjectName] = [
              Subjects[subjectName][0],
              subjectEnd,
              Subjects[subjectName][2],
            ];
            if (Subjects[subjectName][2] != subjectProfessor) {
              Subjects[subjectName][2].push(subjectProfessor);
            }
          } 
          
          // add new subject
          else {
            Subjects[subjectName] = [
              subjectStart,
              subjectEnd,
              [subjectProfessor],
            ];
          }
        }
        // console.log(count, ": ", colspan, subjectText);
        
      }
      // register each day
      allSubjects[dayname] = Subjects

    }
    return({[room] : allSubjects});
    
    // return { room: subject };
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await driver.quit();
  }
};

module.exports = {getSubjects}

// {
//   monday : [
//     {subject_id: 010,
//       starttime: 8.00,
//       endtime: 12.00,
//       sunjectname: computername
//       professor: [xx,xx]

//     }
//   ],
//   tuesday: {

//   }
// }
