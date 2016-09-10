//
//  FileGraphService.m
//  O365-Files-App
//
//  Created by Microsoft on 6/13/16.
//  Copyright © 2016 MS Open Tech. All rights reserved.
//

#import "FileGraphService.h"

@implementation FileGraphService
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

-(void)getFiles: (void (^)(NSArray *files, NSError *error))getFilesCallBack{
    
    [self getGraphServiceClient:^(MSGraphClient *client, NSError *error) {
        if(client != nil){
            [[[[[[client me] drive] root] children] request]  getWithCompletion:^(MSCollection *response,             MSGraphDriveItemChildrenCollectionRequest *nextRequest, NSError *error) {
                if(error != nil){
                    getFilesCallBack(nil, error);
                }
                else{
                    getFilesCallBack(response.value, nil);
                }
            }];
        }}];
}

-(void)getFolderFiles:(NSString *)folderItemId callback:(void (^)(NSArray *files,NSError *error))getFilesCallBack{
    
    [self getGraphServiceClient:^(MSGraphClient *client, NSError *error) {
        NSString* plistPath = [[NSBundle mainBundle] pathForResource:@"Auth" ofType:@"plist"];
        NSDictionary *content = [NSDictionary dictionaryWithContentsOfFile:plistPath];
        NSString *graphResourceUrl = [content objectForKey:@"graphResourceUrl"];
        
        MSGraphDriveItemsCollectionRequestBuilder *builder = [[MSGraphDriveItemsCollectionRequestBuilder alloc] initWithURL:[NSURL URLWithString:[NSString stringWithFormat:@"%@/me/drive/items/%@/children",graphResourceUrl,folderItemId]] client:client];
        [[builder request] getWithCompletion:^(MSCollection *response, MSGraphDriveItemsCollectionRequest *nextRequest, NSError *error) {
            if(error != nil){
                getFilesCallBack(nil, error);
            }
            else{
                getFilesCallBack(response.value, nil);
            }
        }];
    }];
}

-(void)getFileContent:(NSString *)itemId callback:(void (^)(NSData *content,NSError *error))getFileContentCallBack{
    
    [self getGraphServiceClient:^(MSGraphClient *client, NSError *error) {
        NSString* plistPath = [[NSBundle mainBundle] pathForResource:@"Auth" ofType:@"plist"];
        NSDictionary *content = [NSDictionary dictionaryWithContentsOfFile:plistPath];
        NSString *graphResourceUrl = [content objectForKey:@"graphResourceUrl"];
        
        MSGraphDriveItemRequestBuilder *builder = [[MSGraphDriveItemRequestBuilder alloc] initWithURL:[NSURL URLWithString:[NSString stringWithFormat:@"%@/me/drive/items/%@", graphResourceUrl,itemId]] client:client];
        [[builder contentRequest] downloadWithCompletion:^(NSURL *location, NSURLResponse *response, NSError *error) {
            if(error != nil){
                
                getFileContentCallBack(nil, error);
            }
            else{
                NSData *dateContent = [NSData dataWithContentsOfURL:location];
                getFileContentCallBack(dateContent, nil);
            }
        }];
    }];
    
}
@end
