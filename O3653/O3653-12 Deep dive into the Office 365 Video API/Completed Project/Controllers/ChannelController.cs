using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using VideoApiWeb.Models;
using VideoApiWeb.Utils;

namespace VideoApiWeb.Controllers {
  public class ChannelController : Controller {
    [Authorize]
    public async Task<ActionResult> Index()
    {
      var repo = new VideoChannelRepository();

      var channels = await repo.GetChannels(false);

      return View(channels);
    }
  }
}