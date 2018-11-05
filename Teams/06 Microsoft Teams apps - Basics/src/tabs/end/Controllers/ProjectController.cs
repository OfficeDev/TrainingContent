using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace myteamsapp.Controllers
{
    [Route("api/[controller]")]
    public class ProjectController : Controller
    {
        [HttpGet("{id}")]
        public dynamic GetById(int id)
        {
            return new { 
                name = DateTime.Now,
                id = id
            };
        }
    }
}
