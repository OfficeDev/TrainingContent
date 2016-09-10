//
//  ViewController.m
//  IOSOffice365Calendar
//
//  Created by Microsoft on 1/4/16.
//  Copyright © 2016 Microsoft. All rights reserved.
//

#import "LoginViewController.h"
@implementation LoginViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
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


-(IBAction)loginAction:(id)sender{
    NSString* plistPath = [[NSBundle mainBundle] pathForResource:@"Auth" ofType:@"plist"];
    NSDictionary *content = [NSDictionary dictionaryWithContentsOfFile:plistPath];
    NSString* graphResourceId= [content objectForKey:@"resourceId"];
    AuthenticationManager *authenticationManager = [AuthenticationManager sharedInstance];
    [authenticationManager acquireAuthTokenWithResourceId:graphResourceId
                                        completionHandler:^(BOOL authenticated, NSString* accessToken) {
                                            if(authenticated){
                                                dispatch_async(dispatch_get_main_queue(), ^{
                                                    [self showMessage:@"Authentication Succeeded." withTitle:@"Success"];
                                                });
                                            }
                                            else{
                                                dispatch_async(dispatch_get_main_queue(), ^{
                                                    NSLog(@"Error in the authentication");
                                                    [self showMessage:@"Authentication failed. Check the log for errors." withTitle:@"Error"];
                                                });
                                            }
                                        }];
}
-(IBAction)clearAction:(id)sender{
    AuthenticationManager *authenticationManager = [AuthenticationManager sharedInstance];
    [authenticationManager clearCredentials];
    [self showMessage:@"Cookies Cleared" withTitle:@"Success"];
}
@end
