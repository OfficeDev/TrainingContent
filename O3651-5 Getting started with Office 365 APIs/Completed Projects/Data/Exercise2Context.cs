using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Web;
using Exercise2.Models;

namespace Exercise2.Data {

  public class Exercise2Context : DbContext {
    public Exercise2Context()
      : base("Exercise2Context") { }

    //public DbSet<Tenant> Tenants { get; set; }
    //public DbSet<User> Users { get; set; }

    public DbSet<PerWebUserCache> PerUserCacheList { get; set; }

    protected override void OnModelCreating(DbModelBuilder modelBuilder) {
      modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
    }
  }
}