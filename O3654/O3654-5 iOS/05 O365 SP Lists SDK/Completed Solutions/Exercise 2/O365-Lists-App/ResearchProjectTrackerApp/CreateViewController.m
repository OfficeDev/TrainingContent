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
-(void)showMessage:(NSString*)message withTitle:(NSString *)title
{
    
    UIAlertController * alert=   [UIAlertController
                                  alertControllerWithTitle:title
                                  message:message
                                  preferredStyle:UIAlertControllerStyleAlert];
    
    UIAlertAction* yesButton = [UIAlertAction
                                actionWithTitle:@"OK"
                                style:UIAlertActionStyleDefault
                                handler:^(UIAlertAction * action)
                                {
                                    [alert dismissViewControllerAnimated:YES completion:nil];
                                    
                                }];
    
    [alert addAction:yesButton];
    
    [self presentViewController:alert animated:YES completion:nil];
}
@end
