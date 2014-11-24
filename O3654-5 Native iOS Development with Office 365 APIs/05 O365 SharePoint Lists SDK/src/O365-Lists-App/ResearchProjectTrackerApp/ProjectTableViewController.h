//
//  Copyright (c) 2014 MS-OpenTech All rights reserved.
//

#import <UIKit/UIKit.h>
#import "CreateViewController.h"

@interface ProjectTableViewController : UIViewController

@property NSMutableArray *projectsList;
@property NSString* token;
@property (weak, nonatomic) IBOutlet UITableView *tableView;
@end