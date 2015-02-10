# 5 - Remote timer jobs and event receivers #

----------

Introduction to remote event receivers and remote timer jobs. Remove event receivers can be associated to app web or host webs to enable external web service calls for typical event receiver events. 

Remote timer jobs can be used to replace typical timer job implementations as scheduled tasks. You can also create on-demand remote timer jobs which are highly helpful for creating asynchronous processes initiated by end users.  

**Agenda**
- Introduction to remote event receivers and remote timer jobs
- Remote timer jobs
- Remote event receivers
- App events


**Key recommendations**
- Remote timer jobs for scheduled tasks 
- You can use WebJobs also for async tasks
- Remote event receivers is not for synchronization tasks
- Avoid long operations in app events

**Lab - Using Remote Event Receivers and Remote Timer Jobs**
In this lab you will create a remote event receiver and associate it to the host web to execute code during end user events and build a simple remote timer job.

- [Lab manual](lab.md)

**Demos**
- [Remote timer job](https://github.com/OfficeDev/PnP/tree/master/Samples/Core.SimpleTimerJob)
- [Remote event receivers](https://github.com/OfficeDev/PnP/tree/master/Samples/Core.EventReceivers)
- [Debugging app events - Demonstration on using service bus for enabling debugging with app events

----------

*Notice that we will keep on updating this material based on your input and work being done in the [Office 365 Developer Patterns and Practices program](http://aka.ms/officedevpnp). You can provide us input directly using the [Office 365 Developer Patterns & Practices Yammer group](http://aka.ms/officedevpnpyammer)*

![](https://camo.githubusercontent.com/a732087ed949b0f2f84f5f02b8c79f1a9dd96f65/687474703a2f2f692e696d6775722e636f6d2f6c3031686876452e706e67)