//
//  ExchangeGraphService.h
//  O365-Exchange-App
//
//  Created by canviz on 1/26/16.
//  Copyright © 2016 MS Open Tech. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <ADALiOS/ADAL.h>
#import <impl/impl.h>
#import <MSGraph-SDK-iOS/MSGraphService.h>
#import <MSGraph-SDK-iOS/MSGraphServiceClient.h>

@interface ExchangeGraphService : NSObject
-(void)getGraphServiceClient:(void (^)(MSGraphServiceClient * client, NSError *error))getClientCallBack;
-(void)getFolders:(void (^)(NSArray * folders, NSError *error))getFoldersCallBack;
-(void)getFolderContent:(NSString*)folderId  callback:(void (^)(NSArray * messages, NSError *error))getFolderContentCallBack;
@end
