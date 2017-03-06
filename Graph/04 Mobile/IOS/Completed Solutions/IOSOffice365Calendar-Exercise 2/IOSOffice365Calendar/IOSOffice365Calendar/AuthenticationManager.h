//
//  AuthenticationManager.h
//  IOSOffice365Calendar
//
//  Created by Microsoft on 1/4/16.
//  Copyright © 2016 Microsoft. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <ADALiOS/ADAL.h>
#import <orc/impl/impl.h>
#import <MSGraphSDK/MSGraphSDK.h>

@interface AuthenticationManager : NSObject

@property (readonly, nonatomic) ADALDependencyResolver *dependencyResolver;
//retrieve token
-(void)acquireAuthTokenWithResourceId:(NSString *)resourceId completionHandler:(void (^)(BOOL authenticated, NSString* accessToken))completionBlock;
//clear token
-(void)clearCredentials;

+(AuthenticationManager *)sharedInstance;
@end
