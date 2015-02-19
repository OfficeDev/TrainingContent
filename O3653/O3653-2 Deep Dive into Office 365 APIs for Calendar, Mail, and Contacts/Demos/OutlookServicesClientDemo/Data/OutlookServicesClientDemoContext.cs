using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Web;
using OutlookServicesClientDemo.Models;

namespace OutlookServicesClientDemo.Data {

  public class OutlookServicesClientDemoContext : DbContext {
    public OutlookServicesClientDemoContext()
      : base("OutlookServicesClientDemoContext") { }

    //public DbSet<Tenant> Tenants { get; set; }
    //public DbSet<User> Users { get; set; }

    public DbSet<PerWebUserCache> PerUserCacheList { get; set; }

    protected override void OnModelCreating(DbModelBuilder modelBuilder) {
      modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
    }
  }
}