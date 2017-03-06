//
//  CalendarTableViewController.m
//  IOSOffice365Calendar
//
//  Created by Microsoft on 12/24/15.
//  Copyright © 2015 MS Open Tech. All rights reserved.
//

#import "CalendarTableViewController.h"

@interface CalendarTableViewController ()

@end

@implementation CalendarTableViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.eventsList = [[NSMutableArray alloc] init];
    [self getEvents];
}


- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


-(void)getEvents
{
    self.eventsList = [[NSMutableArray alloc] init];
}

- (UIImage *)imageWithColor:(UIColor *)color {
    CGRect rect = CGRectMake(0.0f, 0.0f, 1.0f, 1.0f);
    UIGraphicsBeginImageContext(rect.size);
    CGContextRef context = UIGraphicsGetCurrentContext();
    
    CGContextSetFillColorWithColor(context, [color CGColor]);
    CGContextFillRect(context, rect);
    
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return image;
}
-(NSString *)converStringToDateString:(NSString *)stringDate
{
    NSString *result = @"";
    
    NSDateFormatter *retdateFormat = [[NSDateFormatter alloc] init];
    [retdateFormat setDateFormat:@"yyyy'/'MM'/'dd HH':'mm"];
    
    
    NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
    [formatter setDateFormat:@"yyyy-MM-dd'T'HH:mm:ss.SSSSSSS"];
    NSDate *convertData =[formatter dateFromString:stringDate];
    
    result = [retdateFormat stringFromDate:convertData];
    
    return result;
}


- (UIView *)tableView:(UITableView *)tableView viewForHeaderInSection:(NSInteger)section{
    
    UIView *view = [[UIView alloc] initWithFrame:CGRectMake(0, 20, 300, 200)];
    
    UIButton* actionButton = [UIButton buttonWithType:UIButtonTypeCustom];
    [actionButton setFrame:CGRectMake(15, 15, 100, 40)];
    [actionButton setBackgroundImage:[self imageWithColor:[UIColor grayColor]] forState:UIControlStateNormal];
    [actionButton  setTitle:@"Reload" forState:UIControlStateNormal];
    [actionButton  addTarget:self action:@selector(getEvents) forControlEvents:UIControlEventTouchUpInside];
    [view addSubview:actionButton];
    
    NSString *lbl1str = @"The events in the last 30 days.";
    UILabel *lbl1 = [[UILabel alloc] initWithFrame:CGRectMake(15, 55, 280, 30)];
    lbl1.text = lbl1str;
    lbl1.textAlignment = NSTextAlignmentLeft;
    lbl1.font = [UIFont systemFontOfSize:16];
    lbl1.textColor = [UIColor colorWithRed:136.00f/255.00f green:136.00f/255.00f blue:136.00f/255.00f alpha:1];
    [view addSubview:lbl1];
    
    


    
    return view;
    
}


#pragma mark - Table view data source

- (CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section
{
   return 100;
}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return [self.eventsList count];
}


- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    
    static NSString *CellIdentifier = @"eventCellTableViewCell";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
    
    // Configure the cell...
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:CellIdentifier];
    }
    return cell;
}


/*
// Override to support conditional editing of the table view.
- (BOOL)tableView:(UITableView *)tableView canEditRowAtIndexPath:(NSIndexPath *)indexPath {
    // Return NO if you do not want the specified item to be editable.
    return YES;
}
*/

/*
// Override to support editing the table view.
- (void)tableView:(UITableView *)tableView commitEditingStyle:(UITableViewCellEditingStyle)editingStyle forRowAtIndexPath:(NSIndexPath *)indexPath {
    if (editingStyle == UITableViewCellEditingStyleDelete) {
        // Delete the row from the data source
        [tableView deleteRowsAtIndexPaths:@[indexPath] withRowAnimation:UITableViewRowAnimationFade];
    } else if (editingStyle == UITableViewCellEditingStyleInsert) {
        // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
    }   
}
*/

/*
// Override to support rearranging the table view.
- (void)tableView:(UITableView *)tableView moveRowAtIndexPath:(NSIndexPath *)fromIndexPath toIndexPath:(NSIndexPath *)toIndexPath {
}
*/

/*
// Override to support conditional rearranging of the table view.
- (BOOL)tableView:(UITableView *)tableView canMoveRowAtIndexPath:(NSIndexPath *)indexPath {
    // Return NO if you do not want the item to be re-orderable.
    return YES;
}
*/

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
