//
//  Copyright (c) 2014 MS-OpenTech All rights reserved.
//

#import <UIKit/UIKit.h>
@interface EditProjectViewController : UIViewController

- (IBAction)editProject:(id)sender;

@property (weak, nonatomic) IBOutlet UITextField *ProjectNameTxt;
@property NSString* token;

@property NSDictionary* project;
@end
