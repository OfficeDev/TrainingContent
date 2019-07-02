import { pingTestServer, sendTestResults } from "office-addin-test-helpers";
import { run } from "../../src/taskpane/excel";
import * as testHelpers from "./test-helpers";
const port: number = 4201;
let testValues: any = [];

Office.onReady(async (info) => {
    if (info.host === Office.HostType.Excel) {
        const testServerResponse: object = await pingTestServer(port);
        if (testServerResponse["status"] == 200) {
            await runTest();
        }
    }
});

export async function runTest(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
        try {
            // Execute taskpane code
            await run();
            await testHelpers.sleep(2000);

            // Get output of executed taskpane code
            await Excel.run(async context => {
                const range = context.workbook.getSelectedRange();
                const cellFill = range.format.fill;
                cellFill.load('color');
                await context.sync();
                await testHelpers.sleep(2000);

                testHelpers.addTestResult(testValues, "fill-color", cellFill.color, "#FFFF00");
                await sendTestResults(testValues, port);
                testValues.pop();
                await testHelpers.closeWorkbook();
                resolve();
            });
        } catch {
            reject();
        }
    });
}