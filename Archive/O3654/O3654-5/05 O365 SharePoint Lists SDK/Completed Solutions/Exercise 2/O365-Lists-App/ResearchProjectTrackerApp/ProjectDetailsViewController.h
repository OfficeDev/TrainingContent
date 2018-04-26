//
//  Copyright (c) 2014 MS-OpenTech All rights reserved.
//

#import <UIKit/UIKit.h>

@interface ProjectDetailsViewController : UIViewController <UITableViewDataSource>

@property NSString* token;
@property (weak, nonatomic) IBOutlet UILabel *projectName;
@property (weak, nonatomic) IBOutlet UITextField *projectNameField;
@property (weak, nonatomic) IBOutlet UILabel *referenceLbl;
@property (weak, nonatomic) IBOutlet UITableView *refencesTable;
@property (weak, nonatomic) IBOutlet UIBarButtonItem *projectDetailsDoneButton;
@property (strong, nonatomic) IBOutlet NSMutableArray *references;

@end
