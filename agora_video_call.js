const puppeteer = require("puppeteer")

function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function generateRandomString(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

const CHECKIN_LINK = "https://msm.majisemi.com/check_in/1972"

const users = [];
const strRandom = generateRandomString(10)

for (let i = 1; i <= 25; i++) {
  users.push({
    email: `test${i}_${strRandom}@gmail.com`,
    username: `test${i}_${strRandom}`,
  });
}
const pages = [];

(async () => {
  const browser = await puppeteer.launch({headless: 'new'});

  for (let i = 0; i < users.length; i++) {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);

    const client = users[i];
    const email = client.email;
    const nickname = client.username;
    const iconIndex = Math.floor(Math.random() * 15) + 1;

    const status = await page.goto(CHECKIN_LINK);

    await page.waitForSelector('input[type="text"][name="email"][id="email"]');
    await page.waitForSelector('input[type="text"][name="nickname"][id="nickname"]');
    await page.waitForSelector(`.grid-template-columns-auto-10.d-grid.grid-row-gap-10`);
    await page.waitForSelector(`.w-300p.p-12p.font-size-21[type="submit"]`);
    const iconElement = await page.waitForSelector(`.grid-template-columns-auto-10.d-grid.grid-row-gap-10 > div:nth-of-type(${iconIndex})`);

    await page.type('input[type="text"][name="email"][id="email"]', email);
    await page.type('input[type="text"][name="nickname"][id="nickname"]', nickname);
    await iconElement.click();

    const isChecked = await page.$eval('#agree_terms', (element) => element.checked);
    if (!isChecked) {
      await page.click(`.p-application_form__content.p-0.m-0.border-unset.bg-white.d-flex.flex-column`);
    }

    const currentURL = await page.url();
    console.log('currentURL', currentURL)
    const [response] = await Promise.all([
      page.click(`.w-300p.p-12p.font-size-21[type="submit"]`),
      page.waitForNavigation({ waitUntil: 'load' }),
    ]);

    const seminarUrl = await page.url();
    console.log('seminar url', seminarUrl) 
    await page.setDefaultNavigationTimeout(0);
    // await page.waitForSelector('.comments-screen-zone')
    // await page.waitForSelector('.ck.ck-reset.ck-editor.ck-rounded-corners')
    // await page.waitForSelector('.btn-submit-chat.text-right.mt-33p.pr-0p')
    pages.push(page)
  }
  setInterval(async () => {
    const page = getRandomElement(pages)
    page.evaluate(() => {
      try {
        function generateRandomString2(length) {
          const characters = 'abcdefghijklmnopqrstuvwxyz';
          let result = '';
        
          for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
          }
        
          return result;
        }
        window.commentEditor.setData(generateRandomString2(50))
        $('.btn-submit-chat.text-right.mt-33p.pr-0p').click()
        const min = 1
        const max = 6
        const randomReactionIndex = Math.floor(Math.random() * (max - min + 1)) + min;
        $(`.comments-screen-zone button:nth-of-type(${randomReactionIndex})`).click()
        return true
      } catch (error) {
        console.log(error);
      }
    })
  }, 200)
})();
