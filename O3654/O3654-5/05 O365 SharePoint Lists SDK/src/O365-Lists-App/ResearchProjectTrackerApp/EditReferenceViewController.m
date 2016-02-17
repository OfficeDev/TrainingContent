//
//  Copyright (c) 2014 MS-OpenTech All rights reserved.
//

#import "EditReferenceViewController.h"
#import "ProjectDetailsViewController.h"

@interface EditReferenceViewController ()

@end

@implementation EditReferenceViewController

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
    self.navigationController.title = @"Edit Reference";
    self.navigationController.view.backgroundColor = nil;
    
    self.referenceUrlTxt.text = @"Url";
    
    self.referenceDescription.text = @"Description";
    self.referenceTitle.text = @"aReference";
}
- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark -
#pragma mark Edit  Actions
-(IBAction)editReference:(id)sender {
    [self updateReference];
}
-(void)updateReference{
}

#pragma mark -
#pragma mark Delete Actions
- (IBAction)deleteReference:(id)sender {
    [self deleteReference];
}
-(void)deleteReference{
}


@end
