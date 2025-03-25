using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Shared.Interfaces.IService
{
    public interface IMailService
    {
        Task<bool> SendMail(string receiver, string subject, string body);
        Task<bool> SendConfirmAccountMail(string email, string url, string templateFileName);
    }
}
