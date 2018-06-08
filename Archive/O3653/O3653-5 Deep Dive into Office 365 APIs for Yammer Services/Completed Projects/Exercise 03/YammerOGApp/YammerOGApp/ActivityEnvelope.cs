using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.IO;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;

namespace YammerOGApp
{
    [DataContract]
    public class ActivityEnvelope
    {

        public ActivityEnvelope()
        {
            Activity = new Activity();
        }


        [DataMember(Name = "activity")]
        public Activity Activity { get; set; }

        public string GetJSON()
        {
            MemoryStream ms = new MemoryStream();
            DataContractJsonSerializer s = new DataContractJsonSerializer(typeof(ActivityEnvelope));
            s.WriteObject(ms, this);
            ms.Position = 0;
            StreamReader sr = new StreamReader(ms);
            return sr.ReadToEnd();
        }
    }
    [DataContract(Name = "activity")]
    public class Activity
    {
        public Activity()
        {
            Actor = new Actor();
            Action = YammerOGApp.Action.create.ToString();
            OG_Object = new OG_Object();
            Message = string.Empty;
            users = new List<Actor>();
        }
        private List<Actor> users;

        [DataMember(Name = "actor")]
        public Actor Actor { get; set; }

        [DataMember(Name = "action")]
        public string Action { get; set; }

        [DataMember(Name = "object")]
        public OG_Object OG_Object { get; set; }

        [DataMember(Name = "message")]
        public string Message { get; set; }

        [DataMember(Name = "actors")]
        public Actor[] Users
        {
            get { return users.ToArray(); }
            set { users = value.ToList<Actor>(); }
        }

    }
    [DataContract(Name = "actor")]
    public class Actor
    {
        public Actor()
        {

            Name = string.Empty;
            Email = string.Empty;
        }

        [DataMember(Name = "name")]
        public string Name { get; set; }

        [DataMember(Name = "email")]
        public string Email { get; set; }
    }

    [DataContract(Name = "object")]
    public class OG_Object
    {

        public OG_Object()
        {
            Url = string.Empty;
            Title = string.Empty;
        }

        [DataMember(Name = "url")]
        public string Url { get; set; }

        [DataMember(Name = "title")]
        public string Title { get; set; }
    }
    public enum Action
    {
        create,
        update,
        delete,
        follow,
        like
    }

}