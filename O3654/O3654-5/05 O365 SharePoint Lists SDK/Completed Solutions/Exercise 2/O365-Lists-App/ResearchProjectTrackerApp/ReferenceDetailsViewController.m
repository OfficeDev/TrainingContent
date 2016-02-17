//
//  Copyright (c) 2014 MS-OpenTech All rights reserved.
//

#import "ReferenceDetailsViewController.h"
#import "ReferenceDetailTableCellTableViewCell.h"
#import "EditReferenceViewController.h"

@interface ReferenceDetailsViewController ()

@end

@implementation ReferenceDetailsViewController

#pragma  mark -
#pragma mark Default Methods
- (void)viewDidLoad
{
    [super viewDidLoad];
    [self.navigationController.navigationBar setBackgroundImage:nil
                                                  forBarMetrics:UIBarMetricsDefault];
    self.navigationController.navigationBar.shadowImage = nil;
    self.navigationController.navigationBar.translucent = NO;
    self.navigationController.view.backgroundColor = nil;
    self.urlTableCell.scrollEnabled = NO;
    
    self.descriptionLbl.numberOfLines = 0;
    [self.descriptionLbl sizeToFit];
    self.descriptionLbl.text = @"";
    self.navigationItem.title = @"aProject";
}
- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

#pragma mark -
#pragma mark Forward Navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender{
    if ([segue.identifier isEqualToString:@"editReference"]){
        EditReferenceViewController *controller = (EditReferenceViewController *)segue.destinationViewController;
        controller.token = self.token;
        
    }
}

#pragma mark -
#pragma mark Table actions
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    return 1;
}
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    NSString* identifier = @"referenceDetailsTableCell";
    ReferenceDetailTableCellTableViewCell *cell =[tableView dequeueReusableCellWithIdentifier: identifier ];
    
    cell.urlContentLBL.text = @"Url";
    
    return cell;
}
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    //Open the url in safari
    NSURL *url = [NSURL URLWithString:@"http://www.microsoft.com"];
    
    if (![[UIApplication sharedApplication] openURL:url]) {
        NSLog(@"%@%@",@"Failed to open url:",[url description]);
    }
}

@end
