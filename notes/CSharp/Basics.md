Creating a project:
`dotnet new list` = all available things we can create;
`dotnet new sln` = create Solution;
`dotnet new webapi -n API -controllers` = create a new api named "API" using the classic MVC;
`dotnet new classlib -n Domain` = creates a new class library named "Domain"; 
`dotnet sln add Domain` = adds the classlib to the Solution;
++ adding references to the classlibs from the API and other classlibs (manual);