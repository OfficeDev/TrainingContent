using Newtonsoft.Json;

namespace WebApplication1.Models
{
  public class ConnectorCard
  {
    [JsonProperty("@context")]
    public string Context
    {
      get { return "http://schema.org/extensions"; }
    }

    [JsonProperty("@type")]
    public string Type
    {
      get { return "MessageCard"; }
    }

    public string Summary { get; set; }
    public string Title { get; set; }
    public string Text { get; set; }
    public string ThemeColor { get; set; }
    public Section[] Sections { get; set; }
    public ViewAction[] PotentialAction { get; set; }
  }

  public class Section
  {
    public string Title { get; set; }
    public string ActivityTitle { get; set; }
    public string ActivitySubtitle { get; set; }
    public string ActivityImage { get; set; }
    public string ActivityText { get; set; }
    public Image HeroImage { get; set; }
    public Fact[] Facts { get; set; }
    public Image[] Images { get; set; }
    public ViewAction[] PotentialAction { get; set; }
  }

  public class Fact
  {
    public string Name { get; set; }
    public string Value { get; set; }
  }

  public class Image
  {
    [JsonProperty("image")]
    public string ImageUrl { get; set; }
    public string Title { get; set; }
  }

  public class ViewAction
  {
    [JsonProperty("@context")]
    public string Context
    {
      get { return "http://schema.org"; }
    }

    [JsonProperty("@type")]
    public string Type { get; set; }
    public string Name { get; set; }
    public string[] Target { get; set; }
  }

  public static class CardFactory
  {
    public static ConnectorCard GetCard(Controllers.HomeController.CardTypes cardType)
    {
      ConnectorCard result = null;
      switch (cardType)
      {
        case Controllers.HomeController.CardTypes.ConnectorReferenceExample:
          result = GetConnectorsReferenceCard();
          break;
        case Controllers.HomeController.CardTypes.TwitterHeroImage:
          result = GetTwitterHeroCard();
          break;
      }
      return result;
    }

    public static ConnectorCard GetTwitterHeroCard()
    {
      var card = new ConnectorCard()
      {
        ThemeColor = "E81123",
        Summary = "New Tweet",
        Sections = new Section[]
        {
          new Section()
          {
            ActivityTitle = "**SpaceX**",
            ActivitySubtitle = "@SpaceX - 3/30/2017",
            ActivityImage = "https://pbs.twimg.com/profile_images/671865418701606912/HECw8AzK_400x400.jpg",
            ActivityText = "More photos from today’s Falcon 9 launch and first stage landing → [http://flickr.com/spacex](http://flickr.com/spacex)",
            HeroImage = new Image()
            {
              ImageUrl = "https://pbs.twimg.com/media/C8NK1XGUIAA-CJK.jpg"
            }
          }
        }
      };
      return card;
    }

    private static ConnectorCard GetConnectorsReferenceCard()
    {
      var card = new ConnectorCard()
      {
        Summary = "Miguel Garcia commented on Trello",
        Title = "Project Tango",
        Sections = new Section[]
        {
          new Section()
          {
            ActivityTitle= "Miguel Garcia commented",
            ActivitySubtitle= "On Project Tango",
            ActivityText= "\"Here are the designs\"",
            ActivityImage= "http://connectorsdemo.azurewebsites.net/images/MSC12_Oscar_002.jpg"
          },
          new Section()
          {
            Title= "Details",
            Facts=new Fact[]
            {
              new Fact()
              {
                Name= "Labels",
                Value= "Designs, redlines"
              },
              new Fact()
              {
                Name= "Due date",
                Value= "Dec 7, 2016"
              },
              new Fact()
              {
                Name= "Attachments",
                Value= "[final.jpg](http://connectorsdemo.azurewebsites.net/images/WIN14_Jan_04.jpg)"
              }
            }
          },
          new Section()
          {
            Title= "Images",
            Images= new Image[]
            {
              new Image()
              {
                ImageUrl="http://connectorsdemo.azurewebsites.net/images/MicrosoftSurface_024_Cafe_OH-06315_VS_R1c.jpg"
              },
              new Image()
              {
                ImageUrl="http://connectorsdemo.azurewebsites.net/images/WIN12_Scene_01.jpg"
              },
              new Image()
              {
                ImageUrl="http://connectorsdemo.azurewebsites.net/images/WIN12_Anthony_02.jpg"
              }
            }
          }
        },
        PotentialAction = new ViewAction[]
        {
          new ViewAction()
          {
            Name = "View in Trello",
            Type = "ViewAction",
            Target = new string []{ "https://trello.com/c/1101/" }
          }
        }
      };
      return card;
    }
  }
}