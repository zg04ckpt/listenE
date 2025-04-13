﻿using CloudinaryDotNet.Actions;
using Core.Modules.ListeningModule.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Core.Modules.ListeningModule.DTOs.Segment
{
    public class WordCorrectListItem
    {
        public string Word { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public WordCheckResultType ResultType { get; set; }
        public int Order { get; set; }
    }
}
