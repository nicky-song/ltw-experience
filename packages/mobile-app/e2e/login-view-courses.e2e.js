const devCredential = {
  email: process.env.DEV_EMAIL,
  password: process.env.DEV_PASS
}
const isDev = false;

describe('Login and view courses page', () => {
  beforeAll(async () => {
    await device.launchApp();

    if (isDev) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await element(by.text('http://localhost:8081')).tap();
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await element(by.text('Welcome to Learn To Win')).tap();
    }

    await waitFor(element(by.id('login'))).toBeVisible().withTimeout(5000);
  });

  it('Should have Login screen', async () => {
    await expect(element(by.id('login'))).toExist();
  });

  it('Navigate to Course screen when the login is succeed', async () => {
    //TODO: We might need to configure here the different credential per environment. /dev, /staging
    const credential = devCredential;

    await element(by.id('emailInput')).typeText(credential.email);
    await element(by.id('pwdInput')).typeText(credential.password);
    await element(by.id('loginBtn')).tap();
    await waitFor(element(by.text('Invitations'))).toBeVisible().withTimeout(5000);
  })
});
