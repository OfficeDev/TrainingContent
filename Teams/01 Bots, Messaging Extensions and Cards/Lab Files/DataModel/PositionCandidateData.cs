using Bogus;
using System;
using System.Collections.Generic;

namespace OfficeDev.Talent.Management
{
  public static class Constants
  {
    public static List<string> Titles = new List<string>
  {
    "Graphics Artist",
    "Senior Content Writer",
    "Senior Program Manager",
    "Software Developer II",
    "Principal Product Manager",
    "Marketing Manager",
    "Development Lead",
    "UX Designer"
  };

    public static List<string> Stages = new List<string>
  {
    "Applied",
    "Interviewing",
    "Pending",
    "Offered"
  };

    public static List<string> Locations = new List<string>
  {
    "San Francisco",
    "London",
    "Singapore",
    "Dubai",
    "Frankfurt"
  };
  }

  public class OpenPositionsDataController
  {
    public List<OpenPosition> ListOpenPositions(int count)
    {
      List<OpenPosition> resp = new List<OpenPosition>();

      for (int i = 0; i < count; i++)
      {
        resp.Add(GeneratePosition());
      }
      return resp;
    }

    public OpenPosition CreatePosition(string title, int level, string location, string hiringManager)
    {
      OpenPosition pos = new OpenPosition()
      {
        HiringManager = hiringManager,
        Level = level,
        Location = location,
        Title = title,
        Applicants = 0,
        DaysOpen = 0,
        ReqId = (10082082 + new Random().Next(100)).ToString()
      };

      return pos;
    }

    public OpenPosition GetPositionForReqId(string reqId)
    {
      OpenPosition pos = GeneratePosition();
      pos.ReqId = reqId;
      return pos;
    }

    private OpenPosition GeneratePosition()
    {
      Random r = new Random();
      var faker = new Faker();

      OpenPosition p = new OpenPosition()
      {
        Title = faker.PickRandom(Constants.Titles),
        DaysOpen = r.Next() % 10,
        HiringManager = $"{faker.Name.FirstName()} {faker.Name.LastName()}",
        Applicants = r.Next() % 5,
        ReqId = Guid.NewGuid().ToString().Split('-')[0].ToUpper(),
        Level = r.Next(7, 10),
        Location = faker.PickRandom(Constants.Locations)
      };

      return p;
    }
  }

  public class CandidatesDataController
  {
    const int numPeople = 5;

    public List<Candidate> GetTopCandidates(string reqId)
    {
      List<Candidate> resp = new List<Candidate>();

      for (int i = 0; i < numPeople; i++)
      {
        Candidate c = GenerateCandidate(i + 1);
        c.ReqId = reqId;
        resp.Add(c);
      }
      return resp;
    }

    public Candidate GetCandidateByName(string name)
    {
      Candidate c = GenerateCandidate(1);
      c.Name = name;
      return c;
    }

    public List<Candidate> GetReferrals(Candidate c)
    {
      List<Candidate> referrals = new List<Candidate>();
      for (int i = 0; i < 3; i++)
      {
        referrals.Add(GenerateCandidate(i + 1));
      }
      return referrals;
    }

    public string GetCandidateBio(Candidate c)
    {
      return "Ten years of experience in the software industry. Five years experience working at a software consulting firm.";
    }

    /// <summary>
    /// Index is 1-based, not 0-based
    /// </summary>
    /// <param name="index"></param>
    /// <returns></returns>
    private Candidate GenerateCandidate(int index)
    {
      Random r = new Random();
      var faker = new Faker();
      Person p = faker.Person;

      Candidate c = new Candidate()
      {
        Name = $"{p.FirstName} {p.LastName}",
        CurrentRole = faker.PickRandom(Constants.Titles),
        Hires = r.Next() % 4,
        NoHires = r.Next() % 4,
        Stage = faker.PickRandom(Constants.Stages),
        ProfilePicture = GetRootUrl() + $"/images/" + p.Gender.ToString().ToLower() + $"/candidate_{index}.png",
        ReqId = Guid.NewGuid().ToString().Split('-')[0].ToUpper()
      };

      return c;
    }

    private string GetRootUrl()
    {
      if (System.Web.HttpContext.Current.Request.Headers["x-original-host"] != null)
      {
        return "https://" + System.Web.HttpContext.Current.Request.Headers["x-original-host"];
      }
      else
      {
        return "https://" + System.Web.HttpContext.Current.Request.Url.Host;
      }
    }
  }
}