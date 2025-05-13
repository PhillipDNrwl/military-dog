import {
    BatchInfo,
    Eyes,
    Target,
    VisualGridRunner,
  } from '@applitools/eyes-playwright';
  import type { Locator, Page } from '@playwright/test';
  
  const runner = new VisualGridRunner({ testConcurrency: 5 });
  let batch = new BatchInfo('Basic visual test');
  
  
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
      (obj.appName !== undefined ||
        obj.region !== undefined ||
        obj.viewportSize !== undefined ||
        obj.masks !== undefined)
    );
  }
  
  /**
   * Takes a visual snapshot via Applitools Eyes.
   *
   * @param page - Playwright Page
   * @param testName - Unique name for this snapshot within the batch
   * @param regionOrOpts - Either a testId string, Locator, or a VisualOptions object
   * @param viewportSizeOverride - Optional viewport size when passing region directly
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
  
    await eyes.open(page, appName, testName, viewportSize);
  
    let checkTarget;
    if (region) {
      const locator =
        typeof region === 'string' ? page.getByTestId(region) : region;
      checkTarget = Target.region(locator);
    } else {
      checkTarget = Target.window();
    }
  
    for (const mask of masks) {
      const maskLocator =
        typeof mask === 'string' ? page.getByTestId(mask) : mask;
      checkTarget = checkTarget.ignore(maskLocator);
    }
  
    await eyes.check(testName, checkTarget);
    await eyes.close();
  }
  
  // import { visualCheck, initVisualTests } from './e2e-nx-cloud-utils';
  //
  //
  // test('Run Viz w/ DTE v2 with masked elements', async ({ page, db }) => {
  //   await page.goto(`/cipes/${cipe._id}`);
  //
  //   // Mask out the live timer element inside the visualization container
  //   await visualCheck(page, 'DTE v2 Graph Masked', {
  //     region: 'run-visualization-container',
  //     masks: ['whatever-id'],
  //   });
  // });
  