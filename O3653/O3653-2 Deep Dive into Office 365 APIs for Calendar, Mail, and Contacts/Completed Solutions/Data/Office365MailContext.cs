using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Web;
using Office365Mail.Models;

namespace Office365Mail.Data {

  public class Office365MailContext : DbContext {
    public Office365MailContext()
      : base("Office365MailContext") { }

    public DbSet<PerWebUserCache> PerUserCacheList { get; set; }

    protected override void OnModelCreating(DbModelBuilder modelBuilder) {
      modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
    }
  }
}