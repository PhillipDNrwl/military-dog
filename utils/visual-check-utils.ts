import { ClassicRunner, Eyes, Target, BatchInfo } from '@applitools/eyes-playwright';
import type { Locator, Page } from '@playwright/test';

// Use ClassicRunner to ensure only a single snapshot per check
const runner = new ClassicRunner();
let batch = new BatchInfo('Default Batch');

/**
 * Initialize a new visual test batch.
 * @param batchName - Name of the batch in Applitools dashboard
 */
export function initVisualTests(batchName: string) {
  batch = new BatchInfo(batchName);
}

interface VisualOptions {
  appName?: string;
  region?: string | Locator;
  viewportSize?: { width: number; height: number };
  masks?: Array<string | Locator>;
}

function isVisualOptions(obj: any): obj is VisualOptions {
  return (
    obj != null &&
    (obj.appName !== undefined || obj.region !== undefined || obj.viewportSize !== undefined || obj.masks !== undefined)
  );
}

/**
 * Takes a visual snapshot via Applitools Eyes using ClassicRunner.
 *
 * @param page - Playwright Page instance
 * @param testName - Unique name for this snapshot within the batch
 * @param regionOrOpts - Either a testId string, Locator, or a VisualOptions object
 * @param viewportSizeOverride - Optional viewport size override when passing region directly
 */
export async function visualCheck(
  page: Page,
  testName: string,
  regionOrOpts?: string | Locator | VisualOptions,
  viewportSizeOverride?: { width: number; height: number },
) {
  let appName = 'Nx Cloud CI-Visual';
  let region: string | Locator | undefined;
  let viewportSize: { width: number; height: number } | undefined;
  let masks: Array<string | Locator> = [];

  if (isVisualOptions(regionOrOpts)) {
    appName = regionOrOpts.appName || appName;
    region = regionOrOpts.region;
    viewportSize = regionOrOpts.viewportSize;
    masks = regionOrOpts.masks ?? [];
  } else if (regionOrOpts !== undefined) {
    region = regionOrOpts;
    viewportSize = viewportSizeOverride;
  }

  const eyes = new Eyes(runner);
  eyes.setBatch(batch);
  eyes.setApiKey(process.env['APPLITOOLS_API_KEY']!);

  // Open a visual test
  await eyes.open(page, appName, testName, viewportSize);

  // Determine the target: region or full window
  let checkTarget = region
    ? Target.region(typeof region === 'string' ? page.getByTestId(region) : region)
    : Target.window();

  // Apply any masks
  for (const mask of masks) {
    const maskLocator = typeof mask === 'string' ? page.getByTestId(mask) : mask;
    checkTarget = checkTarget.ignore(maskLocator);
  }

  // Perform the visual check and close the test
  await eyes.check(testName, checkTarget);
  await eyes.close();
}