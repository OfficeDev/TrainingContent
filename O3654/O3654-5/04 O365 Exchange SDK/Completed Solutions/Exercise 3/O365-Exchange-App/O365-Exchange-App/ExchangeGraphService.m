//
//  ExchangeGraphService.m
//  O365-Exchange-App
//
//  Created by canviz on 1/26/16.
//  Copyright © 2016 MS Open Tech. All rights reserved.
//

#import "ExchangeGraphService.h"


@implementation ExchangeGraphService
-(void)getGraphServiceClient:(void (^)(MSGraphServiceClient * client, NSError *error))getClientCallBack{
    NSString* plistPath = [[NSBundle mainBundle] pathForResource:@"Auth" ofType:@"plist"];
    NSDictionary *content = [NSDictionary dictionaryWithContentsOfFile:plistPath];
    
    NSString* authority = [content objectForKey:@"authority"];
    NSString* resourceId = [content objectForKey:@"resourceId"];
    NSString* clientId = [content objectForKey:@"clientId"];
    NSString* redirectUriString = [content objectForKey:@"redirectUriString"];
    NSString* graphResourceUrl = [content objectForKey:@"graphResourceUrl"];
    
    ADAuthenticationError *error;
    ADAuthenticationContext* context = [ADAuthenticationContext authenticationContextWithAuthority:authority error:&error];
    
    if (!context)
    {
        getClientCallBack(nil,error);
        return;
    };
    
    ADALDependencyResolver *resolver = [[ADALDependencyResolver alloc] initWithContext:context resourceId:resourceId clientId: clientId redirectUri:[NSURL URLWithString:redirectUriString]];
    MSGraphServiceClient *client = [[MSGraphServiceClient alloc] initWithUrl:graphResourceUrl dependencyResolver:resolver];
    
    getClientCallBack(client,nil);
}

-(void)getFolders:(void (^)(NSArray * folders, NSError *error))getFoldersCallBack{
    [self getGraphServiceClient:^(MSGraphServiceClient *client, NSError *error) {
        if(error!=nil){
            getFoldersCallBack(nil,error);
        }
        else{
            MSGraphServiceMailFolderCollectionFetcher *itemCollectionFetcher = [[[MSGraphServiceMailFolderCollectionFetcher alloc] initWithUrl:@"/me/mailFolders" parent:client] orderBy:@"displayName"];
            
            [itemCollectionFetcher readWithCallback:^(NSArray *itemCollection, MSOrcError *error) {
                getFoldersCallBack(itemCollection,error);
            }];
        }
    }];
}
-(void)getFolderContent:(NSString*)folderId  callback:(void (^)(NSArray * messages, NSError *error))getFolderContentCallBack
{
    
    [self getGraphServiceClient:^(MSGraphServiceClient *client, NSError *error) {
        if(error!=nil){
            getFolderContentCallBack(nil,error);
        }
        else{
            MSGraphServiceMessageCollectionFetcher *itemCollectionFetcher = [[MSGraphServiceMessageCollectionFetcher alloc] initWithUrl:[NSString stringWithFormat:@"/me/mailFolders/%@/messages",folderId] parent:client];
            
            [itemCollectionFetcher readWithCallback:^(NSArray *itemCollection, MSOrcError *error) {
                getFolderContentCallBack(itemCollection,error);
            }];
        }
    }];
}
@end
