# 10 - Transformation guidance from farm solutions to add-in model #

----------

This module concentrates on the actual transformation process and covers more detailed different techniques which you can take while transforming existing farm solutions to add-in model implementations. We also cover recommendations around farm solutions, which will help you to perform transition in the future. These farm solution principles can be used for new farm solutions to help the future add-in model transition, if you still need to develop farm solutions in on-premises. 

**Video**
- [PnP Add-in Transformation Training Module 10: Transformation guidance from farm solutions to add-in model](https://channel9.msdn.com/blogs/OfficeDevPnP/PnP-Add-in-Transformation-Training-Module-10-Transformation-Guideance-from-Farm-Solutions)

**Agenda**
- Transformation process
- Transformation approaches
- Element Replacement approaches
- Farm solution considerations

**Key recommendations**
- Make sure that you have detailed inventory of your customizations
- Use analyses tooling for technical analyses
- Transform end user experience, not code - it's not one to one code analyses
- Understand impact of farm solutions

**Lab 1 - Replacement of files provisioned via Modules in farm solutions**
In this lab you will learn how to replace existing master pages and page layouts which have been deployed to an On-Premises SharePoint Server via Modules in a Full Trust Solution. This will involve deploying new files to replace those deployed via Modules and updating the existing usages of these files to remove the dependency on the files which were deployed via declarative means.

- [Lab manual](10-1 Replacement of files deployed via Modules/Lab.md)

**Lab 2 - Replacement of lists provisioned from list templates in farm solutions**
In this lab you will learn how to detect existing lists and libraries, which have been created from a custom list template deployed into an On-Premises SharePoint Server in a Full Trust Solution. This will involve creating new lists to replace those, configuring them appropriately then transferring the existing content from the original list.

- [Lab manual](10-2 Replacing Lists Created from Custom Templates/Lab.md)

**Lab 3 - Content Type and Site columns replacements**
In this lab you will learn how to replace existing content types by deploying new content types and updating the content to the new content type with new site columns using remote provisioning.

- [Lab manual](10-3 Content Type and Site columns replacements/Lab.md)

**Lab 4 - Replacement of web parts with add-in parts**
In this lab you will learn how to replace existing web parts by deploying a SharePoint Provider hosted add-in and updating the content to use an add-in Part hosted in the Provider hosted add-in in place of Web Parts using Full Trust Code.

- [Lab manual](10-4 Web Part Replacement Using CAM/Lab.md)

**Demos**
- SPCAF tooling in practice - Demonstration of free SPCAF tool for app model inventory
- [App pre-register and side loading](https://github.com/OfficeDev/PnP/tree/dev/Samples/Core.SideLoading)

----------

*Notice that we will keep on updating this material based on your input and work being done in the [Office 365 Developer Patterns and Practices program](http://aka.ms/officedevpnp). You can provide us input directly using the [Office 365 Developer Patterns & Practices Yammer group](http://aka.ms/officedevpnpyammer)*

![Screenshot of the previous step](https://camo.githubusercontent.com/a732087ed949b0f2f84f5f02b8c79f1a9dd96f65/687474703a2f2f692e696d6775722e636f6d2f6c3031686876452e706e67)