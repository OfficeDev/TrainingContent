//
//  ProjectClientEx.h
//  ResearchProjectTrackerApp
//
//  Created by canviz on 1/27/16.
//  Copyright © 2016 microsoft. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface ProjectClientEx : NSObject
- (NSURLSessionDataTask *)addReference:(NSDictionary *)reference token:(NSString *)token callback:(void (^)(NSError *))callback;
- (NSURLSessionDataTask *)getProjectsWithToken:(NSString *)token andCallback:(void (^)(NSMutableArray *listItems, NSError *))callback;
@end
