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
			
#if MYFILES
			container.RegisterType<IFileRepository, FileRepository>();
#endif
#if ONEDRIVE
			container.RegisterType<IFileRepository, OneDriveRepository>();
#endif
			DependencyResolver.SetResolver(new UnityDependencyResolver(container));
		}
	}
}