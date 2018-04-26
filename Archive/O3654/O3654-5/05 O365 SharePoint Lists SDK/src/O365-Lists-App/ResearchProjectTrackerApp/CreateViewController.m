//
//  Copyright (c) 2014 MS-OpenTech All rights reserved.
//

#import "CreateViewController.h"


@implementation CreateViewController

#pragma mark -
#pragma mark Default Methods
-(void)viewDidLoad{
    [super viewDidLoad];
}

#pragma mark -
#pragma mark Create Actions
- (IBAction)createProject:(id)sender {
    [self createProject];
}

-(void)createProject{
    [self.navigationController popViewControllerAnimated:TRUE ];
}

@end