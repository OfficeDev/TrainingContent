#import "ViewController.h"
#import <QuartzCore/QuartzCore.h>
#import "FileListViewController.h"

@interface ViewController ()
@property (strong, nonatomic) ADAuthenticationContext* authContext;
@property (strong, nonatomic) NSString* authority;
@property (strong, nonatomic) NSString* redirectUriString;
@property (strong, nonatomic) NSString* resourceId;
@property (strong, nonatomic) NSString* clientId;
@property (strong, nonatomic) NSString* token;
@end

@implementation ViewController



- (void)viewDidLoad {
    [super viewDidLoad];
    
    [self.navigationController.navigationBar setBackgroundImage:[UIImage new]
                                                  forBarMetrics:UIBarMetricsDefault];
    self.navigationController.navigationBar.shadowImage = [UIImage new];
    self.navigationController.navigationBar.translucent = YES;
    self.navigationController.view.backgroundColor = [UIColor clearColor];
    

    
    NSString* plistPath = [[NSBundle mainBundle] pathForResource:@"Auth" ofType:@"plist"];
    NSDictionary *content = [NSDictionary dictionaryWithContentsOfFile:plistPath];
    
    _authority = [content objectForKey:@"authority"];
    _resourceId = [content objectForKey:@"resourceId"];
    _clientId = [content objectForKey:@"clientId"];
    _redirectUriString = [content objectForKey:@"redirectUriString"];

}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}

-(void) getToken : (BOOL) clearCache completionHandler:(void (^) (NSString*))completionBlock;
{
    ADAuthenticationError *error;
    _authContext = [ADAuthenticationContext authenticationContextWithAuthority:_authority
                                                                        error:&error];
    
    NSURL *redirectUri = [NSURL URLWithString:_redirectUriString];
    
    if(clearCache){
        [_authContext.tokenCacheStore removeAllWithError:nil];
    }
    
    [_authContext acquireTokenWithResource:_resourceId
                                 clientId:_clientId
                              redirectUri:redirectUri
                          completionBlock:^(ADAuthenticationResult *result) {
                              if (AD_SUCCEEDED != result.status){
                                  // display error on the screen
                                  dispatch_async(dispatch_get_main_queue(), ^{
                                      NSString *errorMessage = [@"Login failed. Reason: " stringByAppendingString: result.error.errorDetails];
                                      [self showMessage:errorMessage withTitle:@"Error"];
                                  });
                              }
                              else{
                                  completionBlock(result.accessToken);
                              }
                          }];
}

- (IBAction)loginAction:(UIButton *)sender{
    [self getToken:FALSE completionHandler:^(NSString *t){
        dispatch_async(dispatch_get_main_queue(), ^{
            _token = t;
            
            FileListViewController *controller = [[UIStoryboard storyboardWithName:@"Main" bundle:nil] instantiateViewControllerWithIdentifier:@"fileList"];
            
            [self.navigationController pushViewController:controller animated:YES];
        });
    }];
}

- (IBAction)clearAction:(UIButton *)sender  {
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
