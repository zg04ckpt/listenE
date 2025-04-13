using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/v{version:apiVersion}/test")]
    [ApiController]
    [ApiVersion("1.0")]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public string Test()
        {
            return "api running...";
        }
    }
}
