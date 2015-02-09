# 6 - Site collection and site  provisioning with app model #

----------

This module concentrates on site provisioning techniques using so called *remote provisioning pattern*. End user experience will be identical as with the classic xml based approaches, but the actual implementation will be based on app model capabilities for both new site collections and for sub sites. 

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

- [Lab manual](lab.md)

**Demos**
- [Site collection provisioning](https://github.com/OfficeDev/PnP/tree/master/Samples/Provisioning.Cloud.Async)
- [Sub site provisioning](https://github.com/OfficeDev/PnP/tree/master/Samples/Provisioning.SubSiteCreationApp)
- [Provision sites to on-premises from Azure](https://github.com/OfficeDev/PnP/tree/master/Samples/Provisioning.Hybrid.Simple)
  - *Notice that this one requires existing on-premises environment to be able to demonstrate it*

----------

*Notice that we will keep on updating this material based on your input and work being done in the [Office 365 Developer Patterns and Practices program](http://aka.ms/officedevpnp). You can provide us input directly using the [Office 365 Developer Patterns & Practices Yammer group](http://aka.ms/officedevpnpyammer)*

![](https://camo.githubusercontent.com/a732087ed949b0f2f84f5f02b8c79f1a9dd96f65/687474703a2f2f692e696d6775722e636f6d2f6c3031686876452e706e67)