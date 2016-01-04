//
//  CalendarTableViewController.h
//  IOSOffice365Calendar
//
//  Created by Microsoft on 1/4/16.
//  Copyright © 2016 Microsoft. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <ADALiOS/ADAL.h>
#import <orc/impl/impl.h>
#import <MSGraph-SDK-iOS/MSGraphService.h>
@interface CalendarTableViewController : UITableViewController
@property (strong, nonatomic) NSMutableArray* eventsList;
@property (strong, nonatomic) MSGraphServiceClient *graphCilent;
-(void)initGraphClient:(MSGraphServiceClient *)client;
@end
