//
//  Copyright (c) 2014 MS-OpenTech All rights reserved.
//

#import "CreateViewController.h"
#import "ProjectClient.h"

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
    if(![self.FileNameTxt.text isEqualToString:@""]){
        double x = ((self.navigationController.view.frame.size.width) - 20)/ 2;
        double y = ((self.navigationController.view.frame.size.height) - 150)/ 2;
        UIActivityIndicatorView* spinner = [[UIActivityIndicatorView alloc]initWithFrame:CGRectMake(x, y, 20, 20)];
        spinner.activityIndicatorViewStyle = UIActivityIndicatorViewStyleGray;
        [self.view addSubview:spinner];
        spinner.hidesWhenStopped = YES;
        [spinner startAnimating];
        
        ProjectClient* client = [[ProjectClient alloc] init];
        
        NSURLSessionTask* task = [client addProject:self.FileNameTxt.text token:self.token callback:^(NSError *error) {
            if(error == nil){
                dispatch_async(dispatch_get_main_queue(), ^{
                    [spinner stopAnimating];
                    [self.navigationController popViewControllerAnimated:YES];
                });
            }else{
                NSString *errorMessage = [@"Add Project failed. Reason: " stringByAppendingString: error.description];
                [self showMessage:errorMessage withTitle:@"Error"];
            }
        }];
        [task resume];
    }else{
        dispatch_async(dispatch_get_main_queue(), ^{
            [self showMessage:@"Complete all fields" withTitle:@"Success"];
        });
    }
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
