namespace Core.Modules.ListeningModule.DTOs.Topic
{
    public class UpdateSessionOrderDto
    {
        public List<UpdateSessionOrderListItemDto> SessionOrder { get; set; }
    }

    public class UpdateSessionOrderListItemDto
    {
        public int SessionId { get; set; }
        public int Order { get; set; }
    }

}
