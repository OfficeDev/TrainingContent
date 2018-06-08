# 5 - Using Remote Event Receivers and Remote Timer Jobs #

----------

This module covers two very important topics for the add-in model development, which are remote event receivers and remote timer jobs. We cover both of the topics one by one and explain the different characteristics of both. Remote timer jobs can be used to replace classic event receivers in some level and the remote timer job pattern shows how to implement scheduled or on-demand asynchronous operations using the add-in model.   

**Video**
- [PnP Add-In Transformation Training module 5: Using Remote Event Receivers and Remote Timer Jobs](https://channel9.msdn.com/blogs/OfficeDevPnP/PnP-Add-In-Transformation-Training-module-5-Remote-timer-events)

**Agenda**
- Introduction to remote event receivers and remote timer jobs
- Remote timer jobs
- Remote event receivers
- Add-in events


**Key recommendations**
- Remote timer jobs for scheduled tasks 
- You can use WebJobs also for async tasks
- Remote event receivers is not for synchronization tasks
- Avoid long operations in add-in events

**Lab - Using Remote Event Receivers and Remote Timer Jobs**
In this lab you will create a remote event receiver and associate it to the host web to execute code during end user events and build a simple remote timer job.

- [Lab manual](Lab.md)

**Demos**
- [Remote timer job](https://github.com/OfficeDev/PnP/tree/master/Samples/Core.SimpleTimerJob)
- [Remote event receivers](https://github.com/OfficeDev/PnP/tree/master/Samples/Core.EventReceivers)
- [Debugging add-in events - Demonstration on using service bus for enabling debugging with add-in events

----------

*Notice that we will keep on updating this material based on your input and work being done in the [Office 365 Developer Patterns and Practices program](http://aka.ms/officedevpnp). You can provide us input directly using the [Office 365 Developer Patterns & Practices Yammer group](http://aka.ms/officedevpnpyammer)*

![Screenshot of the previous step](https://camo.githubusercontent.com/a732087ed949b0f2f84f5f02b8c79f1a9dd96f65/687474703a2f2f692e696d6775722e636f6d2f6c3031686876452e706e67)