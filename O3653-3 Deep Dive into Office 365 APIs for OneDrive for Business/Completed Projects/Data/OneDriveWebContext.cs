using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Web;
using OneDriveWeb.Models;

namespace OneDriveWeb.Data {

  public class OneDriveWebContext : DbContext {
    public OneDriveWebContext()
      : base("OneDriveWebContext") { }

    //public DbSet<Tenant> Tenants { get; set; }
    //public DbSet<User> Users { get; set; }

    public DbSet<PerWebUserCache> PerUserCacheList { get; set; }

    protected override void OnModelCreating(DbModelBuilder modelBuilder) {
      modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
    }
  }
}