﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Office365Calendar.Models
{
    public class MyEvent
    {
        public string Id { get; set; }

        [DisplayName("Subject")]
        public string Subject { get; set; }

        [DisplayName("Start Time")]
        [DisplayFormat(DataFormatString = "{0:MM/dd/yyyy}", ApplyFormatInEditMode = true)]
        public DateTimeOffset? Start { get; set; }

        [DisplayName("End Time")]
        [DisplayFormat(DataFormatString = "{0:MM/dd/yyyy}", ApplyFormatInEditMode = true)]
        public DateTimeOffset? End { get; set; }

        [DisplayName("Location")]
        public string Location { get; set; }

        [DisplayName("Body")]
        public string Body { get; set; }
    }
}