
## OneNote service API Windows Store Sample README

Created by Microsoft Corporation, 2014. Provided As-is without warranty. Trademarks mentioned here are the property of their owners.

### API functionality demonstrated in this sample

The following aspects of the API are covered in this sample. You can 
find additional documentation at the links below.

* [Log-in the user using the Live SDK](http://msdn.microsoft.com/EN-US/library/office/dn575435.aspx)
* [POST simple HTML to a new OneNote QuickNotes page](http://msdn.microsoft.com/EN-US/library/office/dn575428.aspx)
* [POST multi-part message with image data included in the request](http://msdn.microsoft.com/EN-US/library/office/dn575432.aspx)
* [POST page with a URL rendered as an image](http://msdn.microsoft.com/EN-US/library/office/dn575431.aspx)
* [POST page with a file attachment](http://msdn.microsoft.com/en-us/library/office/dn575436.aspx)
* [Extract the returned oneNoteClientURL and oneNoteWebURL links](http://msdn.microsoft.com/EN-US/library/office/dn575433.aspx)

### Prerequisites

**Tools and Libraries** you will need to download, install, and configure for your development environment. 

* [Visual Studio 2012 or 2013](http://www.visualstudio.com/en-us/downloads). 

**NuGet packages** used in the sample. These are handled using the package 
manager, as described in the setup instructions. These should update 
automatically at build time; if not, make sure your NuGet package manager 
is up-to-date. You can learn more about the packages we used at the links below.

* [Newtonsoft Json.NET package](http://newtonsoft.com/) provides Json parsing utilities.
* [Windows Live Connect SDK](https://github.com/liveservices/LiveSDK-for-Windows) provides the sign-in and authorization libraries

  
**Accounts**

* At a minimum, to run this sample, you'll need to have a 
[Microsoft account](https://signup.live.com/signup.aspx) 
so you can authenticate and get to the OneNote pages the app creates.
* Windows Store apps use a package identity to tie the app to your
[Developer account](http://msdn.microsoft.com/windows/apps/br211386). 
To run and modify this sample, you don't actually 
need to have a Microsoft Developer account, and instead 
you can use the built-in package identity. But, when you publish your own app,
even when it's derived from this one, you'll need to get your own [developer account
and package identity](http://msdnstage.redmond.corp.microsoft.com/EN-US/library/office/dn575426.aspx).

### Using the sample

After you've setup your development tools, and installed the prerequisites listed above,...

1. Download the repo as a ZIP file to your local computer, and extract the files. Or, clone the repository into a local copy of Git.
2. Open the project in Visual Studio.
3. Build and run the app (F5).

   (If your copy of NuGet is up-to-date, it should automatically 
update the packages. If you get package-not-found errors, update NuGet and rebuild, and that 
should fix it.)

4. Sign in to your Microsoft account in the running app.
5. Allow the app to create new pages in OneNote.

### Version Info

This is the initial public release for this code sample.
  
### Learning More

* Visit the [dev.onenote.com](http://dev.onenote.com) Dev Center
* Contact us on [StackOverflow (tagged OneNote)](http://go.microsoft.com/fwlink/?LinkID=390182)
* Follow us on [Twitter @onenotedev](http://www.twitter.com/onenotedev)
* Read our [OneNote Developer blog](http://go.microsoft.com/fwlink/?LinkID=390183)
* Explore the API using the [apigee.com interactive console](http://go.microsoft.com/fwlink/?LinkID=392871).
Also, see the [short overview/tutorial](http://go.microsoft.com/fwlink/?LinkID=390179). 
* [API Reference](http://msdn.microsoft.com/en-us/library/office/dn575437.aspx) documentation
* [Debugging / Troubleshooting](http://msdn.microsoft.com/EN-US/library/office/dn575430.aspx)
* [Getting Started](http://go.microsoft.com/fwlink/?LinkID=331026) with the OneNote service API

  
