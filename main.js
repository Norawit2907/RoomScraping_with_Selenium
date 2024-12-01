const { Builder, Browser, By } = require('selenium-webdriver');

(async function helloSelenium() {
  const driver = await new Builder().forBrowser(Browser.CHROME).build();

  try {
    await driver.get('https://www.reg.kmitl.ac.th/room_v20/room_show_v2.php?year=2567&semester=2&building_no=ECC&room_no=ECC-CE704');
    
    const title = await driver.getTitle();
    console.log('Page Title:', title);

    const monday = await driver.findElements(By.xpath('//tr[td[strong/text() = "อังคาร"]]/td[position()>1 and @colspan]'));
    let count = 0, currentHour = 8, currentMinute = 0;
    // store subjects in dictionary
    let mondaySubjects = {}

    for(let td of monday){
      count += 1
      const subjectText = await td.getText()
      const colspan = await td.getAttribute("colspan")

      // if col is not a subject
      if (colspan == 1){
        currentMinute += 15;
        if(currentMinute == 60){
          currentHour += 1;
          currentMinute = 0;
        }
      }

      // if col is a subject
      if (colspan > 1){
        // calculate subject duration to minutes
        let subjectDuration = ((parseInt(colspan) + 1) / 8) * 60;
        const subjectStart = currentHour.toString().padStart(2,'0') + ":" + currentMinute.toString().padStart(2,'0')
        
        // add subject duration to current time
        currentHour += Math.trunc(subjectDuration / 60)
        subjectDuration -= (Math.trunc(subjectDuration / 60) * 60); // minus hour only
        currentMinute += subjectDuration
        if (currentMinute >= 60){
          currentHour += 1
          currentMinute -= 60;
        }

        const subjectEnd = currentHour.toString().padStart(2,'0') + ":" + currentMinute.toString().padStart(2,'0')
        
        if(subjectText in mondaySubjects){
          
          
          mondaySubjects[subjectText] = [mondaySubjects[subjectText][0], subjectEnd]
        }
        else{
          mondaySubjects[subjectText] = [subjectStart, subjectEnd]
        }

        console.log("time : ",currentHour, ":", currentMinute);
      }
      console.log(count, ": ", colspan, subjectText);
      
    }
    console.log(mondaySubjects);
    
    console.log("count : ", count);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await driver.quit();
  }
})();
