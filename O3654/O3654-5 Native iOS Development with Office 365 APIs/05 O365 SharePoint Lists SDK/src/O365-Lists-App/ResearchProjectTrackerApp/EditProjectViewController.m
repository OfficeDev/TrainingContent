//
//  Copyright (c) 2014 MS-OpenTech All rights reserved.
//

#import "EditProjectViewController.h"
#import "ProjectTableViewController.h"

@implementation EditProjectViewController
#pragma mark -
#pragma mark Default Methods
-(void)viewDidLoad{
    [super viewDidLoad];
    
    self.ProjectNameTxt.text = @"aProject";
    self.navigationController.title = @"Edit Project";
}

#pragma mark -
#pragma mark Edit actions
- (IBAction)editProject:(id)sender {
    [self updateProject];
}
-(void)updateProject{
}

#pragma mark -
#pragma mark Delete Actions
-(IBAction)deleteProject:(id)sender {
    [self deleteProject];
}
-(void)deleteProject{
}

@end