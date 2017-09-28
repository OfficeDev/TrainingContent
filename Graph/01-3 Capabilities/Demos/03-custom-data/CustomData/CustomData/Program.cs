using System.Configuration;
using System.Threading.Tasks;

namespace CustomData
{
    class Program
    {
        static void Main(string[] args)
        {
            RunAsync(args).GetAwaiter().GetResult();
        }

        static async Task RunAsync(string[] args)
        {

            var clientId = ConfigurationManager.AppSettings["ida:clientId"];

            var openExtensionsDemo = new OpenExtensionsDemo();
            await openExtensionsDemo.RunAsync(clientId);

            var schemaExtensionDemo = new SchemaExtensionsDemo();
            await schemaExtensionDemo.RunAsync(clientId);

            System.Console.WriteLine("Press ENTER to continue.");
            System.Console.ReadLine();
        }



    }
}
