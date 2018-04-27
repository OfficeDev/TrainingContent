using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace GithubTest
{
    class GithubIssueEvent
    {
        /// <summary>
        /// Gets or sets action
        /// </summary>
        [JsonProperty(PropertyName = "action", Required = Required.Always)]
        public string Action { get; set; }

        /// <summary>
        /// Gets or sets issue
        /// </summary>
        [JsonProperty(PropertyName = "issue", Required = Required.Always)]
        public GitHubIssue Issue { get; set; }

        /// <summary>
        /// Gets or sets sender
        /// </summary>
        [JsonProperty(PropertyName = "sender", Required = Required.Always)]
        public GitHubUser Sender
        {
            get;
            set;
        }

        /// <summary>
        /// Gets or set repository
        /// </summary>
        [JsonProperty(PropertyName = "repository", Required = Required.Always)]
        public GitHubRepository Repository
        {
            get;
            set;
        }
    }

    public class GitHubIssue
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        /// <summary>
        /// Gets or sets URL
        /// </summary>
        [JsonProperty(PropertyName = "url")]
        public string Url { get; set; }

        /// <summary>
        /// Gets or sets HTML URL
        /// </summary>
        [JsonProperty(PropertyName = "html_url")]
        public string HtmlUrl { get; set; }

        /// <summary>
        /// Initializes a new instance of the GitHubIssue class
        /// </summary>
        public GitHubIssue()
        {
        }

        /// <summary>
        /// Gets or sets title
        /// </summary>
        [JsonProperty(PropertyName = "title", Required = Required.Always)]
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets body
        /// </summary>
        [JsonProperty(PropertyName = "body")]
        public string Body { get; set; }

        /// <summary>
        /// Gets or sets state
        /// </summary>
        [JsonProperty(PropertyName = "state")]
        public string State { get; set; }

        /// <summary>
        /// Gets or sets created at 
        /// </summary>
        [JsonProperty(PropertyName = "created_at")]
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// Gets or sets updated at
        /// </summary>
        [JsonProperty(PropertyName = "updated_at")]
        public DateTime UpdatedAt { get; set; }

        /// <summary>
        /// Gets or sets closed at 
        /// </summary>
        [JsonProperty(PropertyName = "closed_at")]
        public DateTime? ClosedAt { get; set; }
    }

    public class GitHubUser 
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        /// <summary>
        /// Gets or sets URL
        /// </summary>
        [JsonProperty(PropertyName = "url")]
        public string Url { get; set; }

        /// <summary>
        /// Gets or sets HTML URL
        /// </summary>
        [JsonProperty(PropertyName = "html_url")]
        public string HtmlUrl { get; set; }

        /// <summary>
        /// Initializes a new instance of the GitHubUser class
        /// </summary>
        public GitHubUser()
        {
        }

        /// <summary>
        /// Gets or sets the login
        /// </summary>
        [JsonProperty(PropertyName = "login", Required = Required.Always)]
        public string Login { get; set; }

        /// <summary>
        /// Gets or sets the avatar url
        /// </summary>
        [JsonProperty(PropertyName = "avatar_url", Required = Required.Always)]
        public string AvatarUrl { get; set; }
    }

    public class GitHubRepository
    {
                /// <summary>
        /// Initializes a new instance of the GitHubRepository class
        /// </summary>
        public GitHubRepository()
        {
        }

        /// <summary>
        /// Gets or sets name
        /// </summary>
        [JsonProperty(PropertyName = "name", Required = Required.Always)]
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets full name
        /// </summary>
        [JsonProperty(PropertyName = "full_name")]
        public string FullName { get; set; }
    }
}
