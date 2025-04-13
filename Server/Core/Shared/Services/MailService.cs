using Core.Shared.Configurations;
using Core.Shared.Interfaces.IService;
using Core.Shared.Utilities;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using static Org.BouncyCastle.Crypto.Engines.SM2Engine;

namespace Core.Shared.Services
{
    public class MailService : IMailService
    {
        private readonly MailConfiguration _mailConfig;
        private readonly IStorageService _storageService;
        private readonly ILogger<MailService> _logger;

        public MailService(IOptions<MailConfiguration> config, IStorageService storageService, ILogger<MailService> logger)
        {
            _mailConfig = config.Value;
            _storageService = storageService;
            _logger = logger;
        }

        public async Task<bool> SendMail(string receiver, string subject, string htmlContent)
        {
            try
            {
                // Create a mail contain
                MimeMessage mail = new();
                mail.Subject = subject;
                mail.From.Add(new MailboxAddress("ListenE", EnvHelper.GetSystemEmail()));
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
            catch (Exception ex)
            {
                _logger.LogError(ex, "An email sender error occurred.");
                return false;
            }

        }
    }
}
