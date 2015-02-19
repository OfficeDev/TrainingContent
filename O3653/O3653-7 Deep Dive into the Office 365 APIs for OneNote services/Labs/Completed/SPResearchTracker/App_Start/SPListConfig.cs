using SPResearchTracker.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace SPResearchTracker
{
	public class SPListConfig
	{
		public async Task ConfigureSharePoint()
		{
			SharePointListConfigurationRepository repository = new SharePointListConfigurationRepository();
			bool projectsListExists = await repository.ListExists(repository.ProjectsListName);
			bool referencesListExists = await repository.ListExists(repository.ReferencesListName);

			//Create the "Projects" list, if necessary
			if (!projectsListExists)
			{
				bool projectsListCreated = await repository.CreateList(repository.ProjectsListName, "100");
			}

			//Create the "References" list, if necessary
			if (!referencesListExists)
			{
				bool referencesListCreated = await repository.CreateList(repository.ReferencesListName, "103");

				//Add required fields to the list
				if (referencesListCreated)
				{
					bool projectNameFieldCreated = await repository.AddFieldToList(repository.ReferencesListName, "Project", "2");
				}
			}

			//cache the configuration
			repository.CacheConfigurations();
		}
	}
}