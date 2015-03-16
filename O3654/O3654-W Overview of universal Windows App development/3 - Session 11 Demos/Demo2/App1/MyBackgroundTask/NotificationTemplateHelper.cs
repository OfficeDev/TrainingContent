using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Data.Xml.Dom;

namespace mtaulty.Utility
{
  static class NotificationTemplateHelper
  {
    public static void CompleteBadgeTemplate(XmlDocument xml, int badgeValue)
    {
      xml.DocumentElement.SetAttribute("value", badgeValue.ToString());
    }
    public static void CompleteToastOrTileTemplate(XmlDocument xml, string[] text, string[] images)
    {
      XmlNodeList slots = xml.SelectNodes("descendant-or-self::image");
      int index = 0;

      if (images != null)
      {
        while ((index < images.Length) && (index < slots.Length))
        {
          ((XmlElement)slots[index]).SetAttribute("src", images[index]);
          index++;
        }
      }

      if (text != null)
      {
        slots = xml.SelectNodes("descendant-or-self::text");
        index = 0;

        while ((index < text.Length) && (index < slots.Length))
        {
          slots[index].AppendChild(xml.CreateTextNode(text[index]));
          index++;
        }
      }
    }
  }
}
