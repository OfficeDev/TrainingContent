# Office Add-ins: Building Office Add-ins for Word

In this demo, you will demonstrate how a Word Add-in can manipulate text, paragraph, and formatting of a document.

## Running the project

The finished solution is provided in this folder to simplify demonstrations. If you want to run a finished project, clone the repository, run **npm install** (from the solution folder directory), then **npm run start** and follow one of these methods to sideload and test the Office Add-in.

* Windows: [Sideload Office Add-ins on Windows](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/create-a-network-shared-folder-catalog-for-task-pane-and-content-add-ins)
* Word Online: [Sideload Office Add-ins in Office Online](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/sideload-office-add-ins-for-testing#sideload-an-office-add-in-on-office-online)
* iPad and Mac: [Sideload Office Add-ins on iPad and Mac](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/sideload-an-office-add-in-on-ipad-and-mac)

## Demo steps

1. On the **Home** menu of Word, select **Show Taskpane**.

1. In the taskpane, select **Insert Paragraph**.

1. Make a change in the paragraph.

1. Select **Insert Paragraph** again. Note that the new paragraph is above the previous one because the insertParagraph method is inserting at the "start" of the document's body.

1. Be sure there are at least three paragraphs in the document. You can select **Insert Paragraph** three times. *Check carefully that there's no blank paragraph at the end of the document. If there is, delete it.*

1. In Word, create a custom style named "MyCustomStyle". It can have any formatting that you want.

1. Select the **Apply Style** button. The first paragraph will be styled with the built-in style Intense Reference.

1. Select the **Apply Custom Style** button. The last paragraph will be styled with your custom style. (If nothing seems to happen, the last paragraph might be blank. If so, add some text to it.)

1. Select the **Change Font** button. The font of the second paragraph changes to 18 pt., bold, Courier New.

1. Select some text. Selecting the phrase "Click-to-Run" will make the most sense. *Be careful not to include the preceding or following space in the selection.*

1. Select the **Insert Abbreviation** button. Note that " (C2R)" is added. Note also that at the bottom of the document a new paragraph is added with the entire expanded text because the new string was added to the existing range.

1. Select some text. Selecting the phrase "Office 365" will make the most sense. *Be careful not to include the preceding or following space in the selection.*

1. Select the **Add Version** Info button. Note that "Office 2019, " is inserted between "Office 2016" and "Office 365". Note also that at the bottom of the document a new paragraph is added but it contains only the originally selected text because the new string became a new range rather than being added to the original range.

1. Select some text. Selecting the word "several" will make the most sense. *Be careful not to include the preceding or following space in the selection.*

1. Select the **Change Quantity Term** button. Note that "many" replaces the selected text.