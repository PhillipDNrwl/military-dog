import { Configuration, BatchInfo, ClassicRunner, Eyes, Target, BrowserType } from '@applitools/eyes-playwright';
import type { Locator, Page } from '@playwright/test';

const runner = new ClassicRunner();
let batch = new BatchInfo('Default Batch');

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
 * Targets only a single browser/environment (Chrome@1280x720).
 *
 * @param page Playwright Page instance
 * @param testName Unique name for this snapshot within the batch
 * @param regionOrOpts Either a testId string, Locator, or a VisualOptions object
 * @param viewportSizeOverride Optional viewport size override when passing region directly
 */
export async function visualCheck(
  page: Page,
  testName: string,
  regionOrOpts?: string | Locator | VisualOptions,
  viewportSizeOverride?: { width: number; height: number }
) {
  let appName = 'Nx Cloud CI-Visual';
  let region: string | Locator | undefined;
  let viewportSize: { width: number; height: number } | undefined;
  let masks: Array<string | Locator> = [];

  if (isVisualOptions(regionOrOpts)) {
    const opts = regionOrOpts as VisualOptions;
    appName = opts.appName || appName;
    region = opts.region;
    viewportSize = opts.viewportSize;
    masks = opts.masks ?? [];
  } else if (regionOrOpts !== undefined) {
    region = regionOrOpts;
    viewportSize = viewportSizeOverride;
  }

  const conf = new Configuration();
  conf.addBrowser(1280, 720, BrowserType.CHROME);


  const eyes = new Eyes(runner);
  eyes.setBatch(batch);
  eyes.setConfiguration(conf);
  eyes.setApiKey(process.env['APPLITOOLS_API_KEY']!);

  await eyes.open(page, appName, testName, viewportSize);

  let checkTarget = region
    ? Target.region(typeof region === 'string' ? page.getByTestId(region) : region)
    : Target.window();

  for (const mask of masks) {
    const maskLocator = typeof mask === 'string' ? page.getByTestId(mask) : mask;
    checkTarget = checkTarget.ignore(maskLocator);
  }

  await eyes.check(testName, checkTarget);
  await eyes.close();
}
