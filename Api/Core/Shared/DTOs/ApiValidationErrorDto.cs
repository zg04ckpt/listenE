using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Shared.DTOs
{
    public class ApiValidationErrorDto
    {
        public string Code { get; set; }
        public string Message { get; set; }
        public ValidationErrorItem[] Errors { get; set; }   
    }

    public class ValidationErrorItem
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
