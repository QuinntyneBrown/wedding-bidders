using System.Net.Http;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Services.Contracts
{
    public interface IMessageService
    {
        Message Add(HttpRequestMessage request, MessageDto dto);
    }
}
