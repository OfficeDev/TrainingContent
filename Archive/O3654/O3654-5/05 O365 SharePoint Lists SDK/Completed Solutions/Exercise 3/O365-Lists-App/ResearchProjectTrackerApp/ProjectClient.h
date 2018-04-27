//
//  ProjectClient.h
//  ResearchProjectTrackerApp
//
//  Created by canviz on 1/27/16.
//  Copyright © 2016 microsoft. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface ProjectClient : NSObject
- (NSURLSessionDataTask *)addProject:(NSString *)listName token:(NSString *)token callback:(void (^)(NSError *error))callback;
- (NSURLSessionDataTask *)updateProject:(NSDictionary *)project token:(NSString *)token callback:(void (^)(BOOL, NSError *))callback;
- (NSURLSessionDataTask *)updateReference:(NSDictionary *)reference token:(NSString *)token callback:(void (^)(BOOL, NSError *))callback;
- (NSURLSessionDataTask *)addReference:(NSDictionary *)reference token:(NSString *)token callback:(void (^)(NSError *))callback;
- (NSURLSessionDataTask *)getReferencesByProjectId:(NSString *)projectId token:(NSString *)token callback:(void (^)(NSMutableArray *listItems, NSError *error))callback;
- (NSURLSessionDataTask *)deleteListItem:(NSString *)name itemId:(NSString *)itemId token:(NSString *)token callback:(void (^)(BOOL result, NSError *error))callback;
- (NSURLSessionDataTask *)getProjectsWithToken:(NSString *)token andCallback:(void (^)(NSMutableArray *listItems, NSError *))callback;
@end
