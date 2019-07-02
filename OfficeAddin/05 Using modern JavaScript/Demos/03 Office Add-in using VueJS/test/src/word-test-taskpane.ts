import { pingTestServer, sendTestResults } from "office-addin-test-helpers";
import { run } from "../../src/taskpane/word";
import * as testHelpers from "./test-helpers";
const port: number = 4201;
let testValues: any = [];

Office.onReady(async(info) => {
    if (info.host === Office.HostType.Word) {
        const testServerResponse: object = await pingTestServer(port);
        if (testServerResponse["status"] == 200) {
            await runTest();
        }  
    }
});

export async function runTest() {
    return new Promise<void>(async (resolve, reject) => {
        try {
            // Execute taskpane code
            await run();
            await testHelpers.sleep(2000);

            // Get output of executed taskpane code
            Word.run(async (context) => {
                var firstParagraph = context.document.body.paragraphs.getFirst();
                firstParagraph.load("text");
                await context.sync();
                await testHelpers.sleep(2000);

                testHelpers.addTestResult(testValues, "output-message", firstParagraph.text, "Hello World");
                await sendTestResults(testValues, port);
                testValues.pop();
                resolve();
            });
        } catch {
            reject();
        }
    });
}