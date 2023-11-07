const puppeteer = require("puppeteer")

function generateRandomString(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

const CHECKIN_LINK = "https://msm.majisemi.com/check_in/1974"

const users = [];
const strRandom = generateRandomString(5)

for (let i = 1; i <= 30; i++) {
  users.push({
    email: `test${i}_${strRandom}@gmail.com`,
    username: `test${i}_${strRandom}`,
  });
}

(async () => {
  const browser = await puppeteer.launch({headless: 'new'});;

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

    console.log(i);
  }
})();
