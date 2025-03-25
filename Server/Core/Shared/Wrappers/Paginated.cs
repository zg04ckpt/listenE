namespace Core.Shared.Wrappers
{
    public class Paginated<T>
    {
        public int TotalItems { get; set; }
        public int Page { get; set; }
        public int Size { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalItems / Size);
        public T[] Items { get; set; }
    }
}
