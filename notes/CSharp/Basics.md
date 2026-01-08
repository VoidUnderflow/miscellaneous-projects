**Creating a project:**
`dotnet new list` = all available things we can create;
`dotnet new sln` = create Solution;
`dotnet new webapi -n API -controllers` = create a new api named "API" using the classic MVC;
`dotnet new classlib -n Domain` = creates a new class library named "Domain"; 
`dotnet sln add Domain` = adds the classlib to the Solution;
++ adding references to the classlibs from the API and other classlibs (manual);

`Microsoft.EntityFrameworkCore.DbContext` = session with the DB, used to query + save instances of entities; Is a combination of `Unit of Work` and `Repository` patterns; 
Add with NuGet -> Ctrl + Shift + \` => select classlib to add it to;

Installing Entity Framework Core: https://www.nuget.org/packages/dotnet-ef
Initial migration: `dotnet ef migrations add InitialCreate -p .\Persistence\ -s API`
Creating the DB:  `dotnet ef database update -p Persistence -s API`
