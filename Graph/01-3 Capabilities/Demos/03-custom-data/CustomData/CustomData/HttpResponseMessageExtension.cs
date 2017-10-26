using System;
using System.Net.Http;

namespace CustomData
{
    public static class HttpResponseMessageExtension
    {
        public static void WriteCodeAndReasonToConsole(this HttpResponseMessage response)
        {


            var defaultBGColor = Console.BackgroundColor;
            var defaultFGColor = Console.ForegroundColor;

            if (response.IsSuccessStatusCode)
            {
                Console.ForegroundColor = ConsoleColor.Black;
                Console.BackgroundColor = ConsoleColor.Green;
                Console.Write(response.StatusCode);
            }

            if (!response.IsSuccessStatusCode)
            {
                Console.ForegroundColor = ConsoleColor.White;
                Console.BackgroundColor = ConsoleColor.Red;
                Console.Write(response.StatusCode);
                Console.WriteLine(" - " + response.ReasonPhrase);
            }
            Console.BackgroundColor = defaultBGColor;
            Console.ForegroundColor = defaultFGColor;
            Console.WriteLine();
        }
        
    }
}
