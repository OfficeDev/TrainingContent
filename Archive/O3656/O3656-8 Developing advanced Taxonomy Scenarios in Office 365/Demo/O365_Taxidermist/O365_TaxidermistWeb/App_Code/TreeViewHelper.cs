using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

public static class TreeViewHelper {

  public static MvcHtmlString TreeView(this HtmlHelper htmlHelper, TermsetModel termset) {

    string termsetDisplayName = termset.DisplayName;
    List<TermModel> terms = termset.TopLevelTerms;

    string html = "<div>" +
                  "<ul class='treeview'>" +
                  "<li  class='closed expandable'>" +
                  "<span class='open expandable'>" + termsetDisplayName + "</span>";
    
    if (terms.Count > 0) {
      html += "<ul>";
      foreach (var term in terms) {
        html += "<li  class='closed expandable'>" + 
                "<span>" + term.TermName + "</span>" + 
                GetChildTerms(term) +
                "</li>";
      }
      html += "<ul>";
    }
    
    
    html += "</li>" + 
            "</ul>" +
            "</div>";

    return MvcHtmlString.Create(html);
  }

  private static string GetChildTerms(TermModel term) {
    string html = string.Empty;
    if (term.ChildTerms.Count > 0) {
      html += "<ul>";
      foreach (var childTerm in term.ChildTerms) {
        html += "<li class='closed expandable'>" + 
                "<span>" + childTerm.TermName + "</span>" +
                GetChildTerms(childTerm) +
                "</li>";
      }
      html += "</ul>";

    }
    return html;
  }
}