using Windows.Data.Xml.Dom;

namespace FlickrSearch
{
    internal static class TemplateUtility
    {
        public static void CompleteTemplate(XmlDocument xml, string[] text, string[] images = null, string sound = null)
        {
            XmlNodeList slots = xml.SelectNodes("descendant-or-self::image");
            int index = 0;

            if ((images != null) && (slots != null))
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

                while ((slots != null) && ((index < text.Length) && (index < slots.Length)))
                {
                    slots[index].AppendChild(xml.CreateTextNode(text[index]));
                    index++;
                }
            }

            if (!string.IsNullOrEmpty(sound))
            {
                var audioElement = xml.CreateElement("audio");
                audioElement.SetAttribute("src", sound);
                xml.DocumentElement.AppendChild(audioElement);
            }
        }
    }
}
