using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;


public class MyEventsRepository {

  public static async Task<ObservableCollection<MyEvent>> GetEvents() {

    ObservableCollection<MyEvent> eventsCollection = new ObservableCollection<MyEvent>();

    eventsCollection.Add(new MyEvent {
      Subject = "Walk the Dog",
      Start = DateTimeOffset.Now,
      End = DateTimeOffset.Now.AddHours(8),
      Location = "My house"
    });

    eventsCollection.Add(new MyEvent {
      Subject = "Bake a cake",
      Start = DateTimeOffset.Now,
      End = DateTimeOffset.Now.AddHours(8),
      Location = "Scot's house"
    });

    eventsCollection.Add(new MyEvent {
      Subject = "Wash the cat",
      Start = DateTimeOffset.Now,
      End = DateTimeOffset.Now.AddHours(8),
      Location = "Redmond Town Center"
    });

    return eventsCollection;
  }



}
