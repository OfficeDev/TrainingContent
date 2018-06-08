using System;

namespace OfficeDev.TrainingContent.SendAdaptiveCard
{
    class Output
    {
        public const ConsoleColor Default = ConsoleColor.White;
        public const ConsoleColor Info = ConsoleColor.Cyan;
        public const ConsoleColor Error = ConsoleColor.Red;
        public const ConsoleColor Warning = ConsoleColor.Yellow;
        public const ConsoleColor Success = ConsoleColor.Green;

        public static void Write(string output)
        {
            Console.Write(output);
        }

        public static void Write(ConsoleColor color, string output)
        {
            Console.ForegroundColor = color;
            Console.Write(output);
            Console.ResetColor();
        }

        public static void Write(string format, params object[] values)
        {
            Console.Write(format, values);
        }

        public static void Write(ConsoleColor color, string format, params object[] values)
        {
            Console.ForegroundColor = color;
            Console.Write(format, values);
            Console.ResetColor();
        }

        public static void WriteLine(string output)
        {
            Console.WriteLine(output);
        }

        public static void WriteLine(ConsoleColor color, string output)
        {
            Console.ForegroundColor = color;
            Console.WriteLine(output);
            Console.ResetColor();
        }

        public static void WriteLine(string format, params object[] values)
        {
            Console.WriteLine(format, values);
        }

        public static void WriteLine(ConsoleColor color, string format, params object[] values)
        {
            Console.ForegroundColor = color;
            Console.WriteLine(format, values);
            Console.ResetColor();
        }
    }
}
