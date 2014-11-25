using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OutlookServicesClientDemo.Models;

namespace OutlookServicesClientDemo {

  public class ContactFactory {

    #region " static fields with arrays of field values"

    private static string[] AreaCodes = new string[] { 
        "202", "203", "204", "206", "213", "214", "215", "216", "234", "236", "248", "250", "269", "270", "281", "283", 
        "302", "303", "304", "305", "306", "307", "308", "310", "312", "313", "316", "317", "323", "340", "345", "401", 
        "402", "407", "408", "415", "416", "440", "441", "510", "512", "518", "519", "520", "530", "540", "541", "781", 
        "802", "803", "804", "806", "807", "808", "809", "811", "812", "813", "815", "817", "818", "832", "833", "835", 
        "843", "844", "845", "847", "848", "850", "855", "856", "857", "858", "859", "860"
     };
    private static string[] CompanyNames = new string[] { 
        "Acme Corp", "Ajax", "ARCAM Corporation", "Arlesdale Railway", "Astromech", "Benthic Petroleum", "Biffco", "Binford", "Black Mesa Research Facility", "Blaidd Dwrg Nuclear Power Plant", "Blue Sun Corporation", "Bluth Company", "Brown Streak Railroad", "Central Perk", "ComTron", "Contoso", 
        "Crudgington Brewery", "Culdee Fell Railway", "Cyberdyne Systems", "Daystrom Data Concepts", "Deon International", "DHARMA Initiative", "Digivation Industries", "Dinoco", "Dirk Gently's Holistic Detective Agency", "Doublemeat Palace", "Duff Beer", "Dunder Mifflin", "Ecumena", "Ewing Oil", "Ewing Oil", "Fabrikam", 
        "FrobozzCo International - Zork ", "Global Dynamics", "Grand Trunk Semaphore Company", "Grayson Sky Domes, Ltd.", "Grim Reaper Airways", "Groovy Smoothie", "Hanso Foundation", "Hishii Industries", "Incom Corporation", "InGen", "Initech", "Itex", "Izon", "Jupiter Mining Corporation", "Khumalo", "KrebStarLexCorp", 
        "Krusty Burger", "Kwik-E-Mart", "Liandri Mining Corporation", "LuthorCorp", "Medical Mechanica", "Mel's Diner", "Metacortex", "Michael Scott Paper Company", "Milliways", "Mishima ZaibatsuRAMJAC Corporation", "Muffin Buffalo", "Nordyne Defense Dynamics", "North Western Railway", "Oceanic Airlines", "Office of Scientific Intelligence (OSI)", "Onion Pacific Railroad", 
        "Peach Pit", "Porter Automobiles", "Prescott Pharmaceuticals", "Rekall", "Rovers Return", "Roxxon", "Roxxon", "Scavo's Pizzeria", "Scrooge McDuck's", "Sheinhardt Wig Company", "Shelbyville Nuclear Power Plant", "Shinra Electric Power Company", "Shinra Electric Power Companyworld, Final Fantasy VII", "Sirius Cybernetics Corporation", "Slate Rock and Gravel Company", "Soar Airlines", 
        "Soylent Corporation", "Springfield Nuclear Power Plant", "Strickland Propane", "Tagruato", "The Crab Shack", "The Hanso Foundation", "The Regal Beagle", "Total Bastard Airlines", "Trade Federation", "Tricell", "Trioptimum Corporation", "Tyrell Corporation", "Umbrella Corporation", "Union Aerospace Corporation", "Uplink Corporation", "Vandelay Industries", 
        "VersaLife Corporation", "W.C. Boggs & Co.", "Wallaby Airlines", "Wayne Enterprises", "Yoyodyne Propulsion Systems", "Zorg Industries", "Zorin Industries"
     };
    private static string[] FirstNames = new string[] { 
        "Abby", "Abigail", "Ada", "Addie", "Adela", "Adele", "Adeline", "Adrian", "Adriana", "Adrienne", "Agnes", "Aida", "Aileen", "Aimee", "Aisha", "Alana", 
        "Alba", "Alberta", "Alejandra", "Alexandra", "Alexandria", "Alexis", "Alfreda", "Alice", "Alicia", "Aline", "Alisa", "Alisha", "Alison", "Alissa", "Allie", "Allison", 
        "Allyson", "Alma", "Alta", "Althea", "Alyce", "Alyson", "Alyssa", "Amalia", "Amanda", "Amber", "Amelia", "Amie", "Amparo", "Amy", "Ana", "Anastasia", 
        "Andrea", "Angel", "Angela", "Angelia", "Angelica", "Angelina", "Angeline", "Angelique", "Angelita", "Angie", "Anita", "Ann", "Anna", "Annabelle", "Anne", "Annette", 
        "Annie", "Annmarie", "Antoinette", "Antonia", "April", "Araceli", "Arlene", "Arline", "Ashlee", "Ashley", "Audra", "Audrey", "Augusta", "Aurelia", "Aurora", "Autumn", 
        "Ava", "Avis", "Barbara", "Barbra", "Beatrice", "Beatriz", "Becky", "Belinda", "Benita", "Bernadette", "Bernadine", "Bernice", "Berta", "Bertha", "Bertie", "Beryl", 
        "Bessie", "Beth", "Bethany", "Betsy", "Bette", "Bettie", "Betty", "Bettye", "Beulah", "Beverley", "Beverly", "Bianca", "Billie", "Blanca", "Blanche", "Bobbi", 
        "Bobbie", "Bonita", "Bonnie", "Brandi", "Brandie", "Brandy", "Brenda", "Briana", "Brianna", "Bridget", "Bridgett", "Bridgette", "Brigitte", "Britney", "Brittany", "Brittney", 
        "Brooke", "Caitlin", "Callie", "Camille", "Candace", "Candice", "Candy", "Cara", "Carey", "Carissa", "Carla", "Carlene", "Carly", "Carmela", "Carmella", "Carmen", 
        "Carol", "Carole", "Carolina", "Caroline", "Carolyn", "Carrie", "Casandra", "Casey", "Cassandra", "Cassie", "Catalina", "Catherine", "Cathleen", "Cathryn", "Cathy", "Cecelia", 
        "Cecile", "Cecilia", "Celeste", "Celia", "Celina", "Chandra", "Charity", "Charlene", "Charlotte", "Charmaine", "Chasity", "Chelsea", "Cheri", "Cherie", "Cherry", "Cheryl", 
        "Chris", "Christa", "Christi", "Christian", "Christie", "Christina", "Christine", "Christy", "Chrystal", "Cindy", "Claire", "Clara", "Clare", "Clarice", "Clarissa", "Claudette", 
        "Claudia", "Claudine", "Cleo", "Coleen", "Colette", "Colleen", "Concepcion", "Concetta", "Connie", "Constance", "Consuelo", "Cora", "Corina", "Corine", "Corinne", "Cornelia", 
        "Corrine", "Courtney", "Cristina", "Crystal", "Cynthia", "Daisy", "Dale", "Dana", "Danielle", "Daphne", "Darcy", "Darla", "Darlene", "Dawn", "Deana", "Deann", 
        "Deanna", "Deanne", "Debbie", "Debora", "Deborah", "Debra", "Dee", "Deena", "Deidre", "Deirdre", "Delia", "Della", "Delores", "Deloris", "Dena", "Denise", 
        "Desiree", "Diana", "Diane", "Diann", "Dianna", "Dianne", "Dina", "Dionne", "Dixie", "Dollie", "Dolly", "Dolores", "Dominique", "Dona", "Donna", "Dora", 
        "Doreen", "Doris", "Dorothea", "Dorothy", "Dorthy", "Earlene", "Earline", "Earnestine", "Ebony", "Eddie", "Edith", "Edna", "Edwina", "Effie", "Eileen", "Elaine", 
        "Elba", "Eleanor", "Elena", "Elinor", "Elisa", "Elisabeth", "Elise", "Eliza", "Elizabeth", "Ella", "Ellen", "Elma", "Elnora", "Eloise", "Elsa", "Elsie", 
        "Elva", "Elvia", "Elvira", "Emilia", "Emily", "Emma", "Enid", "Erica", "Ericka", "Erika", "Erin", "Erma", "Erna", "Ernestine", "Esmeralda", "Esperanza", 
        "Essie", "Estela", "Estella", "Estelle", "Ester", "Esther", "Ethel", "Etta", "Eugenia", "Eula", "Eunice", "Eva", "Evangelina", "Evangeline", "Eve", "Evelyn", 
        "Faith", "Fannie", "Fanny", "Fay", "Faye", "Felecia", "Felicia", "Fern", "Flora", "Florence", "Florine", "Flossie", "Fran", "Frances", "Francesca", "Francine", 
        "Francis", "Francisca", "Frankie", "Freda", "Freida", "Frieda", "Gabriela", "Gabrielle", "Gail", "Gale", "Gay", "Gayle", "Gena", "Geneva", "Genevieve", "Georgette", 
        "Georgia", "Georgina", "Geraldine", "Gertrude", "Gilda", "Gina", "Ginger", "Gladys", "Glenda", "Glenna", "Gloria", "Goldie", "Grace", "Gracie", "Graciela", "Greta", 
        "Gretchen", "Guadalupe", "Gwen", "Gwendolyn", "Haley", "Hallie", "Hannah", "Harriet", "Harriett", "Hattie", "Hazel", "Heather", "Heidi", "Helen", "Helena", "Helene", 
        "Helga", "Henrietta", "Herminia", "Hester", "Hilary", "Hilda", "Hillary", "Hollie", "Holly", "Hope", "Ida", "Ila", "Ilene", "Imelda", "Imogene", "Ina", 
        "Ines", "Inez", "Ingrid", "Irene", "Iris", "Irma", "Isabel", "Isabella", "Isabelle", "Iva", "Ivy", "Jackie", "Jacklyn", "Jaclyn", "Jacqueline", "Jacquelyn", 
        "Jaime", "James", "Jami", "Jamie", "Jan", "Jana", "Jane", "Janell", "Janelle", "Janet", "Janette", "Janice", "Janie", "Janine", "Janis", "Janna", 
        "Jannie", "Jasmine", "Jayne", "Jean", "Jeanette", "Jeanie", "Jeanine", "Jeanne", "Jeannette", "Jeannie", "Jeannine", "Jenifer", "Jenna", "Jennie", "Jennifer", "Jenny", 
        "Jeri", "Jerri", "Jerry", "Jessica", "Jessie", "Jewel", "Jewell", "Jill", "Jillian", "Jimmie", "Jo", "Joan", "Joann", "Joanna", "Joanne", "Jocelyn", 
        "Jodi", "Jodie", "Jody", "Johanna", "John", "Johnnie", "Jolene", "Joni", "Jordan", "Josefa", "Josefina", "Josephine", "Josie", "Joy", "Joyce", "Juana", 
        "Juanita", "Judith", "Judy", "Julia", "Juliana", "Julianne", "Julie", "Juliet", "Juliette", "June", "Justine", "Kaitlin", "Kara", "Karen", "Kari", "Karin", 
        "Karina", "Karla", "Karyn", "Kasey", "Kate", "Katelyn", "Katharine", "Katherine", "Katheryn", "Kathie", "Kathleen", "Kathrine", "Kathryn", "Kathy", "Katie", "Katina", 
        "Katrina", "Katy", "Kay", "Kaye", "Kayla", "Keisha", "Kelley", "Kelli", "Kellie", "Kelly", "Kelsey", "Kendra", "Kenya", "Keri", "Kerri", "Kerry", 
        "Kim", "Kimberley", "Kimberly", "Kirsten", "Kitty", "Kris", "Krista", "Kristen", "Kristi", "Kristie", "Kristin", "Kristina", "Kristine", "Kristy", "Krystal", "Lacey", 
        "Lacy", "Ladonna", "Lakeisha", "Lakisha", "Lana", "Lara", "Latasha", "Latisha", "Latonya", "Latoya", "Laura", "Laurel", "Lauren", "Lauri", "Laurie", "Laverne", 
        "Lavonne", "Lawanda", "Lea", "Leah", "Leann", "Leanna", "Leanne", "Lee", "Leigh", "Leila", "Lela", "Lelia", "Lena", "Lenora", "Lenore", "Leola", 
        "Leona", "Leonor", "Lesa", "Lesley", "Leslie", "Lessie", "Leta", "Letha", "Leticia", "Letitia", "Lidia", "Lila", "Lilia", "Lilian", "Liliana", "Lillian", 
        "Lillie", "Lilly", "Lily", "Lina", "Linda", "Lindsay", "Lindsey", "Lisa", "Liz", "Liza", "Lizzie", "Lois", "Lola", "Lolita", "Lora", "Loraine", 
        "Lorena", "Lorene", "Loretta", "Lori", "Lorie", "Lorna", "Lorraine", "Lorrie", "Lottie", "Lou", "Louella", "Louisa", "Louise", "Lourdes", "Luann", "Lucia", 
        "Lucile", "Lucille", "Lucinda", "Lucy", "Luella", "Luisa", "Lula", "Lupe", "Luz", "Lydia", "Lynda", "Lynette", "Lynn", "Lynne", "Lynnette", "Mabel", 
        "Mable", "Madeleine", "Madeline", "Madelyn", "Madge", "Mae", "Magdalena", "Maggie", "Mai", "Malinda", "Mallory", "Mamie", "Mandy", "Manuela", "Mara", "Marcella", 
        "Marci", "Marcia", "Marcie", "Marcy", "Margaret", "Margarita", "Margery", "Margie", "Margo", "Margret", "Marguerite", "Mari", "Maria", "Marian", "Mariana", "Marianne", 
        "Maribel", "Maricela", "Marie", "Marietta", "Marilyn", "Marina", "Marion", "Marisa", "Marisol", "Marissa", "Maritza", "Marjorie", "Marla", "Marlene", "Marquita", "Marsha", 
        "Marta", "Martha", "Martina", "Marva", "Mary", "Maryann", "Maryanne", "Maryellen", "Marylou", "Matilda", "Mattie", "Maude", "Maura", "Maureen", "Mavis", "Maxine", 
        "May", "Mayra", "Meagan", "Megan", "Meghan", "Melanie", "Melba", "Melinda", "Melisa", "Melissa", "Melody", "Melva", "Mercedes", "Meredith", "Merle", "Mia", 
        "Michael", "Michele", "Michelle", "Milagros", "Mildred", "Millicent", "Millie", "Mindy", "Minerva", "Minnie", "Miranda", "Miriam", "Misty", "Mitzi", "Mollie", "Molly", 
        "Mona", "Monica", "Monique", "Morgan", "Muriel", "Myra", "Myrna", "Myrtle", "Nadia", "Nadine", "Nancy", "Nanette", "Nannie", "Naomi", "Natalia", "Natalie", 
        "Natasha", "Nelda", "Nell", "Nellie", "Nettie", "Neva", "Nichole", "Nicole", "Nikki", "Nina", "Nita", "Noelle", "Noemi", "Nola", "Nona", "Nora", 
        "Noreen", "Norma", "Odessa", "Ofelia", "Ola", "Olga", "Olive", "Olivia", "Ollie", "Opal", "Ophelia", "Ora", "Paige", "Pam", "Pamela", "Pansy", 
        "Pat", "Patrica", "Patrice", "Patricia", "Patsy", "Patti", "Patty", "Paula", "Paulette", "Pauline", "Pearl", "Pearlie", "Peggy", "Penelope", "Penny", "Petra", 
        "Phoebe", "Phyllis", "Polly", "Priscilla", "Queen", "Rachael", "Rachel", "Rachelle", "Rae", "Ramona", "Randi", "Raquel", "Reba", "Rebecca", "Rebekah", "Regina", 
        "Rena", "Rene", "Renee", "Reva", "Reyna", "Rhea", "Rhoda", "Rhonda", "Rita", "Robbie", "Robert", "Roberta", "Robin", "Robyn", "Rochelle", "Ronda", 
        "Rosa", "Rosalie", "Rosalind", "Rosalinda", "Rosalyn", "Rosanna", "Rosanne", "Rosario", "Rose", "Roseann", "Rosella", "Rosemarie", "Rosemary", "Rosetta", "Rosie", "Roslyn", 
        "Rowena", "Roxanne", "Roxie", "Ruby", "Ruth", "Ruthie", "Sabrina", "Sadie", "Sallie", "Sally", "Samantha", "Sandra", "Sandy", "Sara", "Sarah", "Sasha", 
        "Saundra", "Savannah", "Selena", "Selma", "Serena", "Shana", "Shanna", "Shannon", "Shari", "Sharlene", "Sharon", "Sharron", "Shauna", "Shawn", "Shawna", "Sheena", 
        "Sheila", "Shelby", "Shelia", "Shelley", "Shelly", "Sheree", "Sheri", "Sherri", "Sherrie", "Sherry", "Sheryl", "Shirley", "Silvia", "Simone", "Socorro", "Sofia", 
        "Sondra", "Sonia", "Sonja", "Sonya", "Sophia", "Sophie", "Stacey", "Staci", "Stacie", "Stacy", "Stefanie", "Stella", "Stephanie", "Sue", "Summer", "Susan", 
        "Susana", "Susanna", "Susanne", "Susie", "Suzanne", "Suzette", "Sybil", "Sylvia", "Tabatha", "Tabitha", "Tamara", "Tameka", "Tamera", "Tami", "Tamika", "Tammi", 
        "Tammie", "Tammy", "Tamra", "Tania", "Tanisha", "Tanya", "Tara", "Tasha", "Taylor", "Teresa", "Teri", "Terra", "Terri", "Terrie", "Terry", "Tessa", 
        "Thelma", "Theresa", "Therese", "Tia", "Tiffany", "Tina", "Tisha", "Tommie", "Toni", "Tonia", "Tonya", "Tracey", "Traci", "Tracie", "Tracy", "Tricia", 
        "Trina", "Trisha", "Trudy", "Twila", "Ursula", "Valarie", "Valeria", "Valerie", "Vanessa", "Velma", "Vera", "Verna", "Veronica", "Vicki", "Vickie", "Vicky", 
        "Victoria", "Vilma", "Viola", "Violet", "Virgie", "Virginia", "Vivian", "Vonda", "Wanda", "Wendi", "Wendy", "Whitney", "Wilda", "Willa", "Willie", "Wilma", 
        "Winifred", "Winnie", "Yesenia", "Yolanda", "Young", "Yvette", "Yvonne", "Zelma", "Aaron", "Abdul", "Abe", "Abel", "Abraham", "Abram", "Adam", "Adolfo", 
        "Adrian", "Ahmed", "Al", "Alan", "Albert", "Alberto", "Alden", "Alec", "Alejandro", "Alex", "Alexander", "Alexis", "Alfonzo", "Alfred", "Allan", "Alonso", 
        "Alonzo", "Alphonse", "Alphonso", "Alton", "Alva", "Alvaro", "Alvin", "Amado", "Ambrose", "Amos", "Anderson", "Andre", "Andrea", "Andres", "Andrew", "Andy", 
        "Angel", "Angelo", "Anibal", "Anthony", "Antione", "Antoine", "Anton", "Antone", "Antonia", "Antonio", "Antony", "Antwan", "Archie", "Arden", "Ariel", "Arlen", 
        "Arlie", "Armand", "Armando", "Arnold", "Arnoldo", "Arnulfo", "Aron", "Arron", "Art", "Arthur", "Arturo", "Asa", "Ashley", "Aubrey", "August", "Augustine", 
        "Augustus", "Aurelio", "Austin", "Avery", "Barney", "Barrett", "Barry", "Bart", "Barton", "Basil", "Beau", "Ben", "Benedict", "Benito", "Benjamin", "Bennett", 
        "Bennie", "Benny", "Benton", "Bernard", "Bernardo", "Bernie", "Berry", "Bert", "Bertram", "Bill", "Billie", "Billy", "Blaine", "Blair", "Blake", "Bo", 
        "Bob", "Bob", "Bob", "Bob", "Bob", "Bob", "Bob", "Bob", "Bob", "Bobbie", "Bobby", "Booker", "Boris", "Boyce", "Boyd", "Brad", 
        "Bradford", "Bradley", "Bradly", "Brady", "Brain", "Branden", "Brandon", "Brant", "Brendan", "Brendon", "Brent", "Brenton", "Bret", "Brett", "Brian", "Brice", 
        "Britt", "Brock", "Broderick", "Brooks", "Bruce", "Bruno", "Bryan", "Bryant", "Bryce", "Bryon", "Buck", "Bud", "Buddy", "Buford", "Burl", "Burt", 
        "Burton", "Buster", "Byron", "Caleb", "Calvin", "Cameron", "Carey", "Carl", "Carlo", "Carlos", "Carlton", "Carmelo", "Carmen", "Carmine", "Carol", "Carrol", 
        "Carroll", "Carson", "Carter", "Cary", "Casey", "Cecil", "Cedric", "Cedrick", "Cesar", "Chad", "Chadwick", "Chance", "Chang", "Charles", "Charley", "Charlie", 
        "Chas", "Chase", "Chauncey", "Chester", "Chet", "Chi", "Chong", "Chris", "Christian", "Christoper", "Christopher", "Chuck", "Chung", "Clair", "Clarence", "Clark", 
        "Claud", "Claude", "Claudio", "Clay", "Clayton", "Clement", "Clemente", "Cleo", "Cletus", "Cleveland", "Cliff", "Clifford", "Clifton", "Clint", "Clinton", "Clyde", 
        "Cody", "Colby", "Cole", "Coleman", "Colin", "Collin", "Colton", "Columbus", "Connie", "Conrad", "Cordell", "Corey", "Cornelius", "Cornell", "Cortez", "Cory", 
        "Courtney", "Coy", "Craig", "Cristobal", "Cristopher", "Cruz", "Curt", "Curtis", "Cyril", "Cyrus", "Dale", "Dallas", "Dalton", "Damian", "Damien", "Damion", 
        "Damon", "Dan", "Dana", "Dane", "Danial", "Daniel", "Danilo", "Dannie", "Danny", "Dante", "Darell", "Daren", "Darin", "Dario", "Darius", "Darnell", 
        "Daron", "Darrel", "Darrell", "Darren", "Darrick", "Darrin", "Darron", "Darryl", "Darwin", "Daryl", "Dave", "David", "Davis", "Dean", "Deandre", "Deangelo", 
        "Dee", "Del", "Delbert", "Delmar", "Delmer", "Demarcus", "Demetrius", "Denis", "Dennis", "Denny", "Denver", "Deon", "Derek", "Derick", "Derrick", "Deshawn", 
        "Desmond", "Devin", "Devon", "Dewayne", "Dewey", "Dewitt", "Dexter", "Dick", "Diego", "Dillon", "Dino", "Dion", "Dirk", "Domenic", "Domingo", "Dominic", 
        "Dominick", "Dominique", "Don", "Donald", "Dong", "Donn", "Donnell", "Donnie", "Donny", "Donovan", "Donte", "Dorian", "Dorsey", "Doug", "Douglas", "Douglass", 
        "Doyle", "Drew", "Duane", "Dudley", "Duncan", "Dustin", "Dusty", "Dwain", "Dwayne", "Dwight", "Dylan", "Earl", "Earle", "Earnest", "Ed", "Eddie", 
        "Eddy", "Edgar", "Edgardo", "Edison", "Edmond", "Edmund", "Edmundo", "Eduardo", "Edward", "Edwardo", "Edwin", "Efrain", "Efren", "Elbert", "Elden", "Eldon", 
        "Eldridge", "Eli", "Elias", "Elijah", "Eliseo", "Elisha", "Elliot", "Elliott", "Ellis", "Ellsworth", "Elmer", "Elmo", "Eloy", "Elroy", "Elton", "Elvin", 
        "Elvis", "Elwood", "Emanuel", "Emerson", "Emery", "Emil", "Emile", "Emilio", "Emmanuel", "Emmett", "Emmitt", "Emory", "Enoch", "Enrique", "Erasmo", "Eric", 
        "Erich", "Erick", "Erik", "Erin", "Ernest", "Ernesto", "Ernie", "Errol", "Ervin", "Erwin", "Esteban", "Ethan", "Eugene", "Eugenio", "Eusebio", "Evan", 
        "Everett", "Everette", "Ezekiel", "Ezequiel", "Ezra", "Fabian", "Faustino", "Fausto", "Federico", "Felipe", "Felix", "Felton", "Ferdinand", "Fermin", "Fernando", "Fidel", 
        "Filiberto", "Fletcher", "Florencio", "Florentino", "Floyd", "Forest", "Forrest", "Foster", "Frances", "Francesco", "Francis", "Francisco", "Frank", "Frankie", "Franklin", "Franklyn", 
        "Fred", "Freddie", "Freddy", "Frederic", "Frederick", "Fredric", "Fredrick", "Freeman", "Fritz", "Gabriel", "Gail", "Gale", "Galen", "Garfield", "Garland", "Garret", 
        "Garrett", "Garry", "Garth", "Gary", "Gaston", "Gavin", "Gayle", "Gaylord", "Genaro", "Gene", "Geoffrey", "George", "Gerald", "Geraldo", "Gerard", "Gerardo", 
        "German", "Gerry", "Gil", "Gilbert", "Gilberto", "Gino", "Giovanni", "Giuseppe", "Glen", "Glenn", "Gonzalo", "Gordon", "Grady", "Graham", "Graig", "Grant", 
        "Granville", "Greg", "Gregg", "Gregorio", "Gregory", "Grover", "Guadalupe", "Guillermo", "Gus", "Gustavo", "Guy", "Hai", "Hal", "Hank", "Hans", "Harlan", 
        "Harland", "Harley", "Harold", "Harris", "Harrison", "Harry", "Harvey", "Hassan", "Hayden", "Haywood", "Heath", "Hector", "Henry", "Herb", "Herbert", "Heriberto", 
        "Herman", "Herschel", "Hershel", "Hilario", "Hilton", "Hipolito", "Hiram", "Hobert", "Hollis", "Homer", "Hong", "Horace", "Horacio", "Hosea", "Houston", "Howard", 
        "Hoyt", "Hubert", "Huey", "Hugh", "Hugo", "Humberto", "Hung", "Hunter", "Hyman", "Ian", "Ignacio", "Ike", "Ira", "Irvin", "Irving", "Irwin", 
        "Isaac", "Isaiah", "Isaias", "Isiah", "Isidro", "Ismael", "Israel", "Isreal", "Issac", "Ivan", "Ivory", "Jacinto", "Jack", "Jackie", "Jackson", "Jacob", 
        "Jacques", "Jae", "Jaime", "Jake", "Jamaal", "Jamal", "Jamar", "Jame", "Jamel", "James", "Jamey", "Jamie", "Jamison", "Jan", "Jared", "Jarod", 
        "Jarred", "Jarrett", "Jarrod", "Jarvis", "Jason", "Jasper", "Javier", "Jay", "Jayson", "Jc", "Jean", "Jed", "Jeff", "Jefferey", "Jefferson", "Jeffery", 
        "Jeffrey", "Jeffry", "Jerald", "Jeramy", "Jere", "Jeremiah", "Jeremy", "Jermaine", "Jerold", "Jerome", "Jeromy", "Jerrell", "Jerrod", "Jerrold", "Jerry", "Jess", 
        "Jesse", "Jessie", "Jesus", "Jewel", "Jewell", "Jim", "Jimmie", "Jimmy", "Joan", "Joaquin", "Jody", "Joe", "Joel", "Joesph", "Joey", "John", 
        "Johnathan", "Johnathon", "Johnie", "Johnnie", "Johnny", "Johnson", "Jon", "Jonah", "Jonas", "Jonathan", "Jonathon", "Jordan", "Jordon", "Jorge", "Jose", "Josef", 
        "Joseph", "Josh", "Joshua", "Josiah", "Jospeh", "Josue", "Juan", "Jude", "Judson", "Jules", "Julian", "Julio", "Julius", "Junior", "Justin", "Kareem", 
        "Karl", "Kasey", "Keenan", "Keith", "Kelley", "Kelly", "Kelvin", "Ken", "Kendall", "Kendrick", "Keneth", "Kenneth", "Kennith", "Kenny", "Kent", "Kenton", 
        "Kermit", "Kerry", "Keven", "Kevin", "Kieth", "Kim", "King", "Kip", "Kirby", "Kirk", "Korey", "Kory", "Kraig", "Kris", "Kristofer", "Kristopher", 
        "Kurt", "Kurtis", "Kyle", "Lacy", "Lamar", "Lamont", "Lance", "Landon", "Lane", "Lanny", "Larry", "Lauren", "Laurence", "Lavern", "Laverne", "Lawerence", 
        "Lawrence", "Lazaro", "Leandro", "Lee", "Leif", "Leigh", "Leland", "Lemuel", "Len", "Lenard", "Lenny", "Leo", "Leon", "Leonard", "Leonardo", "Leonel", 
        "Leopoldo", "Leroy", "Les", "Lesley", "Leslie", "Lester", "Levi", "Lewis", "Lincoln", "Lindsay", "Lindsey", "Lino", "Linwood", "Lionel", "Lloyd", "Logan", 
        "Lon", "Long", "Lonnie", "Lonny", "Loren", "Lorenzo", "Lou", "Louie", "Louis", "Lowell", "Loyd", "Lucas", "Luciano", "Lucien", "Lucio", "Lucius", 
        "Luigi", "Luis", "Luke", "Lupe", "Luther", "Lyle", "Lyman", "Lyndon", "Lynn", "Lynwood", "Mac", "Mack", "Major", "Malcolm", "Malcom", "Malik", 
        "Man", "Manual", "Manuel", "Marc", "Marcel", "Marcelino", "Marcellus", "Marcelo", "Marco", "Marcos", "Marcus", "Margarito", "Maria", "Mariano", "Mario", "Marion", 
        "Mark", "Markus", "Marlin", "Marlon", "Marquis", "Marshall", "Martin", "Marty", "Marvin", "Mary", "Mason", "Mathew", "Matt", "Matthew", "Maurice", "Mauricio", 
        "Mauro", "Max", "Maximo", "Maxwell", "Maynard", "Mckinley", "Mel", "Melvin", "Merle", "Merlin", "Merrill", "Mervin", "Micah", "Michael", "Michal", "Michale", 
        "Micheal", "Michel", "Mickey", "Miguel", "Mike", "Mikel", "Milan", "Miles", "Milford", "Millard", "Milo", "Milton", "Minh", "Miquel", "Mitch", "Mitchel", 
        "Mitchell", "Modesto", "Mohamed", "Mohammad", "Mohammed", "Moises", "Monroe", "Monte", "Monty", "Morgan", "Morris", "Morton", "Mose", "Moses", "Moshe", "Murray", 
        "Myles", "Myron", "Napoleon", "Nathan", "Nathanael", "Nathanial", "Nathaniel", "Neal", "Ned", "Neil", "Nelson", "Nestor", "Neville", "Newton", "Nicholas", "Nick", 
        "Nickolas", "Nicky", "Nicolas", "Nigel", "Noah", "Noble", "Noe", "Noel", "Nolan", "Norbert", "Norberto", "Norman", "Normand", "Norris", "Numbers", "Octavio", 
        "Odell", "Odis", "Olen", "Olin", "Oliver", "Ollie", "Omar", "Omer", "Oren", "Orlando", "Orval", "Orville", "Oscar", "Osvaldo", "Oswaldo", "Otha", 
        "Otis", "Otto", "Owen", "Pablo", "Palmer", "Paris", "Parker", "Pasquale", "Pat", "Patricia", "Patrick", "Paul", "Pedro", "Percy", "Perry", "Pete", 
        "Peter", "Phil", "Philip", "Phillip", "Pierre", "Porfirio", "Porter", "Preston", "Prince", "Quentin", "Quincy", "Quinn", "Quintin", "Quinton", "Rafael", "Raleigh", 
        "Ralph", "Ramiro", "Ramon", "Randal", "Randall", "Randell", "Randolph", "Randy", "Raphael", "Rashad", "Raul", "Ray", "Rayford", "Raymon", "Raymond", "Raymundo", 
        "Reed", "Refugio", "Reggie", "Reginald", "Reid", "Reinaldo", "Renaldo", "Renato", "Rene", "Reuben", "Rex", "Rey", "Reyes", "Reynaldo", "Rhett", "Ricardo", 
        "Rich", "Richard", "Richie", "Rick", "Rickey", "Rickie", "Ricky", "Rico", "Rigoberto", "Riley", "Rob", "Robbie", "Robby", "Robert", "Roberto", "Robin", 
        "Robt", "Rocco", "Rocky", "Rod", "Roderick", "Rodger", "Rodney", "Rodolfo", "Rodrick", "Rodrigo", "Rogelio", "Roger", "Roland", "Rolando", "Rolf", "Rolland", 
        "Roman", "Romeo", "Ron", "Ronald", "Ronnie", "Ronny", "Roosevelt", "Rory", "Rosario", "Roscoe", "Rosendo", "Ross", "Roy", "Royal", "Royce", "Ruben", 
        "Rubin", "Rudolf", "Rudolph", "Rudy", "Rueben", "Rufus", "Rupert", "Russ", "Russel", "Russell", "Rusty", "Ryan", "Sal", "Salvador", "Salvatore", "Sam", 
        "Sammie", "Sammy", "Samual", "Samuel", "Sandy", "Sanford", "Sang", "Santiago", "Santo", "Santos", "Saul", "Scot", "Scott", "Scottie", "Scotty", "Sean", 
        "Sebastian", "Sergio", "Seth", "Seymour", "Shad", "Shane", "Shannon", "Shaun", "Shawn", "Shayne", "Shelby", "Sheldon", "Shelton", "Sherman", "Sherwood", "Shirley", 
        "Shon", "Sid", "Sidney", "Silas", "Simon", "Sol", "Solomon", "Son", "Sonny", "Spencer", "Stacey", "Stacy", "Stan", "Stanford", "Stanley", "Stanton", 
        "Stefan", "Stephan", "Stephen", "Sterling", "Steve", "Steven", "Stevie", "Stewart", "Stuart", "Sung", "Sydney", "Sylvester", "Tad", "Tanner", "Taylor", "Ted", 
        "Teddy", "Teodoro", "Terence", "Terrance", "Terrell", "Terrence", "Terry", "Thad", "Thaddeus", "Thanh", "Theo", "Theodore", "Theron", "Thomas", "Thurman", "Tim", 
        "Timmy", "Timothy", "Titus", "Tobias", "Toby", "Tod", "Todd", "Tom", "Tomas", "Tommie", "Tommy", "Toney", "Tony", "Tory", "Tracey", "Tracy", 
        "Travis", "Trent", "Trenton", "Trevor", "Trey", "Trinidad", "Tristan", "Troy", "Truman", "Tuan", "Ty", "Tyler", "Tyree", "Tyrell", "Tyron", "Tyrone", 
        "Tyson", "Ulysses", "Val", "Valentin", "Valentine", "Van", "Vance", "Vaughn", "Vern", "Vernon", "Vicente", "Victor", "Vince", "Vincent", "Vincenzo", "Virgil", 
        "Virgilio", "Vito", "Von", "Wade", "Waldo", "Walker", "Wallace", "Wally", "Walter", "Walton", "Ward", "Warner", "Warren", "Waylon", "Wayne", "Weldon", 
        "Wendell", "Werner", "Wes", "Wesley", "Weston", "Whitney", "Wilber", "Wilbert", "Wilbur", "Wilburn", "Wiley", "Wilford", "Wilfred", "Wilfredo", "Will", "Willard", 
        "William", "Williams", "Willian", "Willie", "Willis", "Willy", "Wilmer", "Wilson", "Wilton", "Winford", "Winfred", "Winston", "Wm", "Woodrow", "Wyatt", "Xavier", 
        "Yong", "Young", "Zachariah", "Zachary", "Zachery", "Zack", "Zackary", "Zane"
     };
    private static string[] LastNames = new string[] { 
        "Abbott", "Acosta", "Adams", "Adkins", "Aguilar", "Albert", "Alexander", "Alford", "Allen", "Alston", "Alvarado", "Alvarez", "Anderson", "Andrews", "Anthony", "Armstrong", 
        "Arnold", "Ashley", "Atkins", "Atkinson", "Austin", "Avery", "Ayala", "Ayers", "Bailey", "Baird", "Baker", "Baldwin", "Ball", "Ballard", "Banks", "Barber", 
        "Barker", "Barlow", "Barnes", "Barnett", "Barr", "Barrera", "Barrett", "Barron", "Barry", "Bartlett", "Barton", "Bass", "Bates", "Battle", "Bauer", "Baxter", 
        "Beach", "Bean", "Beard", "Beasley", "Beck", "Becker", "Bell", "Bender", "Benjamin", "Bennett", "Benson", "Bentley", "Benton", "Berg", "Berger", "Bernard", 
        "Berry", "Best", "Bird", "Bishop", "Black", "Blackburn", "Blackwell", "Blair", "Blake", "Blanchard", "Blankenship", "Blevins", "Bolton", "Bond", "Bonner", "Booker", 
        "Boone", "Booth", "Bowen", "Bowers", "Bowman", "Boyd", "Boyer", "Boyle", "Bradford", "Bradley", "Bradshaw", "Brady", "Branch", "Bray", "Brennan", "Brewer", 
        "Bridges", "Briggs", "Bright", "Britt", "Brock", "Brooks", "Brown", "Browning", "Bruce", "Bryan", "Bryant", "Buchanan", "Buck", "Buckley", "Buckner", "Bullock", 
        "Burch", "Burgess", "Burke", "Burks", "Burnett", "Burns", "Burris", "Burt", "Burton", "Bush", "Butler", "Byers", "Byrd", "Cabrera", "Cain", "Calderon", 
        "Caldwell", "Calhoun", "Callahan", "Camacho", "Cameron", "Campbell", "Campos", "Cannon", "Cantrell", "Cantu", "Cardenas", "Carey", "Carlson", "Carney", "Carpenter", "Carr", 
        "Carrillo", "Carroll", "Carson", "Carter", "Carver", "Case", "Casey", "Cash", "Castaneda", "Castillo", "Castro", "Cervantes", "Chambers", "Chan", "Chandler", "Chaney", 
        "Chang", "Chapman", "Charles", "Chase", "Chavez", "Chen", "Cherry", "Christensen", "Christian", "Church", "Clark", "Clarke", "Clay", "Clayton", "Clements", "Clemons", 
        "Cleveland", "Cline", "Cobb", "Cochran", "Coffey", "Cohen", "Cole", "Coleman", "Collier", "Collins", "Colon", "Combs", "Compton", "Conley", "Conner", "Conrad", 
        "Contreras", "Conway", "Cook", "Cooke", "Cooley", "Cooper", "Copeland", "Cortez", "Cote", "Cotton", "Cox", "Craft", "Craig", "Crane", "Crawford", "Crosby", 
        "Cross", "Cruz", "Cummings", "Cunningham", "Curry", "Curtis", "Dale", "Dalton", "Daniel", "Daniels", "Daugherty", "Davenport", "David", "Davidson", "Davis", "Dawson", 
        "Day", "Dean", "Decker", "Dejesus", "Delacruz", "Delaney", "Deleon", "Delgado", "Dennis", "Diaz", "Dickerson", "Dickson", "Dillard", "Dillon", "Dixon", "Dodson", 
        "Dominguez", "Donaldson", "Donovan", "Dorsey", "Dotson", "Douglas", "Downs", "Doyle", "Drake", "Dudley", "Duffy", "Duke", "Duncan", "Dunlap", "Dunn", "Duran", 
        "Durham", "Dyer", "Eaton", "Edwards", "Elliott", "Ellis", "Ellison", "Emerson", "England", "English", "Erickson", "Espinoza", "Estes", "Estrada", "Evans", "Everett", 
        "Ewing", "Farley", "Farmer", "Farrell", "Faulkner", "Ferguson", "Fernandez", "Ferrell", "Fields", "Figueroa", "Finch", "Finley", "Fischer", "Fisher", "Fitzgerald", "Fitzpatrick", 
        "Fleming", "Fletcher", "Flores", "Flowers", "Floyd", "Flynn", "Foley", "Forbes", "Ford", "Foreman", "Foster", "Fowler", "Fox", "Francis", "Franco", "Frank", 
        "Franklin", "Franks", "Frazier", "Frederick", "Freeman", "French", "Frost", "Fry", "Frye", "Fuentes", "Fuller", "Fulton", "Gaines", "Gallagher", "Gallegos", "Galloway", 
        "Gamble", "Garcia", "Gardner", "Garner", "Garrett", "Garrison", "Garza", "Gates", "Gay", "Gentry", "George", "Gibbs", "Gibson", "Gilbert", "Giles", "Gill", 
        "Gillespie", "Gilliam", "Gilmore", "Glass", "Glenn", "Glover", "Goff", "Golden", "Gomez", "Gonzales", "Gonzalez", "Good", "Goodman", "Goodwin", "Gordon", "Gould", 
        "Graham", "Grant", "Graves", "Gray", "Green", "Greene", "Greer", "Gregory", "Griffin", "Griffith", "Grimes", "Gross", "Guerra", "Guerrero", "Guthrie", "Gutierrez", 
        "Guy", "Guzman", "Hahn", "Hale", "Haley", "Hall", "Hamilton", "Hammond", "Hampton", "Hancock", "Haney", "Hansen", "Hanson", "Hardin", "Harding", "Hardy", 
        "Harmon", "Harper", "Harrell", "Harrington", "Harris", "Harrison", "Hart", "Hartman", "Harvey", "Hatfield", "Hawkins", "Hayden", "Hayes", "Haynes", "Hays", "Head", 
        "Heath", "Hebert", "Henderson", "Hendricks", "Hendrix", "Henry", "Hensley", "Henson", "Herman", "Hernandez", "Herrera", "Herring", "Hess", "Hester", "Hewitt", "Hickman", 
        "Hicks", "Higgins", "Hill", "Hines", "Hinton", "Hobbs", "Hodge", "Hodges", "Hoffman", "Hogan", "Holcomb", "Holden", "Holder", "Holland", "Holloway", "Holman", 
        "Holmes", "Holt", "Hood", "Hooper", "Hoover", "Hopkins", "Hopper", "Horn", "Horne", "Horton", "House", "Houston", "Howard", "Howe", "Howell", "Hubbard", 
        "Huber", "Hudson", "Huff", "Huffman", "Hughes", "Hull", "Humphrey", "Hunt", "Hunter", "Hurley", "Hurst", "Hutchinson", "Hyde", "Ingram", "Irwin", "Jackson", 
        "Jacobs", "Jacobson", "James", "Jarvis", "Jefferson", "Jenkins", "Jennings", "Jensen", "Jimenez", "Johns", "Johnson", "Johnston", "Jones", "Jordan", "Joseph", "Joyce", 
        "Joyner", "Juarez", "Justice", "Kane", "Kaufman", "Keith", "Keller", "Kelley", "Kelly", "Kemp", "Kennedy", "Kent", "Kerr", "Key", "Kidd", "Kim", 
        "King", "Kinney", "Kirby", "Kirk", "Kirkland", "Klein", "Kline", "Knapp", "Knight", "Knowles", "Knox", "Koch", "Kramer", "Lamb", "Lambert", "Lancaster", 
        "Landry", "Lane", "Lang", "Langley", "Lara", "Larsen", "Larson", "Lawrence", "Lawson", "Le", "Leach", "Leblanc", "Lee", "Leon", "Leonard", "Lester", 
        "Levine", "Levy", "Lewis", "Lindsay", "Lindsey", "Little", "Livingston", "Lloyd", "Logan", "Long", "Lopez", "Lott", "Love", "Lowe", "Lowery", "Lucas", 
        "Luna", "Lynch", "Lynn", "Lyons", "Macdonald", "Macias", "Mack", "Madden", "Maddox", "Maldonado", "Malone", "Mann", "Manning", "Marks", "Marquez", "Marsh", 
        "Marshall", "Martin", "Martinez", "Mason", "Massey", "Mathews", "Mathis", "Matthews", "Maxwell", "May", "Mayer", "Maynard", "Mayo", "Mays", "McBride", "McCall", 
        "McCarthy", "McCarty", "McClain", "McClure", "McConnell", "McCormick", "McCoy", "McCray", "McCullough", "McDaniel", "McDonald", "McDowell", "McFadden", "McFarland", "McGee", "McGowan", 
        "McGuire", "McIntosh", "McIntyre", "McKay", "McKee", "McKenzie", "McKinney", "McKnight", "McLaughlin", "Mclean", "McLeod", "McMahon", "McMillan", "McNeil", "McPherson", "Meadows", 
        "Medina", "Mejia", "Melendez", "Melton", "Mendez", "Mendoza", "Mercado", "Mercer", "Merrill", "Merritt", "Meyer", "Meyers", "Michael", "Middleton", "Miles", "Miller", 
        "Mills", "Miranda", "Mitchell", "Molina", "Monroe", "Montgomery", "Montoya", "Moody", "Moon", "Mooney", "Moore", "Morales", "Moran", "Moreno", "Morgan", "Morin", 
        "Morris", "Morrison", "Morrow", "Morse", "Morton", "Moses", "Mosley", "Moss", "Mueller", "Mullen", "Mullins", "Munoz", "Murphy", "Murray", "Myers", "Nash", 
        "Navarro", "Neal", "Nelson", "Newman", "Newton", "Nguyen", "Nichols", "Nicholson", "Nielsen", "Nieves", "Nixon", "Noble", "Noel", "Nolan", "Norman", "Norris", 
        "Norton", "Nunez", "OBrien", "Ochoa", "OConnor", "Odom", "Odonnell", "Oliver", "Olsen", "Olson", "Oneal", "Oneil", "Oneill", "Orr", "Ortega", "Ortiz", 
        "Osborn", "Osborne", "Owen", "Owens", "Pace", "Pacheco", "Padilla", "Page", "Palmer", "Park", "Parker", "Parks", "Parrish", "Parsons", "Pate", "Patel", 
        "Patrick", "Patterson", "Patton", "Paul", "Payne", "Pearson", "Peck", "Pena", "Pennington", "Perez", "Perkins", "Perry", "Peters", "Petersen", "Peterson", "Petty", 
        "Phelps", "Phillips", "Pickett", "Pierce", "Pittman", "Pitts", "Pollard", "Poole", "Pope", "Porter", "Potter", "Potts", "Powell", "Powers", "Pratt", "Preston", 
        "Price", "Prince", "Pruitt", "Puckett", "Pugh", "Quinn", "Ramirez", "Ramos", "Ramsey", "Randall", "Randolph", "Rasmussen", "Ratliff", "Ray", "Raymond", "Reed", 
        "Reese", "Reeves", "Reid", "Reilly", "Reyes", "Reynolds", "Rhodes", "Rice", "Rich", "Richard", "Richards", "Richardson", "Richmond", "Riddle", "Riggs", "Riley", 
        "Rios", "Rivas", "Rivera", "Rivers", "Roach", "Robbins", "Roberson", "Roberts", "Robertson", "Robinson", "Robles", "Rocha", "Rodgers", "Rodriguez", "Rodriquez", "Rogers", 
        "Rojas", "Rollins", "Roman", "Romero", "Rosa", "Rosales", "Rosario", "Rose", "Ross", "Roth", "Rowe", "Rowland", "Roy", "Ruiz", "Rush", "Russell", 
        "Russo", "Rutledge", "Ryan", "Salas", "Salazar", "Salinas", "Sampson", "Sanchez", "Sanders", "Sandoval", "Sanford", "Santana", "Santiago", "Santos", "Sargent", "Saunders", 
        "Savage", "Sawyer", "Schmidt", "Schneider", "Schroeder", "Schultz", "Schwartz", "Scott", "Sears", "Sellers", "Serrano", "Sexton", "Shaffer", "Shannon", "Sharp", "Sharpe", 
        "Shaw", "Shelton", "Shepard", "Shepherd", "Sheppard", "Sherman", "Shields", "Short", "Silva", "Simmons", "Simon", "Simpson", "Sims", "Singleton", "Skinner", "Slater", 
        "Sloan", "Small", "Smith", "Snider", "Snow", "Snyder", "Solis", "Solomon", "Sosa", "Soto", "Sparks", "Spears", "Spence", "Spencer", "Stafford", "Stanley", 
        "Stanton", "Stark", "Steele", "Stein", "Stephens", "Stephenson", "Stevens", "Stevenson", "Stewart", "Stokes", "Stone", "Stout", "Strickland", "Strong", "Stuart", "Suarez", 
        "Sullivan", "Summers", "Sutton", "Swanson", "Sweeney", "Sweet", "Sykes", "Talley", "Tanner", "Tate", "Taylor", "Terrell", "Terry", "Thomas", "Thompson", "Thornton", 
        "Tillman", "Todd", "Torres", "Townsend", "Tran", "Travis", "Trevino", "Trujillo", "Tucker", "Turner", "Tyler", "Tyson", "Underwood", "Valdez", "Valencia", "Valentine", 
        "Valenzuela", "Vance", "Vang", "Vargas", "Vasquez", "Vaughan", "Vaughn", "Vazquez", "Vega", "Velasquez", "Velazquez", "Velez", "Villarreal", "Vincent", "Vinson", "Wade", 
        "Wagner", "Walker", "Wall", "Wallace", "Waller", "Walls", "Walsh", "Walter", "Walters", "Walton", "Ward", "Ware", "Warner", "Warren", "Washington", "Waters", 
        "Watkins", "Watson", "Watts", "Weaver", "Webb", "Weber", "Webster", "Weeks", "Weiss", "Welch", "Wells", "West", "Wheeler", "Whitaker", "White", "Whitehead", 
        "Whitfield", "Whitley", "Whitney", "Wiggins", "Wilcox", "Wilder", "Wiley", "Wilkerson", "Wilkins", "Wilkinson", "William", "Williams", "Williamson", "Willis", "Wilson", "Winters", 
        "Wise", "Witt", "Wolf", "Wolfe", "Wong", "Wood", "Woodard", "Woods", "Woodward", "Wooten", "Workman", "Wright", "Wyatt", "Wynn", "Yang", "Yates", 
        "York", "Young", "Zamora", "Zimmerman"
     };

    #endregion


    private static Random WingtipRandom = new Random(Guid.NewGuid().GetHashCode());

    // Methods
    public static IEnumerable<MyContact> GetContactList() {
      return GetContactList(10);
    }

    public static IEnumerable<MyContact> GetContactList(int ContactCount) {
      return GetContactList(ContactCount, true);
    }

    public static IEnumerable<MyContact> GetContactList(int ContactCount, bool Predictable) {
      if (Predictable) {
        WingtipRandom = new Random(7);
      }
      else {
        WingtipRandom = new Random(Guid.NewGuid().GetHashCode());
      }
      List<MyContact> list = new List<MyContact>(ContactCount);
      for (int i = 1; i <= ContactCount; i++) {
        list.Add(GetRandomContact());
      }
      return list;
    }

    public static IEnumerable<MyContact> GetContactList(int ContactCount, int Seed) {
      WingtipRandom = new Random(Seed);
      List<MyContact> list = new List<MyContact>(ContactCount);
      for (int i = 1; i <= ContactCount; i++) {
        list.Add(GetRandomContact());
      }
      return list;
    }

    private static string GetRandomAreaCode() {
      int index = WingtipRandom.Next(0, AreaCodes.Length);
      return AreaCodes[index];
    }

    private static string GetRandomCompany() {
      int index = WingtipRandom.Next(0, CompanyNames.Length);
      return CompanyNames[index];
    }

    public static MyContact GetRandomContact() {
      string AreaCode = GetRandomAreaCode();
      string FirstName = GetRandomFirstName();
      string LastName = GetRandomLastName();
      string Company = GetRandomCompany();
      string Code = GetRandomAreaCode();
      string WorkPhoneNumber = GetRandomPhoneNumber(AreaCode);
      string HomePhoneNumber = GetRandomPhoneNumber(AreaCode);
      string Email = (FirstName + "." + LastName + "@" + Company + ".com").Replace(" ", "").Replace("'", "");
      return new MyContact { GivenName = FirstName, Surname = LastName, CompanyName = Company, BusinessPhone = WorkPhoneNumber, HomePhone = HomePhoneNumber, EmailAddress = Email};
    }

    private static string GetRandomFirstName() {
      int index = WingtipRandom.Next(0, FirstNames.Length);
      return FirstNames[index];
    }

    private static string GetRandomLastName() {
      int index = WingtipRandom.Next(0, LastNames.Length);
      return LastNames[index];
    }

    private static string GetRandomPhoneNumber() {
      return ("1(" + WingtipRandom.Next(2, 9).ToString() + WingtipRandom.Next(0, 9).ToString() + WingtipRandom.Next(0, 9).ToString() + ")" + WingtipRandom.Next(2, 9).ToString() + WingtipRandom.Next(0, 9).ToString() + WingtipRandom.Next(0, 9).ToString() + "-" + WingtipRandom.Next(0, 9).ToString() + WingtipRandom.Next(0, 9).ToString() + WingtipRandom.Next(0, 9).ToString() + WingtipRandom.Next(0, 9).ToString());
    }

    private static string GetRandomPhoneNumber(string AreaCode) {
      return ("1(" + AreaCode + ")" + WingtipRandom.Next(2, 9).ToString() + WingtipRandom.Next(0, 9).ToString() + WingtipRandom.Next(0, 9).ToString() + "-" + WingtipRandom.Next(0, 9).ToString() + WingtipRandom.Next(0, 9).ToString() + WingtipRandom.Next(0, 9).ToString() + WingtipRandom.Next(0, 9).ToString());
    }

  }
}
