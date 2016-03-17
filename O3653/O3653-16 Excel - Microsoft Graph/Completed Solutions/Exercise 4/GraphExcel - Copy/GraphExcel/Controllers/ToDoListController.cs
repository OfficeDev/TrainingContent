using System.Web.Mvc;
using System.Threading.Tasks;
using GraphExcel.Helpers;

namespace GraphExcel.Controllers
{
    public class ToDoListController : Controller
    {
        ExcelAPIHelper _restAPIHelper = new ExcelAPIHelper();

        [Authorize]
        public async Task<ActionResult> Index()
        {
            return View(await _restAPIHelper.GetToDoItems());
        }

        [Authorize]
        [HttpGet]
        public ActionResult Create()
        {
            var priorityList = new SelectList(new[]
                                          {
                                          new {ID="1",Name="High"},
                                          new{ID="2",Name="Normal"},
                                          new{ID="3",Name="Low"},
                                      },
                            "ID", "Name", 1);
            ViewData["priorityList"] = priorityList;

            var statusList = new SelectList(new[]
                              {
                                          new {ID="1",Name="Not started"},
                                          new{ID="2",Name="In-progress"},
                                          new{ID="3",Name="Completed"},
                                      },
                "ID", "Name", 1);
            ViewData["statusList"] = statusList;

            return View();
        }
        [Authorize]
        [HttpPost]
        public async Task<ActionResult> Create(FormCollection collection)
        {
            try
            {

                await _restAPIHelper.CreateToDoItem(
                    collection["Title"],
                    collection["PriorityDD"],
                    collection["StatusDD"],
                    collection["PercentComplete"],
                    collection["StartDate"],
                    collection["EndDate"],
                    collection["Notes"]);
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}