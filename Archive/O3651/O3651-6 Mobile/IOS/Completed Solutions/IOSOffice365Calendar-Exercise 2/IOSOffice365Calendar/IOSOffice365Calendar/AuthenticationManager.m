//
//  AuthenticationManager.m
//  IOSOffice365Calendar
//
//  Created by Microsoft on 1/4/16.
//  Copyright © 2016 Microsoft. All rights reserved.
//

#import "AuthenticationManager.h"

@interface AuthenticationManager ()
@property (strong,    nonatomic) ADAuthenticationContext *authContext;
@property (readonly, nonatomic) NSURL    *redirectURL;
@property (readonly, nonatomic) NSString *authority;
@property (readonly, nonatomic) NSString *clientId;
@end

@implementation AuthenticationManager

-(instancetype)init
{
    self = [super init];
    if (self) {
        //Azure AD account info
        NSString* plistPath = [[NSBundle mainBundle] pathForResource:@"Auth" ofType:@"plist"];
        NSDictionary *content = [NSDictionary dictionaryWithContentsOfFile:plistPath];
        _authority = [content objectForKey:@"authority"];
        _clientId = [content objectForKey:@"clientId"];
        _redirectURL = [NSURL URLWithString:[content objectForKey:@"redirectUriString"]];
    }
    return self;
}

+(AuthenticationManager *)sharedInstance
{
    static AuthenticationManager *sharedInstance;
    static dispatch_once_t onceToken;
    // Initialize the AuthenticationManager only once.
    dispatch_once(&onceToken, ^{
        sharedInstance = [[AuthenticationManager alloc] init];
    });
    return sharedInstance;
}

-(void)acquireAuthTokenWithResourceId:(NSString *)resourceId completionHandler:(void (^)(BOOL authenticated, NSString* accessToken))completionBlock
{
    ADAuthenticationError *error;
    self.authContext = [ADAuthenticationContext authenticationContextWithAuthority:self.authority error:&error];
    [self.authContext acquireTokenWithResource:resourceId
                                      clientId:self.clientId
                                   redirectUri:self.redirectURL
                               completionBlock:^(ADAuthenticationResult *result) {
                                   if (AD_SUCCEEDED != result.status) {
                                       completionBlock(NO, nil);
                                   }
                                   else {
                                       completionBlock(YES, result.accessToken);
                                   }
                               }];
}

-(void)clearCredentials{
    id<ADTokenCacheStoring> cache = [ADAuthenticationSettings sharedInstance].defaultTokenCacheStore;
    ADAuthenticationError *error;
    if ([[cache allItemsWithError:&error] count] > 0)
        [cache removeAllWithError:&error];
    NSHTTPCookieStorage *cookieStore = [NSHTTPCookieStorage sharedHTTPCookieStorage];
    for (NSHTTPCookie *cookie in cookieStore.cookies) {
        [cookieStore deleteCookie:cookie];
    }
}
@end
