# 8 - Using Enterprise Content Management Capabilities with add-in model #

----------

Module covers different patterns for enabling or implementation enterprise content management capabilities using the add-in model techniques. We cover the typical technical implementation for information management architecture and for other enterprise content management capabilities such as implementing governance processes for your deployment using add-in techniques.  

**Video**
- [PnP Add-In Transformation Training module 8: Using Enterprise Content Management Capabilities with add-in model](https://channel9.msdn.com/blogs/OfficeDevPnP/PnP-Add-In-Transformation-Training-module-8-Enterprise-Content-Management)

**Agenda**
- Content types and site columns
- Managed Metadata CSOM
- Library and list templates with add-in model
- Document management automation


**Key recommendations**
- Create elements using CSOM, no XML
- Taxonomy CSOM is extremely powerful 
- Stop using xml list templates
- Remote timer job based governance solutions

**Lab - Using Enterprise Content Management Capabilities with add-in model**
In first lab you will create custom cross site collection navigation based on the term configuration in taxonomy store. In second lab you will build a small taxonomy tool which can be used for creating and reading terms in the Office 365. You can use this kind of process to access your on-premises farm terms and then replicate them to the cloud.

- [Lab manual](Lab.md)

**Demos**
- [Creating site columns and content types using CSOM](https://github.com/OfficeDev/PnP/tree/master/Scenarios/ECM.DocumentLibraries)
- [Taxonomy CSOM](https://github.com/OfficeDev/PnP/tree/master/Samples/Core.MMS)
- [List templates with add-ins](https://github.com/OfficeDev/PnP/tree/master/Scenarios/ECM.DocumentLibraries)

----------

*Notice that we will keep on updating this material based on your input and work being done in the [Office 365 Developer Patterns and Practices program](http://aka.ms/officedevpnp). You can provide us input directly using the [Office 365 Developer Patterns & Practices Yammer group](http://aka.ms/officedevpnpyammer)*

![Screenshot of the previous step](https://camo.githubusercontent.com/a732087ed949b0f2f84f5f02b8c79f1a9dd96f65/687474703a2f2f692e696d6775722e636f6d2f6c3031686876452e706e67)