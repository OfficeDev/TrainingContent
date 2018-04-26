using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Connectors.Common.Card.Formatting.ObjectModel;

namespace GithubTest
{
    class ModelBuilder
    {
        private GithubIssueEvent GithubIssueEvent = null;
        public ModelBuilder(GithubIssueEvent gitEvent)
        {
            this.GithubIssueEvent = gitEvent;
        }
        public string GetActivityText()
        {

            string formmatString = "has opened issue {0} in {1}.";

            return string.Format(
                    formmatString,
                    this.GithubIssueEvent.Issue.Id,
                    this.GithubIssueEvent.Repository.Name);
        }

        public SwiftFact[] BuildFacts()
        {
            SwiftFact[] facts = new SwiftFact[]
            {
                new SwiftFact() 
                { 
                    Name = "Issue", 
                    Value = this.GithubIssueEvent.Issue.Id
                },

                new SwiftFact() 
                { 
                    Name = "Title", 
                    Value = this.GithubIssueEvent.Issue.Title,
                },

                new SwiftFact() 
                { 
                    Name = "Created at", 
                    Value = this.GithubIssueEvent.Issue.CreatedAt.ToString(),
                },
            };

            return facts;
        }

        public string BuildSubject()
        {
            string subject = string.Format(
                "{0} has opened an issue",
                this.GithubIssueEvent.Sender.Login);

            return subject;
        }

        public SwiftSection[] BuildSections()
        {
            return new SwiftSection[] 
            {
                new SwiftSection() 
                {
                    ActivityImage = this.GithubIssueEvent.Sender.AvatarUrl,
                    ActivityTitle = this.GithubIssueEvent.Sender.Login,
                    ActivityText = this.GetActivityText(),
                    Facts = this.BuildFacts()
                }
            };
        }

        public SwiftPotentialAction[] BuildActions()
        {
            return new SwiftPotentialAction[]
            {
                new SwiftPotentialAction()
                {
                    Type = "OpenUri",
                    Name = "View in Github",
                    Targets = new SwiftTarget[] { new SwiftTarget() {
                        OS = "default",
                        URI = this.BuildUrl()
                    } }
                }
            };
        }

        public string BuildUrl()
        {
            return this.GithubIssueEvent.Issue.HtmlUrl;
        }
    }
}
