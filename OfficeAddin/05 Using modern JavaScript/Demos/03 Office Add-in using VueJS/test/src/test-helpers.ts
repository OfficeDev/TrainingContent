import * as childProcess from "child_process";
import * as cps from "current-processes";

export async function closeDesktopApplication(application: string): Promise<boolean> {
    return new Promise<boolean>(async function (resolve, reject) {
        let processName: string = "";
        switch (application.toLowerCase()) {
            case "excel":
                processName = "Excel";
                break;
            case "powerpoint":
                processName = (process.platform === "win32") ? "Powerpnt" : "Powerpoint";
                break;
            case "onenote":
                processName = "Onenote";
                break;
            case "outlook":
                processName = "Outlook";
                break;
            case "project":
                processName = "Project";
                break;
            case "word":
                processName = (process.platform === "win32") ? "Winword" : "Word";
                break;
            default:
                reject(`${application} is not a valid Office desktop application.`);
        }

        try {
            let appClosed: boolean = false;
            if (process.platform == "win32") {
                const cmdLine = `tskill ${processName}`;
                appClosed = await executeCommandLine(cmdLine);
            } else {
                const pid = await getProcessId(processName);
                if (pid != undefined) {
                    process.kill(pid);
                    appClosed = true;
                } else {
                    resolve(false);
                }
            }
            resolve(appClosed);
        } catch (err) {
            reject(`Unable to kill ${application} process. ${err}`);
        }
    });
}

export async function closeWorkbook(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
        try {
            await Excel.run(async context => {
                // @ts-ignore
                context.workbook.close(Excel.CloseBehavior.skipSave);
                resolve();
            });
        } catch {
            reject();
        }
    });
}

export function addTestResult(testValues: any[], resultName: string, resultValue: any, expectedValue: any) {
    var data = {};
    data["expectedValue"] = expectedValue;
    data["resultName"] = resultName;
    data["resultValue"] = resultValue;
    testValues.push(data);
}

export async function sleep(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getProcessId(processName: string): Promise<number> {
    return new Promise<number>(async function (resolve, reject) {
        cps.get(function (err: Error, processes: any) {
            try {
                const processArray = processes.filter(function (p: any) {
                    return (p.name.indexOf(processName) > 0);
                });
                resolve(processArray.length > 0 ? processArray[0].pid : undefined);
            }
            catch (err) {
                reject(err);
            }
        });
    });
}

async function executeCommandLine(cmdLine: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        childProcess.exec(cmdLine, (error) => {
            if (error) {
                reject(false);
            } else {
                resolve(true);
            }
        });
    });
}