import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import constants from '../utils/constants';

const courseTitle = faker.lorem.words(3);
const courseDescription = faker.lorem.sentence({ min: 5, max: 15 });
const lessonTitle = faker.lorem.words(3);

test.describe('Create a course and take the course @smoke', () => {
  test('Admin: Create a course and invite a learner @smoke', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/login');
    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill(constants.ADMIN_USERNAME);
    await page.getByPlaceholder('Email').press('Tab');
    await page.getByPlaceholder('Password').fill(constants.ADMIN_PASSWORD);
    await page.getByTestId('signInButton').click();
    await page.getByText('Courses').click();
    await page.getByTestId('form-button').click();
    await page.getByPlaceholder('Course Title').click();
    await page.getByPlaceholder('Course Title').fill(courseTitle);
    await page.getByPlaceholder('Course Description').click();
    await page.getByPlaceholder('Course Description').fill(courseDescription);
    await page
      .getByLabel('Create Course')
      .getByRole('button', { name: 'Create' })
      .click();
    await page
      .getByRole('cell', { name: courseTitle, exact: true })
      .first()
      .click();
    await page
      .getByRole('row', {
        name: `${courseTitle} ${courseDescription} View Course Invite Learner`,
      })
      .getByRole('button')
      .first()
      .click();
    await page.getByRole('button', { name: 'Create' }).click();
    await page.getByTestId('open-lesson-form').click();
    await page.getByPlaceholder('Lesson name').click();
    await page.getByPlaceholder('Lesson name').fill(lessonTitle);
    await page
      .getByPlaceholder(
        "This is your lesson description. Give your learners an idea of what they're about to learn!",
      )
      .click();
    await page.getByTestId('create-learning-item').click();
    await page.getByTestId('createCardButton').click();
    await page.getByTestId('Text').click();
    await page.getByText('Untitled').click();
    await page.getByRole('heading', { name: 'Untitled' }).click();
    await page.getByText('Untitled').dblclick();
    await page.getByRole('textbox').nth(1).fill('This is a title');
    await page.getByRole('button', { name: 'arrow-left' }).click();
    await page.getByRole('link', { name: 'arrow-left' }).click();
    await page.getByRole('link', { name: 'arrow-left' }).click();
    await page
      .getByRole('cell', { name: courseTitle, exact: true })
      .first()
      .click();
    await page.locator('.ant-table-cell > button:nth-child(2)').first().click();
    await page.getByLabel(constants.LEARNER_USERNAME).check();
    const inviteButton = await page.getByRole('button', {
      name: 'Invite',
      exact: true,
    });
    await inviteButton.click();
    await expect(inviteButton).toBeEnabled({ timeout: 5000 });
    await page.getByLabel('Close', { exact: true }).click();
  });

  test('Learner: View course invitation and take a lesson @smoke', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/login');
    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill(constants.LEARNER_USERNAME);
    await page.getByPlaceholder('Email').press('Tab');
    await page.getByPlaceholder('Password').fill(constants.LEARNER_PASSWORD);
    await page.getByTestId('signInButton').click();
    await page.getByTestId('roleDropdown').click();
    await page.getByText('Learner').click();
    await page.getByRole('menuitem', { name: 'Courses' }).click();
    const course = page.getByRole('cell', { name: courseTitle });
    await expect(course).toBeEnabled({ timeout: 5000 });
    await course.click({ timeout: 50000 });

    const startButton = await page
      .getByRole('row', {
        name: `${lessonTitle} This is your lesson description. Give your learners an idea of what they're about to learn!`,
      })
      .getByRole('button');

    Promise.all([
      startButton.waitFor({ state: 'visible' }),
      startButton.click(),
    ]);
    await expect(page).toHaveURL(/learner\/learning_item\//);
    await page.getByTestId('opn-lsn-details').click();
    await page
      .getByLabel('Close', { exact: true })
      .getByTestId('form-button')
      .click();
    await page.getByTestId('lesson-next-button').click();
    await page.getByTestId('lesson-prev-button').click();
    await page.getByTestId('lesson-next-button').click();
    await page.getByTestId('lesson-next-button').click();
    await page.getByTestId('opn-lsn-details').click();
    await page.locator('.ant-drawer-mask').click();
    await page.getByRole('button', { name: 'Back to Courses' }).click();
    await page.getByRole('link', { name: 'arrow-left' }).click();
  });
});
