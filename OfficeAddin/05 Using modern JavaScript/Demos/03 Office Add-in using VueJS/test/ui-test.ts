import * as assert from "assert";
import * as mocha from "mocha";
import { AppType, startDebugging, stopDebugging } from "office-addin-debugging";
import * as officeAddinTestHelpers from "office-addin-test-helpers";
import * as officeAddinTestServer from "office-addin-test-server";
import * as path from "path";
import * as testHelpers from "./src/test-helpers";
const hosts = ["Excel", "Word"];
const manifestPath = path.resolve(`${process.cwd()}/test/test-manifest.xml`);
const testServerPort: number = 4201;

hosts.forEach(function (host) {
    const testServer = new officeAddinTestServer.TestServer(testServerPort);
    let testValues: any = [];

    describe(`Test ${host} Task Pane Project`, function () {
        before(`Setup test environment and sideload ${host}`, async function () {
            this.timeout(0);
            // Start test server and ping to ensure it's started
            const testServerStarted = await testServer.startTestServer(true /* mochaTest */);
            const serverResponse = await officeAddinTestHelpers.pingTestServer(testServerPort);
            assert.equal(testServerStarted, true);
            assert.equal(serverResponse["status"], 200);

            // Call startDebugging to start dev-server and sideload
            const devServerCmd = `npm run dev-server -- --config ./test/webpack.config.js `;
            const sideloadCmd = `node ./node_modules/office-toolbox/app/office-toolbox.js sideload -m ${manifestPath} -a ${host}`;
            await startDebugging(manifestPath, AppType.Desktop, undefined, undefined, devServerCmd, undefined,
                undefined, undefined, undefined, sideloadCmd);
        }),
        describe(`Get test results for ${host} taskpane project`, function () {
            it("Validate expected result count", async function () {
                this.timeout(0);
                testValues = await testServer.getTestResults();
                assert.equal(testValues.length > 0, true);
            });
            it("Validate expected result name", async function () {
                assert.equal(testValues[0].resultName, host.toLowerCase() === "excel" ? "fill-color" : "output-message");
            });
            it("Validate expected result", async function () {
                assert.equal(testValues[0].resultValue, testValues[0].expectedValue);
            });
        });
        after(`Teardown test environment and shutdown ${host}`, async function () {
            this.timeout(0);
            // Stop the test server
            const stopTestServer = await testServer.stopTestServer();
            assert.equal(stopTestServer, true);

            // Unregister the add-in
            const unregisterCmd = `node ./node_modules/office-toolbox/app/office-toolbox.js remove -m ${manifestPath} -a ${host}`;
            await stopDebugging(manifestPath, unregisterCmd);

            // Close desktop application for all apps but Excel, which has it's own closeWorkbook API
            if (host != 'Excel') {
                const applicationClosed = await testHelpers.closeDesktopApplication(host);
                assert.equal(applicationClosed, true);
            }
        });
    });
});