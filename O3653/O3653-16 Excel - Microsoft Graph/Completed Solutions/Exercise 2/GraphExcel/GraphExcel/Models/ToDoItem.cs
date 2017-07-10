//Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
//See LICENSE in the project root for license information.

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;

namespace GraphExcel.Models
{
    public class ToDoItem
    {
        [JsonProperty("index")]
        public string Id { get; set; }
        [Required]
        public string Title { get; set; }

        [Required]
        public string Status { get; set; }

        [Required]
        public string Priority { get; set; }

        [Required]
        public string PercentComplete { get; set; }

        [Required]
        public string StartDate { get; set; }

        [Required]
        public string EndDate { get; set; }

        [DataType(DataType.MultilineText)]
        public string Notes { get; set; }

        public ToDoItem(
            string id,
            string title,
            string priority,
            string status,
            string percentComplete,
            string startDate,
            string endDate,
            string notes)
        {
            Id = id;
            Title = title;
            Priority = priority;
            Status = status;
            if (!percentComplete.EndsWith("%"))
                PercentComplete = percentComplete + "%";
            else
                PercentComplete = percentComplete;

            StartDate = startDate;
            EndDate = endDate;
            Notes = notes;
        }

        public ToDoItem() { }
    }
}