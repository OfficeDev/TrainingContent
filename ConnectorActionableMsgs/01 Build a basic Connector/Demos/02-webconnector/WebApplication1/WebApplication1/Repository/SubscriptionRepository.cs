using System.Collections.Generic;
using WebApplication1.Models;

namespace WebApplication1.Repository
{
    public class SubscriptionRepository
    {
        public static List<Subscription> Subscriptions { get; set; } = new List<Subscription>();
    }
}