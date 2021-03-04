/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global Excel, Office, OfficeExtension, Word */

export function writeDataToOfficeDocument(result) {
  return new Promise(function(resolve, reject) {
    try {
      switch (Office.context.host) {
        case Office.HostType.Excel:
          writeDataToExcel(result);
          break;
        case Office.HostType.Outlook:
          writeDataToOutlook(result);
          break;
        case Office.HostType.PowerPoint:
          writeDataToPowerPoint(result);
          break;
        case Office.HostType.Word:
          writeDataToWord(result);
          break;
        default:
          throw "Unsupported Office host application: This add-in only runs on Excel, Outlook, PowerPoint, or Word.";
      }
      resolve();
    } catch (error) {
      reject(Error("Unable to write data to document. " + error.toString()));
    }
  });
}

function filterUserProfileInfo(result) {
  let userProfileInfo = [];
  userProfileInfo.push(result["displayName"]);
  userProfileInfo.push(result["jobTitle"]);
  userProfileInfo.push(result["mail"]);
  userProfileInfo.push(result["mobilePhone"]);
  userProfileInfo.push(result["officeLocation"]);
  return userProfileInfo;
}

function writeDataToExcel(result) {
  return Excel.run(function(context) {
    const sheet = context.workbook.worksheets.getActiveWorksheet();

    const rangeHeading = sheet.getRange("A1:D1");
    rangeHeading.values = [["Received Date/Time", "Subject", "Read?", "ID"]];

    // convert data to a list
    const mailResults = result.value;
    for (let i = 0; i < mailResults.length; i++) {
      if (mailResults[i] !== null) {
        let innerArray = [];
        innerArray.push(mailResults[i].receivedDateTime);
        innerArray.push(mailResults[i].subject);
        innerArray.push(mailResults[i].isRead);
        innerArray.push(mailResults[i].id);

        let data = [];
        data.push(innerArray);
        let rangeData = sheet.getRange(`A${i+2}:D${i+2}`);
        rangeData.values = data;
      }
    }

    rangeHeading.format.autofitColumns();

    return context.sync();
  });
}

function writeDataToOutlook(result) {
  let data = [];
  let userProfileInfo = filterUserProfileInfo(result);

  for (let i = 0; i < userProfileInfo.length; i++) {
    if (userProfileInfo[i] !== null) {
      data.push(userProfileInfo[i]);
    }
  }

  let userInfo = "";
  for (let i = 0; i < data.length; i++) {
    userInfo += data[i] + "\n";
  }

  Office.context.mailbox.item.body.setSelectedDataAsync(userInfo, { coercionType: Office.CoercionType.Html });
}

function writeDataToPowerPoint(result) {
  let data = [];
  let userProfileInfo = filterUserProfileInfo(result);

  for (let i = 0; i < userProfileInfo.length; i++) {
    if (userProfileInfo[i] !== null) {
      data.push(userProfileInfo[i]);
    }
  }

  let userInfo = "";
  for (let i = 0; i < data.length; i++) {
    userInfo += data[i] + "\n";
  }
  Office.context.document.setSelectedDataAsync(userInfo, function(asyncResult) {
    if (asyncResult.status === Office.AsyncResultStatus.Failed) {
      throw asyncResult.error.message;
    }
  });
}

function writeDataToWord(result) {
  return Word.run(function(context) {
    let data = [];
    let userProfileInfo = filterUserProfileInfo(result);

    for (let i = 0; i < userProfileInfo.length; i++) {
      if (userProfileInfo[i] !== null) {
        data.push(userProfileInfo[i]);
      }
    }

    const documentBody = context.document.body;
    for (let i = 0; i < data.length; i++) {
      if (data[i] !== null) {
        documentBody.insertParagraph(data[i], "End");
      }
    }
    return context.sync();
  });
}
