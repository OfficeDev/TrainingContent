//
//  ProjectClientEx.m
//  ResearchProjectTrackerApp
//
//  Created by canviz on 1/27/16.
//  Copyright © 2016 microsoft. All rights reserved.
//

#import "ProjectClientEx.h"
#import "NSString_Extended.h"
@implementation ProjectClientEx
const NSString *apiUrlStr = @"/_api/lists";

- (NSURLSessionDataTask *)addReference:(NSDictionary *)reference token:(NSString *)token callback:(void (^)(NSError *))callback
{
    NSString* plistPath = [[NSBundle mainBundle] pathForResource:@"Auth" ofType:@"plist"];
    NSDictionary *content = [NSDictionary dictionaryWithContentsOfFile:plistPath];
    NSString* shpUrl = [content objectForKey:@"o365SharepointTenantUrl"];
    
    NSString* referenceListName = @"Research%20References";
    NSString *url = [NSString stringWithFormat:@"%@%@/GetByTitle('%@')/Items", shpUrl , apiUrlStr, referenceListName];
    
    NSString *json = [[NSString alloc] init];
    json = @"{ 'URL': %@, 'Comments':'%@', 'Project':'%@'}";
    
    NSString *formatedJson = [NSString stringWithFormat:json, [reference valueForKey:@"URL"], [reference valueForKey:@"Comments"], [reference valueForKey:@"Project"]];
    
    NSData *jsonData = [formatedJson dataUsingEncoding: NSUTF8StringEncoding];
    
    
    NSMutableURLRequest *theRequest=[NSMutableURLRequest requestWithURL:[NSURL URLWithString:url]];
    [theRequest setHTTPMethod:@"POST"];
    [theRequest setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    [theRequest setValue:@"application/json; odata=verbose" forHTTPHeaderField:@"accept"];
    [theRequest addValue:[NSString stringWithFormat: @"Bearer %@", token] forHTTPHeaderField: @"Authorization"];
    [theRequest setHTTPBody:jsonData];
    
    
    NSURLSession *session = [NSURLSession sharedSession];
    NSURLSessionDataTask *task = [session dataTaskWithRequest:theRequest completionHandler:^(NSData  *data, NSURLResponse *reponse, NSError *error) {
        NSDictionary *jsonResult = [NSJSONSerialization JSONObjectWithData:data
                                                                   options: NSJSONReadingMutableContainers
                                                                     error:nil];
        NSString *myString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
        
        callback(error);
    }];
    
    return task;
}

- (NSURLSessionDataTask *)getProjectsWithToken:(NSString *)token andCallback:(void (^)(NSMutableArray *listItems, NSError *))callback{
    NSString* plistPath = [[NSBundle mainBundle] pathForResource:@"Auth" ofType:@"plist"];
    NSDictionary *content = [NSDictionary dictionaryWithContentsOfFile:plistPath];
    NSString* shpUrl = [content objectForKey:@"o365SharepointTenantUrl"];
    
    NSString* projectListName = @"Research%20Projects";
    NSString* filter = @"ID,Title,Modified,Editor/Title";
    NSString *aditionalParams = [NSString stringWithFormat:@"?$select=%@&$expand=Editor", [filter urlencode]];
    
    NSString *url = [NSString stringWithFormat:@"%@%@/GetByTitle('%@')/Items%@", shpUrl , apiUrlStr, projectListName, aditionalParams];
    
    
    NSMutableURLRequest *theRequest=[NSMutableURLRequest requestWithURL:[NSURL URLWithString:url]];
    [theRequest setHTTPMethod:@"GET"];
    [theRequest setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    [theRequest setValue:@"application/json; odata=verbose" forHTTPHeaderField:@"accept"];
    [theRequest addValue:[NSString stringWithFormat: @"Bearer %@", token] forHTTPHeaderField: @"Authorization"];
    
    
    NSURLSession *session = [NSURLSession sharedSession];
    NSURLSessionDataTask *task = [session dataTaskWithRequest:theRequest completionHandler:^(NSData  *data, NSURLResponse *reponse, NSError *error) {
        callback([self parseDataArray:data] ,error);
    }];
    
    return task;
}
- (NSMutableArray *)parseDataArray:(NSData *)data{
    
    NSMutableArray *array = [NSMutableArray array];
    
    NSError *error ;
    
    NSDictionary *jsonResult = [NSJSONSerialization JSONObjectWithData:[self sanitizeJson:data]
                                                               options: NSJSONReadingMutableContainers
                                                                 error:&error];
    
    NSArray *jsonArray = [[jsonResult valueForKey : @"d"] valueForKey : @"results"];
    
    if(jsonArray != nil){
        for (NSDictionary *value in jsonArray) {
            [array addObject: value];
        }
    }else{
        NSDictionary *jsonItem =[jsonResult valueForKey : @"d"];
        
        if(jsonItem != nil){
            [array addObject:jsonItem];
        }
    }
    
    return array;
}
- (NSData*) sanitizeJson : (NSData*) data{
    NSString * dataString = [[NSString alloc ] initWithData:data encoding:NSUTF8StringEncoding];
    
    NSString* replacedDataString = [dataString stringByReplacingOccurrencesOfString:@"E+308" withString:@"E+127"];
    
    NSData* bytes = [replacedDataString dataUsingEncoding:NSUTF8StringEncoding];
    
    return bytes;
}
@end
