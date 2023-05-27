const { Builder, Browser, By, until } = require("selenium-webdriver");

let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).build();
});

afterEach(async () => {
  await driver.quit();
});

describe("Duel Duo tests", () => {
  test("page loads with title", async () => {
    await driver.get("http://localhost:8000");
    await driver.wait(until.titleIs("Duel Duo"), 1000);
  });
  test("draw button displays the div with id='choices'", async () => {
    await driver.get("http://localhost:8000");
    const drawButton = await driver.findElement(By.id("draw"));
    await drawButton.click();
    const choicesDiv = await driver.findElement(By.id("choices"));
    const isDisplayed = await choicesDiv.isDisplayed();
    expect(isDisplayed).toBe(true);
  });
  test("clicking an 'Add to Duo' button displays the div with id='player-duo'", async () => {
    await driver.get("http://localhost:8000");
    
    const addButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Add to Duo')]")));
    await addButton.click();
    const playerDuoDiv = await driver.findElement(By.id("player-duo"));
    const isDisplayed = await playerDuoDiv.isDisplayed();
    
    expect(isDisplayed).toBe(true);
  });
});