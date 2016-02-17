//
//  FileGraphService.h
//  O365-Files-App
//
//  Created by canviz on 1/26/16.
//  Copyright © 2016 MS Open Tech. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <ADALiOS/ADAL.h>
#import <impl/impl.h>
#import <MSGraph-SDK-iOS/MSGraphService.h>
#import <MSGraph-SDK-iOS/MSGraphServiceClient.h>
@interface FileGraphService : NSObject
-(void)getGraphServiceClient:(void (^)(MSGraphServiceClient * client, NSError *error))getClientCallBack;
-(void)getFiles:(void (^)(NSArray *files,NSError *error))getFilesCallBack;
-(void)getFolderFiles:(NSString *)folderItemId callback:(void (^)(NSArray *files,NSError *error))getFilesCallBack;
@end
