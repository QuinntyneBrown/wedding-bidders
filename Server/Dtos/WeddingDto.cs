namespace WeddingBidders.Server.Dtos
{
    public class WeddingDto
    {
        public WeddingDto()
        {
            this.Id = 0;
        }

        public int Id { get; set; }

        public int NumberOfGuests { get; set; }

        public int NumberOfHours { get; set; }

        public string Location { get; set; }

    }
}