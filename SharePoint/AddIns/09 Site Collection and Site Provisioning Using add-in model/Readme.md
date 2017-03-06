# 6 - Site collection and site  provisioning with add-in model #

----------

SharePoint has always been about site provisioning. Before you can start collaborating or before you can start publishing content in publishing Intranet, you will need to provision a site collection and/or a sub site, apply the needed configuration and branding. Site provisioning really is the heart and soul of the customizations in the add-in model implementation and it can be customized in similar ways as with the classic farm solution based approach. We'll concentrate on the remote provisioning pattern and how you can use the add-in model to provision site collections and sub sites with the needed configurations. 

**Video**
- [PnP Add-In Transformation Training module 6: Site provisioning with add-in model](https://channel9.msdn.com/blogs/OfficeDevPnP/PnP-Add-In-Transformation-Training-module-6-Site-provisioning-with-add-in-model)

**Agenda**
- Site provisioning patterns - past, present and future
- Site provisioning with client side object model (CSOM)
- Hybrid models for site provisioning
- Updating existing site collections after initial creation


**Key recommendations**
- Do not use site or web templates 
- Use Remote Provisioning pattern
- Deploy artefacts without features
- Updates using Remote Management pattern


**Lab - Site Collection and Site Provisioning Using CAM**
In this lab you will create a self-service site collection creation experience for end users in cloud to provision new site collections.

- [Lab manual](Lab.md)

**Demos**
- [Site collection provisioning](https://github.com/OfficeDev/PnP/tree/master/Samples/Provisioning.Cloud.Async)
- [Sub site provisioning](https://github.com/OfficeDev/PnP/tree/master/Samples/Provisioning.SubSiteCreationApp)
- [Provision sites to on-premises from Azure](https://github.com/OfficeDev/PnP/tree/master/Samples/Provisioning.Hybrid.Simple)
  - *Notice that this one requires existing on-premises environment to be able to demonstrate it*

----------

*Notice that we will keep on updating this material based on your input and work being done in the [Office 365 Developer Patterns and Practices program](http://aka.ms/officedevpnp). You can provide us input directly using the [Office 365 Developer Patterns & Practices Yammer group](http://aka.ms/officedevpnpyammer)*

![Screenshot of the previous step](https://camo.githubusercontent.com/a732087ed949b0f2f84f5f02b8c79f1a9dd96f65/687474703a2f2f692e696d6775722e636f6d2f6c3031686876452e706e67)