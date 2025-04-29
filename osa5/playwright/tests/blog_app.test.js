const { test, expect, beforeEach, describe } = require("@playwright/test");
const { logIn, newBlog } = require("./assistant");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "Sergey Dolzhenko",
        username: "Sege",
        password: "fullstack",
      },
    });

    await request.post("/api/users", {
      data: {
        name: "Karelia",
        username: "amk",
        password: "salainen",
      },
    });

    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("Log in to application")).toBeVisible();
    await expect(page.getByTestId("username")).toBeVisible();
    await expect(page.getByTestId("password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await logIn(page, "Sege", "fullstack");

      await expect(page.getByText("Blogs")).toBeVisible();
      await expect(page.getByText("Sergey Dolzhenko logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await logIn(page, "Sege", "KareliaAMK");

      const notificationDiv = await page.locator(".notification.error");
      await expect(notificationDiv).toContainText(
        "Invalid username or password"
      );

      await expect(
        page.getByText("Sergey Dolzhenko logged in")
      ).not.toBeVisible();
    });

    describe("When logged in", () => {
      beforeEach(async ({ page }) => {
        await logIn(page, "Sege", "fullstack");
      });

      test("a new blog can be created", async ({ page }) => {
        await newBlog(page, "Playwright Test", "Sergey", "www.test.com");

        const notificationDiv = await page.locator(".notification");
        await expect(notificationDiv).toContainText(
          "A new blog Playwright Test by Sergey added"
        );

        await expect(
          page.locator(".blog", { hasText: "Playwright Test" })
        ).toBeVisible();
        await expect(page.getByRole("button", { name: "View" })).toBeVisible();
      });

      test("a blog can be liked", async ({ page }) => {
        await newBlog(page, "Second Playwright Test", "Sergey", "www.test.com");

        await page.getByRole("button", { name: "View" }).click();
        await page.getByRole("button", { name: "Like" }).click();

        await expect(page.getByText("Likes: 1")).toBeVisible();
      });

      test("a blog can be deleted", async ({ page }) => {
        await newBlog(page, "Third Playwright Test", "Sergey", "www.test.com");

        await page.getByRole("button", { name: "View" }).click();

        page.on("dialog", (dialog) => {
          expect(dialog.type()).toBe("confirm");
          expect(dialog.message()).toContain(
            "Remove blog Third Playwright Test by Sergey?"
          );
          dialog.accept();
        });

        await page.getByRole("button", { name: "Remove" }).click();

        await expect(
          page.locator(".notification", {
            hasText: "Blog: Third Playwright Test has been removed",
          })
        ).toBeVisible();

        await expect(
          page.locator(".blog", {
            hasText: "hird Playwright Test",
          })
        ).not.toBeVisible();
      });

      test("only the blog author can see the `remove` button", async ({
        page,
      }) => {
        await newBlog(page, "Fourth Playwright Test", "Sergey", "www.test.com");

        await page.getByRole("button", { name: "Sign out" }).click();

        await logIn(page, "amk", "salainen");
        await page.getByRole("button", { name: "View" }).click();

        await expect(
          page.getByRole("button", { name: "Remove" })
        ).not.toBeVisible();
      });

      test("the most liked blog always at the top of the list", async ({
        page,
      }) => {
        await newBlog(page, "First", "Sergey.D", "www.test.com");
        await newBlog(page, "Second", "Sergey.A", "www.test.com");
        await newBlog(page, "Third", "Sergey.X", "www.test.com");

        const secondBlog = await page.getByText("Second");

        await secondBlog.getByRole("button", { name: "View" }).click();
        await secondBlog.getByRole("button", { name: "Like" }).click();

        await page.waitForSelector("text=Likes: 1");

        const titles = await page.locator(".blog").allTextContents();

        await expect(titles[0]).toContain("Second");
        await expect(titles[1]).toContain("First");
        await expect(titles[2]).toContain("Third");
      });
    });
  });
});
