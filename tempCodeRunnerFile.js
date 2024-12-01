const {Builder, Browser, By} = require('selenium-webdriver');

(async function helloSelenium() {
  const driver = await new Builder().forBrowser(Browser.CHROME).build();

  await driver.get('https://www.reg.kmitl.ac.th/room_v20/room_show_v2.php?year=2567&semester=2&building_no=ECC&room_no=ECC-CE704');
  let title = await driver.getTitle()
  let subjects = await driver.findElement(By.xpath('//td[a]'));
  console.log(subjects);
  
    
  await driver.quit();
})();