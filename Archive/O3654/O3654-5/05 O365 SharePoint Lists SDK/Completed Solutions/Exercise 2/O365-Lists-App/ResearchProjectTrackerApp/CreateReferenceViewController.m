//
//  Copyright (c) 2014 MS-OpenTech All rights reserved.
//

#import "CreateReferenceViewController.h"

@interface CreateReferenceViewController ()

@end

@implementation CreateReferenceViewController


//ViewController actions
#pragma mark -
#pragma mark Default Methods
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}
- (void)viewDidLoad
{
    [super viewDidLoad];
    
    [self.navigationController.navigationBar setBackgroundImage:nil
                                                  forBarMetrics:UIBarMetricsDefault];
    self.navigationController.navigationBar.shadowImage = nil;
    self.navigationController.navigationBar.translucent = NO;
    self.navigationController.view.backgroundColor = nil;
}
- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}



#pragma mark -
#pragma mark Create Reference
- (IBAction)createReference:(id)sender {
    [self createReference];
}
-(void)createReference{
}


@end
