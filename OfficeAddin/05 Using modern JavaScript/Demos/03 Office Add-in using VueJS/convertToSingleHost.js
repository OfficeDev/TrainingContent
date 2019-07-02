const convertTest = process.argv[3] === "convert-test";
const fs = require("fs");
const host = process.argv[2];
const hosts = ["excel", "onenote", "outlook", "powerpoint", "project", "word"];
const path = require("path");
const util = require("util");
const testPackages = ["@types/mocha", "@types/node", "current-processes", "mocha", "office-addin-test-helpers",
  "office-addin-test-server", "ts-node"];
const readFileAsync = util.promisify(fs.readFile);
const unlinkFileAsync = util.promisify(fs.unlink);
const writeFileAsync = util.promisify(fs.writeFile);

async function modifyProjectForSingleHost(host) {
  if (!host) {
    throw new Error("The host was not provided.");
  }
  if (!hosts.includes(host)) {
    throw new Error(`'${host}' is not a supported host.`);
  }
  await convertProjectToSingleHost(host);
  await updatePackageJsonForSingleHost(host);
  if (!convertTest) {
    await updateLaunchJsonFile();
  }
}

async function convertProjectToSingleHost(host) {
  // copy host-specific manifest over manifest.xml
  const manifestContent = await readFileAsync(`./manifest.${host}.xml`, "utf8");
  await writeFileAsync(`./manifest.xml`, manifestContent);

  // copy over host-specific taskpane code to taskpane.ts
  const srcContent = await readFileAsync(`./src/taskpane/${host}.ts`, "utf8");
  await writeFileAsync(`./src/taskpane/taskpane.ts`, srcContent);

  // delete all test files by default for now - eventually we want to convert the tests by default
  if (convertTest && (host === "excel" || host === "word")) {
    // copy over host-specific taskpane test code to test-taskpane.ts
    const testTaskpaneContent = await readFileAsync(`./test/src/${host}-test-taskpane.ts`, "utf8");
    const updatedTestTaskpaneContent = testTaskpaneContent.replace(`../../src/taskpane/${host}`, `../../src/taskpane/taskpane`);
    await writeFileAsync(`./test/src/test-taskpane.ts`, updatedTestTaskpaneContent);

    // update ui-test.ts to only run against specified host
    const testContent = await readFileAsync(`./test/ui-test.ts`, "utf8");
    const updatedTestContent = testContent.replace(`const hosts = ["Excel", "Word"]`, `const hosts = ["${host}"]`);
    await writeFileAsync(`./test/ui-test.ts`, updatedTestContent);

    // delete all host-specific test files after converting to single host
    hosts.forEach(async function (host) {
      if (host == "excel" || host == "word") {
        await unlinkFileAsync(`./test/src/${host}-test-taskpane.ts`);
      }
    });
  }
  else {
    deleteFolder(path.resolve(`${process.cwd()}/test`));
  }

  // delete all host-specific files
  hosts.forEach(async function (host) {
    await unlinkFileAsync(`./manifest.${host}.xml`);
    await unlinkFileAsync(`./src/taskpane/${host}.ts`);
  });

  // delete this script
  await unlinkFileAsync("./convertToSingleHost.js");
}

async function updatePackageJsonForSingleHost(host) {
  // update package.json to reflect selected host
  const packageJson = `./package.json`;
  const data = await readFileAsync(packageJson, "utf8");
  let content = JSON.parse(data);

  // update 'config' section in package.json to use selected host
  content.config["app-to-debug"] = host;

  // update sideload and unload scripts to use selected host.
  ["sideload", "unload"].forEach(key => {
    content.scripts[key] = content.scripts[`${key}:${host}`];
  });

  // remove scripts that are unrelated to the selected host
  Object.keys(content.scripts).forEach(function (key) {
    if (key.startsWith("sideload:")
      || key.startsWith("unload:")
      || key === "convert-to-single-host"
    ) {
      delete content.scripts[key];
    }
  });

  if (!convertTest) {
    // remove test-related scripts
    Object.keys(content.scripts).forEach(function (key) {
      if (key.includes("test")) {
        delete content.scripts[key];
      }
    });

    // remove test-related packages
    Object.keys(content.devDependencies).forEach(function (key) {
      if (testPackages.includes(key)) {
        delete content.devDependencies[key]
      }
    });
  }

  // write updated json to file
  await writeFileAsync(packageJson, JSON.stringify(content, null, 2));
}

async function updateLaunchJsonFile() {
  // remove 'Debug Tests' configuration from launch.json
  const launchJson = `.vscode/launch.json`;
  const launchJsonContent = await readFileAsync(launchJson, "utf8");
  const regex = /"configurations": \[\r?\n(.*{(.*\r?\n)*?.*"name": "Debug Tests",\r?\n(.*\r?\n)*?.*},)/gm;
  const updatedContent = launchJsonContent.replace(regex, `"configurations": [`);
  await writeFileAsync(launchJson, updatedContent);
}

function deleteFolder(folder) {
  try {
    if (fs.existsSync(folder)) {
      fs.readdirSync(folder).forEach(function (file, index) {
        const curPath = `${folder}/${file}`;

        if (fs.lstatSync(curPath).isDirectory()) {
          deleteFolder(curPath);
        }
        else {
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(folder);
    }
  } catch (err) {
    throw new Error(`Unable to delete folder "${folder}".\n${err}`);
  }
}

/**
 * Modify the project so that it only supports a single host.
 * @param host The host to support.
 */
modifyProjectForSingleHost(host).catch(err => {
  console.error(`Error: ${err instanceof Error ? err.message : err}`);
  process.exitCode = 1;
});
