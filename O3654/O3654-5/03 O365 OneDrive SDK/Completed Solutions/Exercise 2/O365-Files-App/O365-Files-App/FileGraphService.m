//
//  FileGraphService.m
//  O365-Files-App
//
//  Created by canviz on 1/26/16.
//  Copyright © 2016 MS Open Tech. All rights reserved.
//

#import "FileGraphService.h"

@implementation FileGraphService
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
-(void)getFiles: (void (^)(NSArray *files, NSError *error))getFilesCallBack{
    
    [self getGraphServiceClient:^(MSGraphServiceClient *client, NSError *error) {
        if(error!=nil){
            getFilesCallBack(nil,error);
        }
        else{
            MSGraphServiceDriveItemCollectionFetcher *itemCollectionFetcher = [[MSGraphServiceDriveItemCollectionFetcher alloc] initWithUrl:@"/me/drive/root/children" parent:client];
            
            [itemCollectionFetcher readWithCallback:^(NSArray *itemCollection, MSOrcError *error) {
                getFilesCallBack(itemCollection,error);
            }];
        }
    }];
}
-(void)getFolderFiles:(NSString *)folderItemId callback:(void (^)(NSArray *files,NSError *error))getFilesCallBack{
    
    [self getGraphServiceClient:^(MSGraphServiceClient *client, NSError *error) {
        if(error!=nil){
            getFilesCallBack(nil,error);
        }
        else{
            MSGraphServiceDriveItemCollectionFetcher *itemCollectionFetcher = [[MSGraphServiceDriveItemCollectionFetcher alloc] initWithUrl:[NSString stringWithFormat:@"/me/drive/items/%@/children",folderItemId] parent:client];
            
            [itemCollectionFetcher readWithCallback:^(NSArray *itemCollection, MSOrcError *error) {
                getFilesCallBack(itemCollection,error);
            }];
        }
    }];
}
-(void)getFileContent:(NSString *)itemId callback:(void (^)(NSData *content,NSError *error))getFileContentCallBack{
    [self getGraphServiceClient:^(MSGraphServiceClient *client, NSError *error) {
        if(error!=nil){
            getFileContentCallBack(nil,error);
        }
        else{
            MSGraphServiceDriveItemFetcher *itemFetcher = [[MSGraphServiceDriveItemFetcher alloc] initWithUrl:[NSString stringWithFormat:@"/me/drive/items/%@",itemId] parent:client];
            
            MSOrcStreamFetcher *contentFetcher = [itemFetcher content];
            [contentFetcher getContentWithCallback:^(NSData *content, MSOrcError *error) {
                getFileContentCallBack(content,error);
            }];
        }
    }];
}
@end
