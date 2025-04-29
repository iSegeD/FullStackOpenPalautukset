const logIn = async (page, username, password) => {
  await page.getByTestId("username").fill(username);
  await page.getByTestId("password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
};

const newBlog = async (page, title, author, url) => {
  await page.getByRole("button", { name: "Create new blog" }).click();
  await page.getByTestId("title").fill(title);
  await page.getByTestId("author").fill(author);
  await page.getByTestId("url").fill(url);
  await page.getByRole("button", { name: "Create" }).click();

  await page.waitForSelector(".blog");
};

export { logIn, newBlog };
