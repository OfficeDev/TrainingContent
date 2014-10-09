﻿using Microsoft.Office365.Exchange;
using Microsoft.Office365.OAuth;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace _365OAuthWeb.Controllers
{
    public class HomeController : Controller
    {
        public async Task<ActionResult> Index()
        {
            try
            {
                IEnumerable<IContact> contacts = await ContactsAPISample.GetContacts();
                ViewBag.Contacts = contacts;
            }
            catch (RedirectRequiredException x)
            {
                return Redirect(x.RedirectUri.ToString());
            }
            return View();
        }

 
    }
}