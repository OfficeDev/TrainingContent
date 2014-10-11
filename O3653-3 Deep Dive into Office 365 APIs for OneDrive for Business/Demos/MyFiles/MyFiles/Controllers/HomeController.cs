using Files.Models;
using Microsoft.Office365.OAuth;
using Microsoft.Office365.SharePoint;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Files.Controllers
{
    public class HomeController : Controller
    {
        private IFileRepository _repository;

        public HomeController(IFileRepository repository)
        {
            _repository = repository;
        }
        public ActionResult OAuth()
        {
            System.Web.HttpContext.Current.Session["AuthCode"] = Request.QueryString["code"];
            return Redirect("/");
        }
        public async Task<ActionResult> Index(int? pageIndex, int? pageSize, string code)
        {

            FileViewModel model = new FileViewModel();

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
                model.MyFiles = await _repository.GetMyFiles(model.PageIndex, model.PageSize);
            }
            catch (RedirectRequiredException x)
            {
                return Redirect(x.RedirectUri.ToString());
            }

            return View(model);
        }

        public async Task<ActionResult> Upload()
        {

            foreach (string key in Request.Files)
            {
                if (Request.Files[key] != null && Request.Files[key].ContentLength > 0)
                {
                    MyFile newFile = await _repository.UploadFile(
                        Request.Files[key].InputStream, 
                        Request.Files[key].FileName.Split('\\')[Request.Files[key].FileName.Split('\\').Length - 1]);
                }
            }

            return Redirect("/");
        }

        public async Task<ActionResult> Delete(string name)
        {
            if (name != null)
            {
                 bool ret = await _repository.DeleteFile(name);
            }

            return Redirect("/");

        }

        public async Task<ActionResult> Rename(FormCollection values)
        {
            if (values[0] != null  && values[1] != null)
            {
                bool ret = await _repository.RenameFile(values[0],values[1]);
            }

            return Redirect("/");

        }
    }
}