using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using UnifiedApiApp.Models;

namespace UnifiedApiApp.Data {
  public class TokenCacheDataContext : DbContext{
    public TokenCacheDataContext()
      : base("TokenCacheDataContext") { }

    public DbSet<PerUserWebCache> PerUserCacheList { get; set; }

    protected override void OnModelCreating(DbModelBuilder modelBuilder) {
      modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
    }
  }
}