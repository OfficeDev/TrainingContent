using System.Web.Mvc;
using Microsoft.Practices.Unity;
using Unity.Mvc5;
using Files.Models;

namespace Files
{
    public static class UnityConfig
    {
        public static void RegisterComponents()
        {
			var container = new UnityContainer();
            
            container.RegisterType<IFileRepository, FileRepository>();
            //container.RegisterType<IFileRepository, OneDriveRepository>();
            DependencyResolver.SetResolver(new UnityDependencyResolver(container));
        }
    }
}