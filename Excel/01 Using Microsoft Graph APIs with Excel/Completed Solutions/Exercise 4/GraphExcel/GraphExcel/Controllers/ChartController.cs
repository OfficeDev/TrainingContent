using System.Web.Mvc;
using System.Threading.Tasks;
using GraphExcel.Helpers;

namespace GraphExcel.Controllers
{
    public class ChartController : Controller
    {
        [Authorize]
        public ActionResult Index()
        {
            return View();
        }
        public async Task<FileResult> GetChart()
        {
            ExcelAPIHelper _restAPIHelper = new ExcelAPIHelper();
            return await _restAPIHelper.getChartImage();
        }
    }
}