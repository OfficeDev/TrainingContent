//
//  FileGraphService.h
//  O365-Files-App
//
//  Created by Microsoft on 5/27/16.
//  Copyright © 2016 MS Open Tech. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <MSGraphSDK.h>
#import <ADAL.h>
#import <MSBlockAuthenticationProvider.h>

@interface FileGraphService : NSObject
-(void)getGraphServiceClient:(void (^)(MSGraphClient * client, NSError *error))getClientCallBack;
-(void)getFiles:(void (^)(NSArray *files,NSError *error))getFilesCallBack;
-(void)getFolderFiles:(NSString *)folderItemId callback:(void (^)(NSArray *files,NSError *error))getFilesCallBack;
-(void)getFileContent:(NSString *)itemId callback:(void (^)(NSData *content,NSError *error))getFileContentCallBack;
@end
