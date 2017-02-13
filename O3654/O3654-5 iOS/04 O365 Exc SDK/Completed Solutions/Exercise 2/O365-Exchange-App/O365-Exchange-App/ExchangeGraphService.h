//
//  ExchangeGraphService.h
//  O365-Exchange-App
//
//  Created by canviz on 2/4/17.
//  Copyright © 2017 Microsoft. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <MSGraphSDK.h>
#import <ADAL.h>
#import <MSBlockAuthenticationProvider.h>

@interface ExchangeGraphService : NSObject
-(void)getGraphServiceClient:(void (^)(MSGraphClient * client, NSError *error))getClientCallBack;
-(void)getFolders:(void (^)(NSArray * folders, NSError *error))getFoldersCallBack;
-(void)getFolderContent:(NSString*)folderId  callback:(void (^)(NSArray * messages, NSError *error))getFolderContentCallBack;
@end
