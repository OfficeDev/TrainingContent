﻿using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Web;
using TasksWeb.Models;

namespace TasksWeb.Data {

  public class TasksWebContext : DbContext {
    public TasksWebContext()
      : base("TasksWebContext") { }

    //public DbSet<Tenant> Tenants { get; set; }
    //public DbSet<User> Users { get; set; }

    public DbSet<PerWebUserCache> PerUserCacheList { get; set; }

    protected override void OnModelCreating(DbModelBuilder modelBuilder) {
      modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
    }
  }
}