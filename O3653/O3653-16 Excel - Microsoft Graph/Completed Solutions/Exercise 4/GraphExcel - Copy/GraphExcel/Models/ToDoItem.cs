using System;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace GraphExcel.Models
{
    public class ToDoItem
    {
        [JsonProperty("index")]
        public int Id { get; set; }
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
            int id,
            string title,
            string priority,
            string status,
            string percentComplete,
            string startDate,
            string endDate,
            string notes)
        {
            Id = Convert.ToInt32(id);
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