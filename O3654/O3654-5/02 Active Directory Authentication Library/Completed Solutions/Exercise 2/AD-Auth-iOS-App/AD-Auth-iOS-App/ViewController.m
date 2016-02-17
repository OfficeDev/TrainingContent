//
//  ViewController.m
//  AD-Auth-iOS-App
//
//  Created by canviz on 1/20/16.
//  Copyright © 2016 Microsoft. All rights reserved.
//

#import "ViewController.h"

#import <ADALiOS/ADAL.h>

@interface ViewController ()

@end

@implementation ViewController
ADAuthenticationContext* authContext;
NSString* authority;
NSString* redirectUriString;
NSString* resourceId;
NSString* clientId;
NSString* token;

- (void)viewDidLoad {
    [super viewDidLoad];
    
    //Azure AD account info
    NSString* plistPath = [[NSBundle mainBundle] pathForResource:@"Auth" ofType:@"plist"];
    NSDictionary *content = [NSDictionary dictionaryWithContentsOfFile:plistPath];
    
    authority = [content objectForKey:@"authority"];
    resourceId = [content objectForKey:@"resourceId"];
    clientId = [content objectForKey:@"clientId"];
    redirectUriString = [content objectForKey:@"redirectUriString"];
}

-(void) getToken : (BOOL) clearCache completionHandler:(void (^) (NSString*))completionBlock;
{
    ADAuthenticationError *error;
    authContext = [ADAuthenticationContext authenticationContextWithAuthority:authority error:&error];
    NSURL *redirectUri = [NSURL URLWithString:redirectUriString];
    if(clearCache){
        [authContext.tokenCacheStore removeAllWithError:nil];
    }
    [authContext acquireTokenWithResource:resourceId clientId:clientId redirectUri:redirectUri completionBlock:^(ADAuthenticationResult *result) {
        if (AD_SUCCEEDED != result.status){
            // display error on the screen
            NSLog(@"Error in the authentication");
            [self showMessage:@"Authentication failed. Check the log for errors." withTitle:@"Error"];
        }
        else{
            completionBlock(result.accessToken);
        }
    }];
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

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}
- (IBAction)loginAction:(id)sender {
    [self getToken:FALSE completionHandler:^(NSString *token){
        dispatch_async(dispatch_get_main_queue(), ^{
            [self showMessage:@"Authentication Succeeded." withTitle:@"Success"];
        });
    }];
}

- (IBAction)clearAction:(id)sender {
    ADAuthenticationError* error;
    id<ADTokenCacheStoring> cache = [ADAuthenticationSettings sharedInstance].defaultTokenCacheStore;
    NSArray* allItems = [cache allItemsWithError:&error];
    if (allItems.count > 0)
    {
        [cache removeAllWithError:&error];
    }
    if (error)
    {
        dispatch_async(dispatch_get_main_queue(), ^{
            NSString *errorMessage = [@"Clear cache failed. Reason: " stringByAppendingString: error.errorDetails];
            [self showMessage:errorMessage withTitle:@"Error"];
        });
        return;
    }
    NSHTTPCookieStorage* cookieStorage = [NSHTTPCookieStorage sharedHTTPCookieStorage];
    NSArray* cookies = cookieStorage.cookies;
    if (cookies.count)
    {
        for(NSHTTPCookie* cookie in cookies)
        {
            [cookieStorage deleteCookie:cookie];
        }
    }
    dispatch_async(dispatch_get_main_queue(), ^{
        [self showMessage:@"Cookies Cleared" withTitle:@"Success"];
    });
}
@end
