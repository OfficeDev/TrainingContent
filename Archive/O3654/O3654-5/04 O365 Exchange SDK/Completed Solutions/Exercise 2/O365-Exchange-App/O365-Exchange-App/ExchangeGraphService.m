//
//  ExchangeGraphService.m
//  O365-Exchange-App
//
//  Created by Microsoft on 6/13/16.
//  Copyright © 2016 MS Open Tech. All rights reserved.
//

#import "ExchangeGraphService.h"

@implementation ExchangeGraphService

-(void)getGraphServiceClient:(void (^)(MSGraphClient* client, NSError *error))callback{
    
    [self getGraphServiceAccessToken:^(ADAuthenticationResult *result) {
        if(result != nil && result.status == AD_SUCCEEDED){
            NSString *accessToken = result.accessToken;
            MSBlockAuthenticationProvider *provider = [MSBlockAuthenticationProvider                 providerWithBlock:^(NSMutableURLRequest *request, MSAuthenticationCompletion completion) {
                NSString *oauthAuthorizationHeader = [NSString stringWithFormat:@"bearer %@", accessToken];
                [request setValue:oauthAuthorizationHeader forHTTPHeaderField:@"Authorization"];
                completion(request, nil);
            }];
            [MSGraphClient setAuthenticationProvider:provider];
            
            callback([MSGraphClient client], nil);
        }
        else{
            callback(nil, nil);
        }
    }];
}

-(void)getGraphServiceAccessToken:(void (^)(ADAuthenticationResult* result))callback{
    
    NSString* plistPath = [[NSBundle mainBundle] pathForResource:@"Auth" ofType:@"plist"];
    NSDictionary *content = [NSDictionary dictionaryWithContentsOfFile:plistPath];
    NSString *clientId = [content objectForKey:@"clientId"];
    NSString *graphResourceId = [content objectForKey:@"resourceId"];
    NSString *authority = [content objectForKey:@"authority"];
    NSString *redirectUriString = [content objectForKey:@"redirectUriString"];
    ADAuthenticationError *error;
    ADAuthenticationContext* context = [ADAuthenticationContext authenticationContextWithAuthority:authority error:&error];
    if (!context)
    {
        //here need
        callback(nil);
        return;
    }
    
    [context acquireTokenWithResource:graphResourceId clientId:clientId redirectUri:[NSURL URLWithString:redirectUriString] completionBlock:^(ADAuthenticationResult *result) {
        callback(result);
    }];
    
}

-(void)getFolders:(void (^)(NSArray * folders, NSError *error))getFoldersCallBack{
    [self getGraphServiceClient:^(MSGraphClient *client, NSError *error) {
        if(error != nil){
            getFoldersCallBack(nil, error);
        }
        else{
            [[[[[client me] mailFolders] request] orderBy:@"displayName"] getWithCompletion:^(MSCollection     *response, MSGraphUserMailFoldersCollectionRequest *nextRequest, NSError *error) {
                getFoldersCallBack(response.value, error);
            }];
        }
    }];
}

-(void)getFolderContent:(NSString*)folderId  callback:(void (^)(NSArray * messages, NSError *error))getFolderContentCallBack
{
    [self getGraphServiceClient:^(MSGraphClient *client, NSError *error) {
        if(error != nil){
            getFolderContentCallBack(nil, error);
        }
        else{
            NSString* plistPath = [[NSBundle mainBundle] pathForResource:@"Auth" ofType:@"plist"];
            NSDictionary *content = [NSDictionary dictionaryWithContentsOfFile:plistPath];
            NSString *graphResourceUrl = [content objectForKey:@"graphResourceUrl"];
            
            MSGraphUserMessagesCollectionRequestBuilder *builder = [[MSGraphUserMessagesCollectionRequestBuilder alloc] initWithURL:[NSURL URLWithString:[NSString stringWithFormat:@"%@/me/mailFolders/%@/messages",graphResourceUrl,folderId]] client:client];
            [[builder request] getWithCompletion:^(MSCollection *response, MSGraphUserMessagesCollectionRequest *nextRequest, NSError *error) {
                getFolderContentCallBack(response.value, error);
            }];
            
        }
    }];
}
@end
