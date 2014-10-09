using Microsoft.Office365.OAuth;
using SPContactsList.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace SPContactsList.Controllers
{
    public class HomeController : Controller
    {
        private IContactRepository _repository;

        public HomeController(ContactRepository repository)
        {
            _repository = repository;
        }

        public async Task<ActionResult> OAuth()
        {

            var client = new HttpClient();
            client.BaseAddress = new Uri(ContactRepository.AccessTokenRequesrUrl);

            string auth_code = Request.QueryString["code"];

            var content = new FormUrlEncodedContent(new[] {
                new KeyValuePair<string, string>("grant_type", "authorization_code"),
                new KeyValuePair<string, string>("resource", ContactRepository.ServiceResourceId),
                new KeyValuePair<string, string>("redirect_uri", ContactRepository.DebugSiteRedirectUrl),
                new KeyValuePair<string, string>("client_id", ContactRepository.ClientId),
                new KeyValuePair<string, string>("client_secret", ContactRepository.ClientSecret),
                new KeyValuePair<string, string>("code", auth_code)
            });

            var result = await client.PostAsync(ContactRepository.AccessTokenRequesrUrl, content);
            JsonWebToken jwt = JsonWebToken.Deserialize(result.Content.ReadAsStringAsync().Result);

            System.Web.HttpContext.Current.Session["AccessToken"] = jwt.access_token;

            return Redirect("/");
        }
        public async Task<ActionResult> Index(int? pageIndex, int? pageSize, string contactId)
        {
            if (Request.HttpMethod == "POST" && contactId != null)
            {
                await _repository.DeleteContact(contactId);
                return Redirect("/");
            }
            else
            {

                ContactsViewModel model = new ContactsViewModel();

                if (pageIndex == null)
                {
                    model.PageIndex = 0;
                }
                else
                {
                    model.PageIndex = (int)pageIndex;
                }

                if (pageSize == null)
                {
                    model.PageSize = 10;
                }
                else
                {
                    model.PageSize = (int)pageSize;
                }

                try
                {
                    model.Contacts = await _repository.GetContacts(model.PageIndex, model.PageSize);
                }
                catch (RedirectRequiredException x)
                {
                    return Redirect(x.RedirectUri.ToString());
                }

                return View(model);
            }
        }

        public async Task<ActionResult> View(string contactId)
        {
            Contact contact = null;
            try
            {
                contact = await _repository.GetContact(contactId);
            }
            catch (RedirectRequiredException x)
            {
                return Redirect(x.RedirectUri.ToString());
            }

            return View(contact);
        }

        public async Task<ActionResult> Create(Contact contact)
        {
            if (Request.HttpMethod == "POST")
            {
                Contact newContact = await _repository.CreateContact(contact);
                return Redirect("/");
            }
            else
            {
                return View(contact);
            }
        }

        public async Task<ActionResult> Edit(string Id, Contact contact)
        {
            if (Request.HttpMethod == "POST")
            {
                await _repository.UpdateContact(contact);
                return Redirect("/");
            }
            else
            {
                 contact = await _repository.GetContact(Id);
                return View(contact);
           }
        }
    }
}