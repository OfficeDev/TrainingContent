using System;
using System.IO;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;

namespace ServerSideCSOMWeb {

  public class HtmlTableWriter {

    Dictionary<string, string> rows;

    public HtmlTableWriter() {
      rows = new Dictionary<string, string>();
    }

    public void AddRow(string name, string value) {
      rows.Add(name, value);
    }

    public override string ToString() {

      StringBuilder buffer = new StringBuilder();
      HtmlTextWriter writer = new HtmlTextWriter(new StringWriter(buffer));

      writer.RenderBeginTag(HtmlTextWriterTag.Table);

      foreach (var row in rows) {
        writer.RenderBeginTag(HtmlTextWriterTag.Tr);
        //writer.AddStyleAttribute(HtmlTextWriterStyle.Width, "260px");
        writer.RenderBeginTag(HtmlTextWriterTag.Td);
        writer.Write(row.Key);
        writer.RenderEndTag(); // td
        writer.RenderBeginTag(HtmlTextWriterTag.Td);
        writer.Write(row.Value);
        writer.RenderEndTag(); // td
        writer.RenderEndTag(); // tr
      }

      writer.RenderEndTag(); // table
      writer.Flush();
      return buffer.ToString();
    }

  }


}