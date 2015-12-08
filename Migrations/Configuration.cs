namespace WeddingBidders.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<WeddingBidders.Server.Data.WeddingBiddersContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = true;
        }

        protected override void Seed(WeddingBidders.Server.Data.WeddingBiddersContext context)
        {
            RoleConfiguration.Seed(context);
            UserConfiguration.Seed(context);
        }
    }
}
