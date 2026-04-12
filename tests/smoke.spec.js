const { test, expect } = require("@playwright/test");

async function installDeterministicDice(page) {
  await page.addInitScript(() => {
    Math.random = () => {
      const stack = new Error().stack || "";

      if (stack.includes("enemyTurn")) {
        return 0.0;
      }

      if (stack.includes("playerWeaponAttack") || stack.includes("castSpell")) {
        return 0.99;
      }

      return 0.5;
    };

    window.alert = (message) => {
      window.__lastAlert = message;
    };
  });
}

function trackRuntimeErrors(page) {
  const errors = [];

  page.on("pageerror", (error) => {
    errors.push(`pageerror: ${error.message}`);
  });

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(`console: ${message.text()}`);
    }
  });

  return errors;
}

async function startNewGame(page, name) {
  await page.goto("/index.html");
  await page.getByRole("button", { name: "New Adventure" }).click();
  await page.getByLabel("Name").fill(name);
  await page.locator('[data-kind="race"][data-id="dragonborn"]').click();
  await page.locator('[data-kind="class"][data-id="fighter"]').click();
  await page.getByRole("button", { name: "Begin Adventure" }).click();
  await expect(page.locator("#location-name")).toHaveText("Protector's Enclave");
  await expect(page.locator("#narrative")).toContainText("Chapter I: Ash Over Neverwinter");
}

async function clickAction(page, label) {
  await page.getByRole("button", { name: label, exact: true }).click();
}

async function finishCombatWithWeapon(page) {
  for (let round = 0; round < 8; round += 1) {
    const attackButton = page.getByRole("button", { name: "Weapon Attack" });
    if (!(await attackButton.isVisible().catch(() => false))) {
      break;
    }

    await attackButton.click();
    await page.waitForTimeout(30);
  }

  await expect(page.getByRole("button", { name: "Weapon Attack" })).toHaveCount(0);
}

test("save and load restores the journey state", async ({ page }) => {
  await installDeterministicDice(page);
  const errors = trackRuntimeErrors(page);

  await startNewGame(page, "Save Tester");
  await clickAction(page, "Talk: Captain Serra");
  await clickAction(page, "Travel: Market Square");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.locator("#narrative")).toContainText("Game saved.");

  await page.reload();
  await expect(page.getByRole("button", { name: "Continue Journey" })).toBeVisible();
  await page.getByRole("button", { name: "Continue Journey" }).click();

  await expect(page.locator("#location-name")).toHaveText("Market Square");
  await expect(page.locator("#char-brief")).toContainText("Save Tester");
  await expect(page.locator("#panel-quests")).toContainText("Ash Over Neverwinter");
  expect(errors).toEqual([]);
});

test("ambient exploration actions and scene art render on the main screen", async ({ page }) => {
  await installDeterministicDice(page);
  const errors = trackRuntimeErrors(page);

  await startNewGame(page, "Explorer");

  await expect(page.locator("#scene-image")).toHaveAttribute("src", /city-gates\.svg$/);
  await expect(page.locator("#scene-title")).toContainText("City Stone and Oath-Bells");
  await expect(page.getByRole("button", { name: "Smell Around" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Listen Closely" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Make A Perception Check" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Investigate The Area" })).toBeVisible();

  await clickAction(page, "Smell Around");
  await clickAction(page, "Write In Journal");

  await expect(page.locator("#narrative")).toContainText("separate the layers in the air");
  await expect(page.locator("#narrative")).toContainText("Journal note:");
  expect(errors).toEqual([]);
});

test("full adventure path reaches the victory ending", async ({ page }) => {
  await installDeterministicDice(page);
  const errors = trackRuntimeErrors(page);

  await startNewGame(page, "Smoke Knight");

  await clickAction(page, "Talk: Captain Serra");
  await clickAction(page, "Travel: Blacklake District");
  await clickAction(page, "Talk: Tormund Vale");
  await clickAction(page, "Travel: Neverdeath Approach");
  await clickAction(page, "Face Encounter: Wight Sentinel");
  await finishCombatWithWeapon(page);

  await expect(page.locator("#narrative")).toContainText("Loot: Shadow Sigil.");

  await clickAction(page, "Travel: Sunken Pier");
  await clickAction(page, "Face Encounter: Smuggler Ambush");
  await finishCombatWithWeapon(page);
  await expect(page.locator("#narrative")).toContainText("Loot: Tidal Sigil.");

  await clickAction(page, "Travel: Dockward");
  await clickAction(page, "Talk: Kael Quickstep");
  await expect(page.locator("#narrative")).toContainText("intel payment arrives");

  await clickAction(page, "Travel: Protector's Enclave");
  await clickAction(page, "Travel: Market Square");
  await clickAction(page, "Talk: Miri Ashwood");
  await clickAction(page, "Travel: Crafting Hall");
  await clickAction(page, "Use Crafting Bench");
  await expect(page.getByRole("button", { name: "Need Materials: Warded Key" })).toBeDisabled();
  await clickAction(page, "Leave Crafting Bench");

  await clickAction(page, "Travel: Market Square");
  await clickAction(page, "Travel: Protector's Enclave");
  await clickAction(page, "Travel: Blacklake District");
  await clickAction(page, "Travel: Mount Hotenow Rift");
  await clickAction(page, "Face Encounter: Ashbound Vanguard");
  await finishCombatWithWeapon(page);
  await expect(page.locator("#narrative")).toContainText("Loot: Flame Sigil.");

  await clickAction(page, "Travel: Blacklake District");
  await clickAction(page, "Travel: Protector's Enclave");
  await clickAction(page, "Travel: Market Square");
  await clickAction(page, "Travel: Crafting Hall");
  await clickAction(page, "Use Crafting Bench");
  await clickAction(page, "Craft: Warded Key");
  await expect(page.locator("#narrative")).toContainText("Warded Key hums");
  await clickAction(page, "Leave Crafting Bench");

  await clickAction(page, "Travel: Market Square");
  await clickAction(page, "Travel: Protector's Enclave");
  await clickAction(page, "Travel: Blacklake District");
  await clickAction(page, "Travel: Mount Hotenow Rift");
  await clickAction(page, "Confront Vexira");
  await finishCombatWithWeapon(page);

  await expect(page.locator("#narrative")).toContainText("Chapter Complete: Vexira falls");
  await expect(page.getByRole("button", { name: "Return To Title" })).toBeVisible();
  expect(errors).toEqual([]);
});
