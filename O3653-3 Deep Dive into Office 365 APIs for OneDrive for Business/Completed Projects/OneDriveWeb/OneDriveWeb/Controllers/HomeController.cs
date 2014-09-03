﻿using Microsoft.Office365.OAuth;
using System.Threading.Tasks;

using System;
using System.Collections.Generic;
using System.Linq;

using System.Web;
using System.Web.Mvc;

namespace OneDriveWeb.Controllers
{
    public class HomeController : Controller
    {
        public async Task<ActionResult> Index(int? pageIndex, int? pageSize)
        {

            FileRepository repository = new FileRepository();

            if (pageIndex == null)
            {
                pageIndex = 0;
            }

            if (pageSize == null)
            {
                pageSize = 10;
            }

            try
            {
                ViewBag.PageIndex = (int)pageIndex;
                ViewBag.PageSize = (int)pageSize;
                ViewBag.Files = await repository.GetMyFiles((int)pageIndex, (int)pageSize);
            }
            catch (RedirectRequiredException x)
            {
                return Redirect(x.RedirectUri.ToString());
            }

            return View();
        }

        public async Task<ActionResult> Upload()
        {

            FileRepository repository = new FileRepository();

            foreach (string key in Request.Files)
            {
                if (Request.Files[key] != null && Request.Files[key].ContentLength > 0)
                {
                    var file = await repository.UploadFile(
                        Request.Files[key].InputStream,
                        Request.Files[key].FileName.Split('\\')[Request.Files[key].FileName.Split('\\').Length - 1]);
                }
            }

            return Redirect("/");
        }

        public async Task<ActionResult> Delete(string name)
        {
            FileRepository repository = new FileRepository();

            if (name != null)
            {
                await repository.DeleteFile(name);
            }

            return Redirect("/");

        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}