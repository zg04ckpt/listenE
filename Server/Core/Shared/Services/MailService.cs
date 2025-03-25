using Core.Shared.Configurations;
using Core.Shared.Interfaces.IService;
using Core.Shared.Utilities;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using static Org.BouncyCastle.Crypto.Engines.SM2Engine;

namespace Core.Shared.Services
{
    public class MailService : IMailService
    {
        private readonly MailConfiguration _mailConfig;
        private readonly IStorageService _storageService;

        public MailService(IOptions<MailConfiguration> config, IStorageService storageService)
        {
            _mailConfig = config.Value;
            _storageService = storageService;
        }

        public async Task<bool> SendConfirmAccountMail(string email, string url, string templateFileName)
        {
            string template = await _storageService.GetHtmlTemplate(templateFileName);
            template = template.Replace("CONFIRM_URL", url);
            return await SendMail(email, "Xác thực tài khoản", template);
        }

        public async Task<bool> SendMail(string receiver, string subject, string htmlContent)
        {
            try
            {
                // Create a mail contain
                MimeMessage mail = new();
                mail.Subject = subject;
                mail.From.Add(new MailboxAddress("ZShop", EnvHelper.GetSystemEmail()));
                mail.To.Add(MailboxAddress.Parse(receiver));
                mail.Body = new TextPart(MimeKit.Text.TextFormat.Html)
                {
                    Text = htmlContent
                };

                // Connect to mail server and send mail
                using var smtpClient = new SmtpClient();
                smtpClient.Connect(_mailConfig.Host, _mailConfig.Port, MailKit.Security.SecureSocketOptions.StartTls);
                smtpClient.Authenticate(EnvHelper.GetSystemEmail(), EnvHelper.GetSystemEmailPassword());
                await smtpClient.SendAsync(mail);
                smtpClient.Disconnect(true);

                return true;
            }
            catch
            {
                return false;
            }

        }
    }
}
