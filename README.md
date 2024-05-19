# SOFEWARE ENGINEERING ASSIGNMENT
## Decription:
This project is about working with ASP.NET Zero framework to build a part of the website to manage medical legal documents.
## Pre Requirements: 
- Visual Studio 2017 (v15.9.0+) (for backend ASP.NET Core application)
- Node.js 6.9+ with NPM 3.10+
- Yarn v1.x

## How to build?:
- Step 1: Download source code 
- Step 2: Open file __.Web.sln__ in the directory source\aspnet-core\
- Step 3: Check if the __Web.Host__ solution is the start up project or not. If not, set it as default start up project
- Step 4: Click __Build -> Build solution__
- Step 5: Open _Package mangage console_ window, set _.EntitiFrameworkCore_ as default project then input the instruction __Add-Migration “Added_Documents_Table”_
- Step 6: Input the instruction __Update-Database__
- Step 7: Open angular folder in Visual Studio Code or any IDE which you are using and run following instruction one by one:
__yarn__ 
__npm run create-dynamic-bundles__
- Step 8: Run _IIS_ in Visual Studio
- Step 9: In Visual Studio Code navigate into directory angular/nswag and run __./refresh.bat__
- Step 10: Return to angular folder then run __npm start__
- Step 11: Click the link in terminal to open the local website